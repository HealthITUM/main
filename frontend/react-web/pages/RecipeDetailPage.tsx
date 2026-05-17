import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { recipeService } from "../services/recipeServices";
import type { IRecipeDTO } from "@project/shared";

export const RecipeDetailPage = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<IRecipeDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) return;

            try {
                const data = await recipeService.getById(id);
                setRecipe(data);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!recipe) return <p>Recipe not found</p>;

     return (
        <div className="container mt-4">

            <h1>{recipe.name}</h1>

            {recipe.imageUrl && (
                <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    style={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "20px"
                    }}
                />
            )}

            <p>{recipe.description}</p>

            <p>
                <strong>Diet:</strong> {recipe.dietType}
            </p>

            <p>
                <strong>Total time:</strong>{" "}
                {recipe.prepTime + recipe.cookTime} min
            </p>

            <p>
                <strong>Prep:</strong> {recipe.prepTime} min |{" "}
                <strong>Cook:</strong> {recipe.cookTime} min
            </p>

            <h3>Ingredients</h3>
            <ul>
                {recipe.ingredients.map((ing) => (
                    <li key={ing.id}>
                        {ing.name} — {ing.amount} {ing.unit}
                    </li>
                ))}
            </ul>

            <h3>Steps</h3>
            <ol>
                {recipe.steps?.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>

            <p>
                <strong>Author:</strong> {recipe.author.username}
            </p>

            <button
                className="btn btn-outline-light mt-3"
                onClick={() => window.history.back()}
            >
                ← Back
            </button>

        </div>
    );
}