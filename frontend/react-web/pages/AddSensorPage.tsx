import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userPlantService, useAuth } from "@project/frontend-shared";
import type { IUserPlantDTO } from "@project/shared";
import { api } from "../src/api";
//plant api service
const userPlant = userPlantService(api);

export default function AddSensorPage() {
    //reads plantId from URL - if /my/plants/123/add-sensor plantId will be 123
    const { plantId } = useParams();
    const navigate = useNavigate();
    //gets token
    const { token } = useAuth();
    //stores plant details
    const [plant, setPlant] = useState<IUserPlantDTO | null>(null);
    //loading state for API calls
    const [loading, setLoading] = useState(false);
    //stores API errors
    const [errors, setErrors] = useState<string[]>([]);
    //redirects to login if no token
    useEffect(() => {
        if (!token) {
        navigate("/login");
        return;
        }
    }, [token, navigate]);
    //loads plant details - to show plant name on page
    useEffect(() => {
        const loadPlant = async () => {
        try {
            setLoading(true);
            //backend: GET /my/plants/:id
            const data = await userPlant.getById(plantId!);
            //stores plant details in state
            setPlant(data);
        } catch {
            setErrors(["Failed to load plant"]);
        } finally {
            setLoading(false);
        }
        };
        if (plantId) loadPlant();
    }, [plantId]);
    //when user presses add sensor button
    const handleCreateSensor = async () => {
        //redirects to login if no token
        if (!token) {
            navigate("/login");
            return;
        }

        setErrors([]);
        setLoading(true);

        try {
            //backend: POST /my/plants/:id/sensors
            await userPlant.addSensor(plantId!);
            navigate(-1);
        } catch (error: any) {
            setErrors([error.message || "Failed to add sensor"]);
        } finally {
            setLoading(false);
        }
    };
    //shows loading text if loading and no plant data yet
    if (loading && !plant) {
        return <p style={{ color: "white" }}>Loading plant...</p>;
    }

    return (
        <div>
        <nav className="navbar navbar-expand-lg navbar-dark dark-green-navbar px-4">
            <div className="navbar-brand fw-bold">PlantIT</div>
            <button
            className="btn dark-green-btn ms-3"
            onClick={() => navigate(-1)}
            >
            Back
            </button>
        </nav>

        <div className="container mt-4 d-flex justify-content-center">
            <div
            className="dark-green-card p-4 shadow-lg w-100"
            style={{ maxWidth: "800px" }}
            >
            <h1 className="text-center mb-4 fw-bold">Add Sensor</h1>

            {errors.length > 0 && (
                <div className="alert alert-danger mb-3">
                <ul className="mb-0 list-unstyled">
                    {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                    ))}
                </ul>
                </div>
            )}

            {plant && (
                <p className="text-white mb-4">
                <strong>Plant:</strong> {plant.name}
                </p>
            )}

            <button
                className="btn dark-green-btn w-100"
                onClick={handleCreateSensor}
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1 }}
            >
                {loading ? "Adding sensor..." : "Add Sensor"}
            </button>
            </div>
        </div>
        </div>
    );
}