import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userPlantService, useAuth } from "@project/frontend-shared";
import type { IUserPlantDTO, ISensorDTO, IMeasurementDTO } from "@project/shared";
import { api } from "../src/api";
import MeasurementsChart from "./MeasurementsChart";

export default function MyPlantDetailsPage() {
    //reads route param from URL - if /my/plants/123 id will be 123
    const { id } = useParams();
    //gets token
    const { token } = useAuth();
    //navigation
    const navigate = useNavigate();
    const plantService = userPlantService(api);
    //stores current plant details
    const [plant, setPlant] = useState<IUserPlantDTO | null>(null);
    //stores sensors connected to this plant
    const [sensors, setSensors] = useState<ISensorDTO[]>([]);
    //loading state: shows text when loading
    const [measurements, setMeasurements] = useState<IMeasurementDTO[]>([]);
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
                //backend: GET /my/plants/:id/measurements
                const measurementData = await plantService.getMeasurements(id);
                setMeasurements(measurementData);
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
                userPlantId: 123,
                online: true,
                last_seen: new Date(),
            },
            {
                id: 2,
                userPlantId: 123,
                online: false,
                last_seen: new Date(),
            },
        ];

        const demoMeasurements: IMeasurementDTO[] = [
            { id: 1, plantId: 1, timestamp: new Date("2025-06-01T08:00:00"), values: { moisture: 65, soil: 6.8, temp: 22 } },
            { id: 2, plantId: 1, timestamp: new Date("2025-06-01T12:00:00"), values: { moisture: 60, soil: 6.5, temp: 23 } },
            { id: 3, plantId: 1, timestamp: new Date("2025-06-01T16:00:00"), values: { moisture: 55, soil: 6.2, temp: 24 } },
            { id: 4, plantId: 1, timestamp: new Date("2025-06-01T20:00:00"), values: { moisture: 70, soil: 7.0, temp: 21 } },
            { id: 5, plantId: 1, timestamp: new Date("2025-06-02T08:00:00"), values: { moisture: 68, soil: 6.9, temp: 20 } },
        ];

        setMeasurements(demoMeasurements);
        setPlant(demoPlant);
        setSensors(demoSensors);
        setLoading(false);
    }, []);
    //remove for backend
    const handleDeleteSensor = async (sensorId: number) => {
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
    };
    //demo - without API call - removes local state
    /*const handleDeleteSensor = (sensorId: number) => {
        setSensors((prev) =>
            //removes local state
            prev.filter((s) => s.id !== sensorId)
        );
    };*/

    if (loading) return <p>Loading ...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!plant) return <p>Plant not found</p>;

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark dark-green-navbar px-4">
                    <div className="navbar-brand fw-bold">
                        PlantIT
                    </div>

                    <button
                        className="btn dark-green-btn ms-3"
                        onClick={() => navigate("/my/plants")}
                    >
                        Back
                    </button>
            </nav>

            <div className="container mt-4">

                {plant.imageUrl && (
                    <img
                        src={plant.imageUrl}
                        alt={plant.name}
                        style={{
                            width: "100%",
                            maxHeight: "320px",
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

                            <div className="mt-3">
                                <div className="text-uppercase" style={{ fontSize: "20px", color: "#9fbf9f", fontWeight: 700 }}>
                                Species ID
                                </div>
                                <div className="mb-2">{plant.plantSpecieId}</div>

                                <div className="text-uppercase" style={{ fontSize: "20px", color: "#9fbf9f", fontWeight: 700 }}>
                                Plant ID
                                </div>
                                <div>{plant.id}</div>
                            </div>
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
                    </div>

                    {sensors.length === 0 ? (
                        <p>No sensors connected.</p>
                    ) : (
                        sensors.map((sensor) => (
                            <div
                                key={sensor.id}
                                className="border p-3 rounded mb-2"
                            >
                                <div>
                                    <div className="text-uppercase" style={{ fontSize: "20px", color: "#9fbf9f", fontWeight: 700 }}>
                                        PlantId:
                                    </div>
                                    <div className="mb-2">{sensor.userPlantId}</div>

                                    <div className="text-uppercase" style={{ fontSize: "20px", color: "#9fbf9f", fontWeight: 700 }}>
                                        Status
                                    </div>
                                    <div className="mb-2">
                                        {sensor.online ? "Online" : "Offline"}
                                    </div>
                                </div>

                                <button
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: "#7A2E2E",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "10px",
                                        padding: "8px 14px",
                                        fontWeight: 600,
                                    }}
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
                 <div className="dark-green-card p-4 shadow-sm mt-4">
                        <h3 className="fw-bold mb-3">Measurements</h3>

                        {measurements.length === 0 ? (
                            <p>No measurements available.</p>
                        ) : (
                            <MeasurementsChart measurements={measurements} />
                        )}
                    </div>
            </div>
        </div>
    );
}