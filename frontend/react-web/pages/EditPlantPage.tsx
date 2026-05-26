import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { specieService, userPlantService, useAuth } from "@project/frontend-shared";
import type { ISpecieDTO } from "@project/shared";
import { api } from "../src/api";
//api for user and specie
const userPlant = userPlantService(api);
const specie = specieService(api);

export default function EditPlantPage() {
    //reads plant ID from URL - so /my/plants/123/edit - id is 123
    const { id } = useParams();
    //navigation
    const navigate = useNavigate();
    //plant name
    const [name, setName] = useState("");
    //species from backend
    const [species, setSpecies] = useState<ISpecieDTO[]>([]);
    //currently selected plant specie
    const [selectedSpecie, setSelectedSpecie] = useState<ISpecieDTO | null>(null);
    //validation, API errors
    const [errors, setErrors] = useState<string[]>([]);
    //true while saving changes
    const [loading, setLoading] = useState(false);

    //true while initial plant data is loading
    const [pageLoading, setPageLoading] = useState(true);
    //gets token
    const { token } = useAuth();
    //remove for backend
    /*//is user logged in?
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);*/
    //remove for backend
    
    /*useEffect(() => {
        const load = async () => {
            //stops if route param is missing
            if (!id) {
                setPageLoading(false);
                return;
            }

            try {
                //loads API requests - get species and plant details
                const [speciesData, plantData] = await Promise.all([
                    specie.getAll(),
                    userPlant.getById(String(id)),
                ]);
                //stores dropdown options
                setSpecies(speciesData);
                //prefils with existing name and image
                setName(plantData.name);
                //for dropdows: finds selected specie with id
                const foundSpecie = speciesData.find(
                    (s) => s.id === plantData.plantSpecieId
                );
                //prefills dropdown
                setSelectedSpecie(foundSpecie || null);

            } catch {
                setErrors(["Failed to load plant"]);
            } finally {
                setPageLoading(false);
            }
        };

        load();
    }, [id]); //if plant id changes it reloads*/

    const validate = () => {
        //validation errors
        const err: string[] = [];

        if (!name.trim()) err.push("Plant name is required.");
        if (!selectedSpecie) err.push("Please select a species.");

        return err;
    };

   const handleSubmit = async (e: React.FormEvent) => {
        //prevents default browser refresh
        e.preventDefault();

        const validationErrors = validate();
        //shows errors and stops if there are any
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        //ensures required data exist
        if (!id || !selectedSpecie) return;
        //saving
        setLoading(true);
        setErrors([]);

        try {
            //updates API call: PATCH /my/plants/:id
            await userPlant.update(id, {
                name,
                plantSpecieId: selectedSpecie.id
            });
            navigate(`/my/plants/${id}`);
        } catch {
            setErrors(["Failed to update plant"]);
        } finally {
            setLoading(false);
        }
    };
    //remove for backend
    //if (pageLoading) return <p>Loading...</p>;

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
                    <h1 className="text-center mb-4 fw-bold">
                        Edit Plant
                    </h1>

                    {errors.length > 0 && (
                        <div className="alert alert-danger mb-3">
                            <ul className="mb-0 list-unstyled">
                                {errors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    

                    <form onSubmit={handleSubmit}>
                        <label className="form-label fw-bold text-white">
                            Plant name
                        </label>

                        <input
                            className="form-control dark-green-input mb-3"
                            placeholder="Plant name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <div className="mb-3">
                            <label className="form-label fw-bold text-white">
                                Species
                            </label>

                            <select
                                className="form-select dark-green-select"
                                value={selectedSpecie?.id || ""}
                                onChange={(e) => {
                                    const found = species.find(
                                        (s) => s.id === Number(e.target.value)
                                    );
                                    setSelectedSpecie(found || null);
                                }}
                            >
                                <option value="">Select species</option>
                                {species.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="btn dark-green-btn w-100 mt-3"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}