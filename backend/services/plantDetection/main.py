import p_model
from tensorflow.keras.preprocessing import image
import numpy as np
import json
import os
import pika
from dotenv import load_dotenv
import requests
from urllib.parse import urlparse
from PIL import Image

load_dotenv()

RABBITMQ_URL = os.environ.get("RABBITMQ_URL_PLANT_DETECTION", "amqp://guest:guest@localhost:5672/")

TASK_QUEUE = "pdet.task.queue"
RESULT_QUEUE = "pdet.result.queue"

def predict(img_path) -> int:
    img = image.load_img(img_path, target_size=(224, 224)) # shrink to 224x224
    arr = image.img_to_array(img)
    arr = np.expand_dims(arr, axis=0) # from [224,224,3] to [1,224,224,3]

    preds = p_model.model.predict(arr)
    idx = np.argmax(preds) # get the highest value from array.
    # print(f"Prediction: {p_model.CLASS_NAMES[idx]} (Accuracy: {np.max(preds) * 100:.2f}%)")
    return int(idx)


def process_request(ch, method, properties, body):
    try:
        filename = ""
        request_id = -1

        task_data = json.loads(body.decode("utf-8"))
        request_id = task_data.get("requestId")
        image_url = task_data.get("imageUrl")

        if request_id is None or not image_url:
            raise Exception
            return


        response = requests.get(image_url, timeout=10, stream=True)
        response.raise_for_status()

        parsed_url = urlparse(image_url)
        _, extension = os.path.splitext(parsed_url.path)
        if not extension:
            extension = ".jpg"

        print(f"\nparsed_url: {extension}\n")
    
        filename = f"img_request_{request_id}{extension}"

        with open(filename, "wb") as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)

        plant_species_id = predict(filename)

        result_payload = {
            "request_id": request_id,
            "plantSpeciesId": plant_species_id,
            "status": "DONE"
        }

        print(f"Request {request_id} processed successfully.")
    except Exception as e:
        print(f"Error processing request {request_id}: {e}")
        result_payload = {
            "request_id": request_id if request_id else "UNKNOWN",
            "status": "FAILED"
        }
    finally:
        if filename and os.path.exists(filename):
            os.remove(filename)

        ch.basic_publish(
            exchange='amq.topic',
            routing_key=RESULT_QUEUE,
            body=json.dumps(result_payload),
            properties=pika.BasicProperties(
                delivery_mode=2 
            )
        )
        print(f"Sent result for request {request_id} to {RESULT_QUEUE}")
        ch.basic_ack(delivery_tag=method.delivery_tag)

def connect_to_rmq():
    parameters = pika.URLParameters(RABBITMQ_URL)

    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    channel.basic_qos(prefetch_count=1)
    # channel.basic_consume(queue="pdet.task.queue", on_message_callback=callback)
    channel.basic_consume(queue=TASK_QUEUE, on_message_callback=process_request)

    print(f"Waiting for messages. To exit press CTRL+C")
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
    finally:
        connection.close()


if __name__ == "__main__":
    # print(f"url: {RABBITMQ_URL}")
    print(f"taskqueue: {TASK_QUEUE}")
    connect_to_rmq()