import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userPlantService, useAuth } from "@project/frontend-shared";
import type { IUserPlantDTO, ISensorDTO } from "@project/shared";
import { api } from "../src/api";

export default function MyPlantDetailsPage() {
    //reads route param from URL - if /my/plants/123 id will be 123
    const { id } = useParams();
    const { token } = useAuth();
    //convert to boolean
    const isLoggedIn = !!token;
    //navigation
    const navigate = useNavigate();
    const plantService = userPlantService(api);
    //stores current plant details
    const [plant, setPlant] = useState<IUserPlantDTO | null>(null);
    //stores sensors connected to this plant
    const [sensors, setSensors] = useState<ISensorDTO[]>([]);
    //loading state: shows text when loading
    const [loading, setLoading] = useState(true);
    //stores API errors
    const [error, setError] = useState<string | null>(null);
    //remove for backend
    /*useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        //dependency is [id] - if id plant changes it reloads
        const load = async () => {
            try{
            //safeguard if url has no id
                if (!id) return;

                //backend: GET /my/plants/:id
                const plantData = await plantService.getById(id);
                setPlant(plantData);
                //backend: GET /my/plants/:id/sensors
                const sensorData = await plantService.getSensors(id);
                setSensors(sensorData);

            } catch {
                setError("Failed to load plant details");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, token, navigate]);*/
    //demo for fake local data
    useEffect(() => {
        const demoPlant: IUserPlantDTO = {
            id: 123,
            name: "Monstera Deliciosa",
            imageUrl:
                "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200",

            plantSpecieId: 1,
        };

        const demoSensors: ISensorDTO[] = [
            {
                id: 1,
                internal_chip_id: "ESP32-001",
                online: true,
                last_seen: new Date(),
            },
            {
                id: 2,
                internal_chip_id: "ESP32-002",
                online: false,
                last_seen: new Date(),
            },
        ];

        setPlant(demoPlant);
        setSensors(demoSensors);
        setLoading(false);
    }, []);
    //happens when user clicks add sensor -> opens add sensor page
    const handleAddSensor = () => {
        if (!id) return;
        navigate(`/my/plants/${id}/add-sensor`);
    };
    //remove for backend
    /*const handleDeleteSensor = async (sensorId: number) => {
        try {
            //checks id
            if (!id) return;
            //backend: DELETE /my/plants/:id/sensors/:sensorId
            await plantService.deleteSensor(id, String(sensorId));
            //removes deleted sensor from page
            setSensors((prev) =>
                prev.filter((s) => s.id !== sensorId)
            );
            setError(null);
        } catch {
            console.log("Failed to delete sensor");
        }
    };*/
    //demo - without API call - removes local state
    const handleDeleteSensor = (sensorId: number) => {
        setSensors((prev) =>
            prev.filter((s) => s.id !== sensorId)
        );
    };

    if (loading) return <p>Loading ...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!plant) return <p>Plant not found</p>;

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark dark-green-navbar px-4">
                <div className="d-flex align-items-center">
                    <a
                        className="navbar-brand fw-bold"
                        onClick={() => navigate("/home")}
                        style={{ cursor: "pointer" }}
                    >
                        PlantIT
                    </a>

                    <button
                        className="btn dark-green-btn ms-3"
                        onClick={() => navigate("/my/plants")}
                    >
                        Back
                    </button>
                </div>
            </nav>

            <div className="container mt-4">

                {plant.imageUrl && (
                    <img
                        src={plant.imageUrl}
                        alt={plant.name}
                        style={{
                            width: "100%",
                            maxHeight: "400px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            marginBottom: "20px",
                        }}
                    />
                )}

                <div className="dark-green-card p-4 shadow-sm mb-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h1 className="fw-bold">{plant.name}</h1>

                            <p>
                                <strong>Species:</strong> {plant.plantSpecieId}
                            </p>

                            <p>
                                <strong>ID:</strong> {plant.id}
                            </p>
                        </div>

                        <button
                            className="btn dark-green-btn"
                            onClick={() => navigate(`/my/plants/${plant.id}/edit`)}
                        >
                            Edit plant
                        </button>
                    </div>
                </div>

                <div className="dark-green-card p-4 shadow-sm">

                    {error && (
                        <div className="alert alert-danger mb-3">
                            {error}
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="fw-bold mb-0">Sensors</h3>

                        <button
                            className="btn dark-green-btn"
                            onClick={handleAddSensor}
                        >
                            + Add Sensor
                        </button>
                    </div>

                    {sensors.length === 0 ? (
                        <p>No sensors connected.</p>
                    ) : (
                        sensors.map((sensor) => (
                            <div
                                key={sensor.id}
                                className="border p-3 rounded mb-2"
                            >
                                <p className="mb-1">
                                    <strong>Name:</strong>{" "}
                                    {sensor.internal_chip_id}
                                </p>

                                <p className="mb-2">
                                    <strong>Status:</strong>{" "}
                                    {sensor.online ? "Online" : "Offline"}
                                </p>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                        handleDeleteSensor(sensor.id)
                                    }
                                >
                                    Delete sensor
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}