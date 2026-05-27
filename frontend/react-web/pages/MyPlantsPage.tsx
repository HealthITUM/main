import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userPlantService, userService, useAuth } from "@project/frontend-shared";
import type { IUserDTO, IUserPlantDTO } from "@project/shared";
import { api } from "../src/api";
//api for user and plant
const userPlant = userPlantService(api);
const service = userService(api);

export default function MyPlantsPage() {
    //navigation
    const navigate = useNavigate();
    //authentication check - gets JWT token from browser storage
    const { token, logout } = useAuth();
    //converts value to boolean
    //is logged in shows correct account menu
    const isLoggedIn = !!token;
    //stores all fetched plants
    const [plants, setPlants] = useState<IUserPlantDTO[]>([]);
    //are plants still loading
    const [loadingPlants, setLoadingPlants] = useState(true);
    //if user is still loading
    const [loadingUser, setLoadingUser] = useState(true);
    //error messages
    const [error, setError] = useState<string | null>(null);
    //stores logged in user object
    const [user, setUser] = useState<IUserDTO | null>(null);
    //stores text that is entered in search field
    const [nameFilter, setNameFilter] = useState("");
    //remove for backend
    //runs after componend is rendered
    /*+useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        //async function to call backend
        const loadUser = async () => {
            try {
                //calls backend: GET /user/me - JWT token, validates user, return logged in user data
                const me = await service.getMe();
                setUser(me);
            } catch {
                //invalid token - expired, missing, unauthorized request
                logout();
                navigate("/login");
            } finally {
                //mark user check complete
                setLoadingUser(false);
            }
        };

        loadUser();
    }, [navigate, service, service]); //runs once when page loads - checks if token is valid, fetches user info*/
    //for user changes
    /*useEffect(() => {
        //async function to call backend
        const fetchPlants = async () => {
            try {
                //returns user plants - GET /my/plants
                const data = await userPlant.getAll();
                //stores
                setPlants(data);
            } catch {
                setError("Failed to load plants");
            } finally {
                setLoadingPlants(false);
            }
        };

        fetchPlants();
    }, []); //runs when page is loaded*/
    //fake data
    useEffect(() => {
        const fakePlants: IUserPlantDTO[] = [
            {
                id: 1,
                name: "Monstera Deliciosa",
                imageUrl:
                    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
                plantSpecieId: 101,
            },
        ];

        setPlants(fakePlants);
        setLoadingPlants(false);
    }, []);

    //filtered array for search text - which plants
    const filteredPlants = plants.filter((plant) =>
        //if empty it shows all
        nameFilter.trim() === "" ||
        //checks plant name
        plant.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
    //remove for backend
    //if (loadingUser) return <p>Loading user...</p>;
    //if (!user) return null;
    //if (loadingPlants) return <p>Loading plants...</p>;

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
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>
                </div>

                <div className="ms-auto dropdown">
                    <button
                        className="btn dark-green-btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        style={{ backgroundColor: "rgba(255,255,255,0.2)"}}
                    >
                        Account
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end green-dropdown">
                        {!isLoggedIn ? (
                            <>
                                <li>
                                    <button className="dropdown-item" onClick={() => navigate("/login")}>
                                        Login
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => navigate("/register")}>
                                        Register
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button className="dropdown-item" onClick={() => navigate("/profile")}>
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={async() => {
                                            await logout();
                                            navigate("/login");
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>

            <div className="bg-transparent">
                <div className="container d-flex justify-content-end">
                    <button
                        className="btn dark-green-btn shadow-sm rounded-bottom px-3 py-2"
                        style={{ marginTop: "-4px" }}
                        onClick={() => navigate("/my/plants/add")}
                    >
                        + Add Plant
                    </button>
                </div>
            </div>

            <div className="container mt-4">
                <h1
                    style={{
                        color: "#658354",
                        fontWeight: 800,
                        marginBottom: 20,
                    }}
                >
                    My Plants
                </h1>

                <div className="dark-green-card shadow-sm p-3 mb-4">
                    <div className="row g-3 justify-content-center">
                        <div className="col-md-4">
                            <label className="form-label fw-bold text-white">
                                Search plant
                            </label>
                            <input
                                type="text"
                                className="form-control dark-green-input"
                                placeholder="Plant name..."
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                { error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {filteredPlants.map((plant) => (
                    <div
                        key={plant.id}
                        className="shadow-sm dark-green-card p-3 mb-4"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/my/plants/${plant.id}`)}
                    >
                        {plant.imageUrl && (
                            <img
                                src={plant.imageUrl}
                                alt={plant.name}
                                style={{
                                    width: "100%",
                                    height: "320px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                }}
                            />
                        )}

                        <h3
                            style={{fontSize: 30,
                                    fontWeight: 700,
                             }}
                        >
                            {plant.name}
                        </h3>

                        <div style={{ marginBottom: 10 }}>
                            <div
                                style={{
                                    color: "#9fbf9f",
                                    fontSize: 20,
                                    fontWeight: 700,
                                    marginBottom: 4,
                                }}
                            >
                                SPECIES ID
                            </div>

                            <div style={{ color: "white", fontSize: 15}}>
                                {plant.plantSpecieId}
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-2">
                            <button
                                className="btn dark-green-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/my/plants/${plant.id}/edit`);
                                }}
                            >
                                Edit
                            </button>
                             <button
                             className="btn dark-green-btn"
                                style={{
                                    backgroundColor: "#7A2E2E",
                                    color: "white",
                                    border: "none",
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                }}
                                onClick={async (e) => {
                                    e.stopPropagation();

                                    if (!window.confirm("Delete this plant?")) return;

                                    await userPlant.delete(String(plant.id));

                                    setPlants((prev) =>
                                        prev.filter((p) => p.id !== plant.id)
                                    );
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}