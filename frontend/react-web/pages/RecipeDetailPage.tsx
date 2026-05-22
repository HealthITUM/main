import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { IRecipeDTO } from "@project/shared";
import { recipeService } from "@project/frontend-shared"
import { api } from "../src/api";

const recipeApi = recipeService(api);

export const RecipeDetailPage = () => {
    //get URL parameter of recipe
    const { id } = useParams();
    //navigation
    const navigate = useNavigate();
    //start as null, later full object type
    const [recipe, setRecipe] = useState<IRecipeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    //errors
    const [error, setError] = useState<string | null>(null);
    //fetch data - when page loads, change of id
    useEffect(() => {
        const fetchRecipe = async () => {
            //safety check - prevents API call if URL has no id
            if (!id) {
                setError("Invalid recipe id");
                setLoading(false);
                return;
            }

            try {
                //request: GET /recipes/:id
                const data = await recipeApi.getById(id);
                setRecipe(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load recipe");
                setRecipe(null);
            }finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;
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

            {/*
            <p>
                <strong>Diet:</strong> {recipe.dietType}
            </p>
            */}

            {/*
            <p>
                <strong>Total time:</strong>{" "}
                {recipe.prepTime + recipe.cookTime} min
            </p>
            */}

            {/*
            <p>
                <strong>Prep:</strong> {recipe.prepTime} min |{" "}
                <strong>Cook:</strong> {recipe.cookTime} min
            </p>
            */}

            <h3>Ingredients</h3>
            <ul>
                {recipe.ingredients.map((ing) => (
                    <li key={ing.id}>
                        {ing.name} — {ing.amount} {ing.unit}
                    </li>
                ))}
            </ul>

            {/*
            <h3>Steps</h3>
            <ol>
                {recipe.steps?.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
            */}

            <p>
                <strong>Author:</strong> {recipe.authorId}
            </p>

            <button
                className="btn btn-outline-light mt-3"
                onClick={() => navigate("/recipes")}
            >
                ← Back
            </button>

        </div>
    );
};