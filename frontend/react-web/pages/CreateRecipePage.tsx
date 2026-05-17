import { useState } from "react";
import { recipeService } from "../services/recipeServices";
import { useNavigate } from "react-router-dom";
import type { IIngredientHasRecipeDTO, IRecipeCreateRequestDTO } from "@project/shared";

export const CreateRecipePage = () => {
    const navigate = useNavigate();

    const currentUser = { id: "user-123" };
    const [errors, setErrors] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [imagePreview, setImagePreview] = useState<string>("");
    const [steps, setSteps] = useState<string[]>([]);
    const [plantIds, setPlantIds] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<IIngredientHasRecipeDTO[]>([]);
    const [dietType, setDietType] = useState<"none" | "vegan" | "vegetarian">("none");

    const myPlants = [
        { id: "1", name: "Basil" },
        { id: "2", name: "Mint" },
        { id: "3", name: "Rosemary" }
    ];

    const togglePlant = (id: string) => {
        setPlantIds((prev) =>
            prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id]
        );
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImagePreview(URL.createObjectURL(file));
    };

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            {
                id: crypto.randomUUID(),
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
        updated[index] = { ...updated[index], [field]: value };
        setIngredients(updated);
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const addStep = () => setSteps([...steps, ""]);

    const updateStep = (index: number, value: string) => {
        const updated = [...steps];
        updated[index] = value;
        setSteps(updated);
    };

    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors: string[] = [];

        if (!name.trim()) newErrors.push("Recipe name is required.");
        if (!description.trim()) newErrors.push("Description is required.");
        if (!prepTime || Number(prepTime) <= 0)
            newErrors.push("Prep time must be greater than 0.");
        if (!cookTime || Number(cookTime) <= 0)
            newErrors.push("Cook time must be greater than 0.");
        if (ingredients.length === 0)
            newErrors.push("Add at least one ingredient.");
        if (steps.length === 0)
            newErrors.push("Add at least one step.");
        if (plantIds.length === 0)
            newErrors.push("Select at least one plant.");

        const invalidIngredient = ingredients.some(
            (i) => !i.name.trim()
        );
        if (invalidIngredient)
            newErrors.push("All ingredients must have a name.");

        const invalidStep = steps.some((s) => !s.trim());
        if (invalidStep)
            newErrors.push("Steps cannot be empty.");

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate();

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors([]);

        const payload: IRecipeCreateRequestDTO = {
            name,
            description,
            authorId: currentUser.id,
            ingredients,
            steps,
            prepTime: Number(prepTime),
            cookTime: Number(cookTime),
            plantIds,
            imageUrl: imagePreview || undefined,
            dietType,
        };

        const newRecipe = await recipeService.create(payload);

        navigate(`/recipes/${newRecipe.id}`);
    };

    return (
        <div className="container mt-4 d-flex justify-content-center">
            <div className="dark-green-card p-4 shadow-lg w-100" style={{ maxWidth: "800px" }}>

                <h1 className="text-center mb-4 fw-bold">Add Recipe</h1>

                <button
                    type="button"
                    className="btn dark-green-btn mb-3"
                    onClick={() => navigate("/recipes")}
                >
                    ← Back
                </button>

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

                    <div className="mb-3">
                        <label className="form-label fw-bold text-white">
                            Diet type
                        </label>

                        <select
                            className="form-select dark-green-select"
                            value={dietType}
                            onChange={(e) => setDietType(e.target.value as any)}
                        >
                            <option value="none">None</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="vegan">Vegan</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold text-white">
                            Select plants
                        </label>

                        <div className="d-flex flex-wrap gap-2">
                            {myPlants.map((plant) => (
                                <button
                                    key={plant.id}
                                    type="button"
                                    className={`btn ${
                                        plantIds.includes(plant.id)
                                            ? "dark-green-btn"
                                            : "btn-outline-light"
                                    }`}
                                    onClick={() => togglePlant(plant.id)}
                                >
                                    {plant.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <input
                                className="form-control dark-green-input"
                                type="number"
                                placeholder="Prep time"
                                value={prepTime}
                                onChange={(e) => setPrepTime(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                className="form-control dark-green-input"
                                type="number"
                                placeholder="Cook time"
                                value={cookTime}
                                onChange={(e) => setCookTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold text-white">Ingredients</label>

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

                        <button type="button" className="btn dark-green-btn ms-4" onClick={addIngredient}>
                            + Add ingredient
                        </button>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold text-white">Steps</label>

                        {steps.map((step, index) => (
                            <div key={index} className="d-flex gap-2 mb-2">

                                <input
                                    className="form-control dark-green-input"
                                    placeholder={`Step ${index + 1}`}
                                    value={step}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                />

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeStep(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}

                        <button type="button" className="btn dark-green-btn ms-4" onClick={addStep}>
                            + Add step
                        </button>
                    </div>

                    <button className="btn dark-green-btn w-100 mt-3">
                        Create Recipe
                    </button>

                </form>
            </div>
        </div>
    );
};