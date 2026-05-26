import { useEffect, useState } from "react";
import { userService, recipeService, useAuth } from "@project/frontend-shared";
import { useNavigate } from "react-router-dom";
import type { IIngredientHasRecipeDTO, IUserDTO } from "@project/shared";
import { api } from "../src/api";
//api for recipe and user
const recipeApi = recipeService(api);
const userApi = userService(api);

export default function CreateRecipePage() {
    const navigate = useNavigate();

    //const currentUser = { id: "user-123" };
    //gets token and logout function
    const { token, logout} = useAuth();
    //logged in user - required for authorId
    const [user, setUser] = useState<IUserDTO | null>(null);
    //validation, api errors
    const [errors, setErrors] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // const [prepTime, setPrepTime] = useState("");
    // const [cookTime, setCookTime] = useState("");

    //imagepreview - UI
    const [imagePreview, setImagePreview] = useState<string>("");
    //imagefile for real file backend
    const [imageFile, setImageFile] = useState<File | null>(null);

    // const [steps, setSteps] = useState<string[]>([]);
    // const [plantIds, setPlantIds] = useState<string[]>([]);

    const [ingredients, setIngredients] = useState<IIngredientHasRecipeDTO[]>([]);
    //prevents image preview leaks
    useEffect(() => {
        const currentPreview = imagePreview;

        return () => {
            if (currentPreview) {
                URL.revokeObjectURL(currentPreview);
            }
        };
    }, [imagePreview]);

    // const [dietType, setDietType] =
    //     useState<"none" | "vegan" | "vegetarian">("none");
    /*
    const myPlants = [
        { id: "1", name: "Basil" },
        { id: "2", name: "Mint" },
        { id: "3", name: "Rosemary" }
    ];
    */

    /*
    const togglePlant = (id: string) => {
        setPlantIds((prev) =>
            prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id]
        );
    };
    */
   /*remove for backend*/
    //load user - important
    /*useEffect(() => {
        const loadUser = async () => {
            try {
                if (!token){
                    setUser(null);
                    navigate("/login");
                    return;
                }
                //get logged in user
                const me = await userApi.getMe();
                setUser(me);
            } catch {
                //logout - redirect to login
                await logout();
                navigate("/login");
            } 
        };

        loadUser();
    }, [navigate, token]);*/

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        //get selected file
        const file = e.target.files?.[0];
        if (!file) return;
        //store
        setImageFile(file);
        //preview - temporary browser URL
        setImagePreview(URL.createObjectURL(file)); 
    };

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            {
                id: Date.now(),
                name: "",
                unit: "pcs",
                amount: 1
            }
        ]);
    };

    const updateIngredient = (
        index: number,
        field: keyof IIngredientHasRecipeDTO,
        value: any
    ) => {
        const updated = [...ingredients];
        //updates single field dynamically
        updated[index] = { ...updated[index], [field]: value };
        setIngredients(updated);
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    // const addStep = () => setSteps([...steps, ""]);

    // const updateStep = (index: number, value: string) => {
    //     const updated = [...steps];
    //     updated[index] = value;
    //     setSteps(updated);
    // };

    // const removeStep = (index: number) => {
    //     setSteps(steps.filter((_, i) => i !== index));
    // };

    const validate = () => {
        const newErrors: string[] = [];

        if (!name.trim()) newErrors.push("Recipe name is required.");
        if (!description.trim()) newErrors.push("Description is required.");

        /*
        if (!prepTime || Number(prepTime) <= 0)
            newErrors.push("Prep time must be greater than 0.");
        if (!cookTime || Number(cookTime) <= 0)
            newErrors.push("Cook time must be greater than 0.");
        */

        if (ingredients.length === 0)
            newErrors.push("Add at least one ingredient.");

        // if (steps.length === 0)
        //     newErrors.push("Add at least one step.");

        const invalidIngredient = ingredients.some((i) => !i.name.trim());
        if (invalidIngredient)
            newErrors.push("All ingredients must have a name.");

        /*
        const invalidStep = steps.some((s) => !s.trim());
        if (invalidStep)
            newErrors.push("Steps cannot be empty.");
        */

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        //stop page reload
        e.preventDefault();
        //validate form
        const validationErrors = validate();

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        //ensure user exist
        if (!token || !user) {
            navigate("/login");
            return;
        }
        //unsures image
        if (!imageFile) {
            setErrors(["Image is required"]);
            return;
        }

        setErrors([]);
        
        //multipart request
        try {
            const newRecipe = await recipeApi.create({
                name,
                description,
                ingredients: ingredients.map((i) => ({
                    name: i.name,
                    unit: i.unit,
                    amount: i.amount,
                })),
                image: imageFile,
            });
            navigate(`/recipes/${newRecipe.id}`);
        } catch {
            setErrors(["Failed to create recipe"]);
        }
    };
    //remove for backend
    //if (loading) return <p>Loading...</p>;
    //if (!user) return null;

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark dark-green-navbar px-4">
                <div className="d-flex align-items-center justify-content-between w-100">
                    
                    <a
                        className="navbar-brand fw-bold"
                        onClick={() => navigate("/home")}
                        style={{ cursor: "pointer" }}
                    >
                        PlantIT
                    </a>

                    <button
                        className="btn dark-green-btn"
                        onClick={() => navigate("/recipes")}
                    >
                        Back
                    </button>

                </div>
            </nav>

            <div className="container mt-4 d-flex justify-content-center">
                <div
                    className="dark-green-card p-4 shadow-lg w-100"
                    style={{ maxWidth: "800px" }}
                >

                    <h1 className="text-center mb-4 fw-bold">
                        Add Recipe
                    </h1>

                    {errors.length > 0 && (
                        <div className="alert alert-danger mb-3">
                            <ul className="mb-0">
                                {errors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <input
                            className="form-control dark-green-input mb-3"
                            placeholder="Recipe name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <textarea
                            className="form-control dark-green-textarea mb-3"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                                        borderRadius: "10px"
                                    }}
                                />
                            )}
                        </div>

                        {/*
                        <div className="mb-3">
                            <label className="form-label fw-bold text-white">
                                Diet type
                            </label>

                            <select ...>
                                ...
                            </select>
                        </div>
                        */}

                        {/*
                        <div className="mb-3">
                            <label className="form-label fw-bold text-white">
                                Select plants
                            </label>
                            ...
                        </div>
                        */}

                        {/*
                        <div className="row mb-3">
                            <input type="number" placeholder="Prep time" />
                            <input type="number" placeholder="Cook time" />
                        </div>
                        */}

                        <div className="mb-3">
                            <label className="form-label fw-bold text-white">
                                Ingredients
                            </label>

                            {ingredients.map((ing, index) => (
                                <div key={ing.id} className="d-flex gap-2 mb-2">

                                    <input
                                        className="form-control dark-green-input"
                                        placeholder="Name"
                                        value={ing.name}
                                        onChange={(e) =>
                                            updateIngredient(index, "name", e.target.value)
                                        }
                                    />

                                    <input
                                        className="form-control dark-green-input"
                                        type="number"
                                        value={ing.amount}
                                        onChange={(e) =>
                                            updateIngredient(index, "amount", Number(e.target.value))
                                        }
                                    />

                                    <select
                                        className="form-select dark-green-select"
                                        value={ing.unit}
                                        onChange={(e) =>
                                            updateIngredient(index, "unit", e.target.value)
                                        }
                                    >
                                        <option value="pcs">pcs</option>
                                        <option value="g">g</option>
                                        <option value="ml">ml</option>
                                    </select>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn dark-green-btn ms-4"
                                onClick={addIngredient}
                            >
                                + Add ingredient
                            </button>
                        </div>

                        {/*
                        <div className="mb-3">
                            <label className="form-label fw-bold text-white">
                                Steps
                            </label>
                            ...
                        </div>
                        */}

                        <button className="btn dark-green-btn w-100 mt-3">
                            Create Recipe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};