import os
import time
import json
import requests
import psycopg2
from minio import Minio

PLANTS = [
    {
        "id": 1,
        "name": "Aloe vera",
        "description": "Succulent with thick gel-filled leaves used for burns and skincare. Thrives on neglect and full sun.",
        "ideal_values": {"moisture": 20, "temperature": 24, "light_level": 9},
        "image_url": "https://images.pexels.com/photos/7408838/pexels-photo-7408838.jpeg",
        "image_name": "aloe_vera.jpeg"
    },
    {
        "id": 2,
        "name": "Cactus mix",
        "description": "Desert survivors with sculptural forms and minimal water needs.",
        "ideal_values": {"moisture": 15, "temperature": 24, "light_level": 10},
        "image_url": "https://images.pexels.com/photos/28964981/pexels-photo-28964981.jpeg",
        "image_name": "cactus_mix.jpeg"
    },
    {
        "id": 3,
        "name": "Caladium",
        "description": "Stunning tropical plant with large, colorful heart-shaped leaves.",
        "ideal_values": {"moisture": 70, "temperature": 24, "light_level": 3},
        "image_url": "https://images.pexels.com/photos/23079347/pexels-photo-23079347.jpeg",
        "image_name": "caladium.jpeg"
    },
    {
        "id": 4,
        "name": "Lavender",
        "description": "Fragrant Mediterranean herb with purple flower spikes.",
        "ideal_values": {"moisture": 30, "temperature": 20, "light_level": 8},
        "image_url": "https://images.pexels.com/photos/12686034/pexels-photo-12686034.jpeg",
        "image_name": "lavender.jpeg"
    },
    {
        "id": 5,
        "name": "Strawberry",
        "description": "Sweet fruiting plant with white flowers and bright red berries.",
        "ideal_values": {"moisture": 60, "temperature": 18, "light_level": 7},
        "image_url": "https://images.pexels.com/photos/89778/strawberries-frisch-ripe-sweet-89778.jpeg",
        "image_name": "strawberry.jpeg"
    },
]

BUCKET = "species"

def wait_for_table(conn, retries=15, delay=3):
    for i in range(retries):
        try:
            with conn.cursor() as cur:
                cur.execute('SELECT 1 FROM "PlantSpecies" LIMIT 1')
            print("[DB] Table ready!")
            return
        except Exception:
            conn.rollback()
            print(f"[DB] Waiting for table... ({i+1}/{retries})")
            time.sleep(delay)
    raise Exception("PlantSpecies table not found after retries")

def upload_to_minio(client, plant):
    image_path = f"/tmp/{plant['image_name']}"
    r = requests.get(plant["image_url"], timeout=15)
    r.raise_for_status()
    with open(image_path, "wb") as f:
        f.write(r.content)

    object_name = f"seed/{plant['image_name']}"
    client.fput_object(BUCKET, object_name, image_path)
    print(f"[MinIO] Uploaded {object_name}")
    return f"{BUCKET}/{object_name}"

def seed_db(conn, plant, image_path):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO "PlantSpecies" (id, name, description, "idealValues", "imagePath")
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING;
        """, (
            plant["id"],
            plant["name"],
            plant["description"],
            json.dumps(plant["ideal_values"]),
            image_path
        ))
        cur.execute("""
            SELECT setval(
                pg_get_serial_sequence('"PlantSpecies"', 'id'),
                (SELECT MAX(id) FROM "PlantSpecies")
            );
        """)
    conn.commit()
    print(f"[DB] Inserted {plant['name']} with id={plant['id']}")


def main():
    print("[Seeder] Waiting for backend to apply migrations...")
    time.sleep(10)
    # дальше как обычно
    minio_client = Minio(
        f"{os.environ.get('MINIO_ENDPOINT', 'minio')}:{os.environ.get('MINIO_PORT', '9000')}",
        access_key=os.environ.get("MINIO_ROOT_USER"),
        secret_key=os.environ.get("MINIO_ROOT_PASSWORD"),
        secure=False
    )

    conn = psycopg2.connect(os.environ.get("DATABASE_URL"))

    try:
        wait_for_table(conn)

        for plant in PLANTS:
            try:
                image_path = upload_to_minio(minio_client, plant)
                seed_db(conn, plant, image_path)
            except Exception as e:
                conn.rollback()
                print(f"[ERROR] {plant['name']}: {e}")

        print("[DONE] Seeding complete.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()