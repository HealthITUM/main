import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { specieService, userPlantService } from "@project/frontend-shared";
import type { ISpecieDTO } from "@project/shared";

export default function CreatePlantPage() {
    //navigation
    const navigate = useNavigate();
    //plant name
    const [name, setName] = useState("");
    //uploaded image file - null if no file selected yet
    const [image, setImage] = useState<File | null>(null);
    //preview URL so image can be shown before upload
    const [imagePreview, setImagePreview] = useState<string>("");
    //species from backend
    const [species, setSpecies] = useState<ISpecieDTO[]>([]);
    //currentyl selected species - dropdows
    const [selectedSpecie, setSelectedSpecie] = useState<ISpecieDTO | null>(null);
    //validation, API errors
    const [errors, setErrors] = useState<string[]>([]);
    //tracks create request - disable button while saving
    const [loading, setLoading] = useState(false);
    //remove for backend
    /*useEffect(() => {
        //loads species from backend
        const load = async () => {
            try {
                //backend: GET /species
                const data = await specieService.getAll();
                setSpecies(data);
            } catch {
                setErrors(["Failed to load species"]);
            }
        };

        load();
    }, []); //runs once only when page loads*/
    //runs when user selects file
    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        //gets first selected file
        const file = e.target.files?.[0];
        //stops if nothing gets selected
        if (!file) return;
        //stores file
        setImage(file);
        //creates temporary browser url
        setImagePreview(URL.createObjectURL(file));
    };
    //checks form before submit
    const validate = () => {
        //validation errors
        const err: string[] = [];

        if (!name.trim()) err.push("Plant name is required.");
        if (!image) err.push("Image is required.");
        if (!selectedSpecie) err.push("Please select a species.");

        return err;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        //stops browser reload
        e.preventDefault();
        //validation
        const validationErrors = validate();
        //shows errors if any
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        //clears errors
        setErrors([]);
        //shows on button for example - creating...
        setLoading(true);

        try {
            //sends data to backend - creates formData
            //! besause we know its not null - validation checks before
            await userPlantService.create({
                name,
                plantSpecieId: Number(selectedSpecie!.id),
                image: image!,
            });

            navigate("/my/plants");
        } catch {
            setErrors(["Failed to create plant"]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 d-flex justify-content-center">
            <div
                className="dark-green-card p-4 shadow-lg w-100"
                style={{ maxWidth: "800px" }}
            >
                <h1 className="text-center mb-4 fw-bold">
                    Add Plant
                </h1>

                <button
                    type="button"
                    className="btn dark-green-btn mb-3"
                    onClick={() => navigate("/my/plants")}
                >
                    ← Back
                </button>

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
                    {/* NAME */}
                    <input
                        className="form-control dark-green-input mb-3"
                        placeholder="Plant name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="mb-3">
                        <input
                            type="file"
                            className="form-control dark-green-input"
                            onChange={handleImage}
                        />

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="preview"
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                    borderRadius: "10px",
                                }}
                            />
                        )}
                    </div>

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
                        {loading ? "Creating..." : "Create Plant"}
                    </button>
                </form>
            </div>
        </div>
    );
}