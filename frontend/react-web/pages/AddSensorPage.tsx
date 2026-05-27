import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userPlantService, useAuth } from "@project/frontend-shared";
import type { IUserPlantDTO } from "@project/shared";
import { api } from "../src/api";
//creates api for user
const userPlant = userPlantService(api);

export default function AddSensorPage() {
    //reads plant id from url - so /my/.../123/add-sensor, id is 123
    const { id } = useParams();
    //navigation
    const navigate = useNavigate();
    //gets token
    const { token } = useAuth();
    //plants fetched from backend
    const [plant, setPlant] = useState<IUserPlantDTO | null>(null);
    //demo plant
    /*const [plant] = useState<IUserPlantDTO>({
        id: 1,
        name: "Demo Plant",
        imageUrl: "",
        plantSpecieId: 1 
    });*/
    //loading while plant is fetched
    const [loading, setLoading] = useState(true);
    //stores errors
    const [error, setError] = useState<string | null>(null);
    //true while creating sensor
    const [saving, setSaving] = useState(false);
    //stores input name
    const [sensorName, setSensorName] = useState("");
    //remove for backend
    useEffect(() => {
        const loadPlant = async () => {
            //stops if route param is missing
            if (!id) return;

            try {
                //backend: GET /my/plants/:id
                const data = await userPlant.getById(id);
                setPlant(data);
            } catch {
                setError("Failed to load plant");
            } finally {
                setLoading(false);
            }
        };

        loadPlant();
    }, [id]); //reloads if plant id changes
    //remove for backend
    //is user logged in?
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);
    //runs when user clicks add sensor
    const handleCreateSensor = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (!sensorName.trim()) {
            setError("Sensor name is required");
            return;
        }

        //only if plant exists
        if (!id) {
            setError("Missing plant ID");
            return;
            }

        try {
            //disables button
            setSaving(true);
            //backend: POST /my/plants/:id/sensors- requested body - name
            await userPlant.addSensor(id, {
                name: sensorName
            });
            //success: redirects to plant details page
            navigate(`/my/plants/${id}`);
        } catch {
            setError("Failed to add sensor");
        } finally {
            setSaving(false);
        }
    };
    //remove for backend
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!plant) return <p>Plant not found</p>;

   return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark dark-green-navbar px-4">
                <a
                    className="navbar-brand fw-bold"
                    onClick={() => navigate("/home")}
                    style={{ cursor: "pointer" }}
                >
                    PlantIT
                </a>

                <button
                    className="btn dark-green-btn ms-3"
                    onClick={() => navigate(`/my/plants/${id}`)}
                >
                    Back
                </button>
            </nav>

            <div className="container mt-4">
                <div className="dark-green-card p-4 shadow-lg w-100" style={{ maxWidth: "700px" }}>

                    <h2 className="fw-bold mb-3">
                        Add Sensor
                    </h2>

                    <p className="mb-3">
                        <strong>Plant:</strong> {plant.name}
                    </p>

                    <input
                        className="form-control dark-green-input mb-3"
                        placeholder="Sensor name"
                        value={sensorName}
                        onChange={(e) => setSensorName(e.target.value)}
                    />

                    <button
                        className="btn dark-green-btn w-100"
                        onClick={handleCreateSensor}
                        disabled={saving}
                    >
                        {saving ? "Adding sensor..." : "+ Add Sensor"}
                    </button>
                </div>
            </div>
        </div>
    );
}