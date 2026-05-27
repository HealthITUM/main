import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { IRecipeDTO } from "@project/shared";
import { recipeService, userService, useAuth } from "@project/frontend-shared"
import { api } from "../src/api";
//api for recipe and user
const recipeApi = recipeService(api);
const userApi = userService(api);

export default function RecipeDetailPage() {
    //get URL parameter of recipe
    const { id } = useParams();
    //gets token
    const { token } = useAuth();
    const [user, setUser] = useState<any>(null);
    //navigation
    const navigate = useNavigate();
    //start as null, later full object type
    const [recipe, setRecipe] = useState<IRecipeDTO | null>(null);
    const [loading, setLoading] = useState(true);
    //errors
    const [error, setError] = useState<string | null>(null);
    //fetch data - when page loads, change of id - remove for backend
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

    useEffect(() => {
        const loadUser = async () => {
            try {
                //if user is not logged in it stops
                if (!token) return;
                //api request - gets user
                const me = await userApi.getMe();
                //stores in state
                setUser(me);
            } catch {
                setUser(null);
            }
        };
        loadUser();
    }, [token]); //runs if token changes
    //fake data
    /*useEffect(() => {
        if (!id) {
            setError("Invalid recipe id");
            setLoading(false);
            return;
        }

        const fakeRecipe: IRecipeDTO = {
            id: Number(id),
            name: "Spaghetti Bolognese",
            description: "Classic Italian pasta with rich meat sauce.",
            authorId: 99,
            imageUrl:
                "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
            ingredients: [
                { id: 1, name: "spaghetti", unit: "g", amount: 200 },
                { id: 2, name: "ground beef", unit: "g", amount: 300 },
                { id: 3, name: "tomato sauce", unit: "ml", amount: 150 },
            ],
        };

        setRecipe(fakeRecipe);
        setLoading(false);
    }, [id]);*/

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!recipe) return <p>Recipe not found</p>;
    if (!user) return null;

   return (
        <>
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
                    onClick={() => navigate("/recipes")}
                >
                    Back
                </button>
            </nav>

            <div className="container mt-4">

                {recipe.imageUrl && (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        style={{
                            width: "100%",
                            height: "320px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            marginBottom: "15px",
                        }}
                    />
                )}

                <div className="dark-green-card shadow-sm p-3" style={{ borderRadius: 12 }}>
    
                <div className="d-flex justify-content-between align-items-start">
                    
                    <div>
                        <h2 style={{ color: "white", fontWeight: 800, marginBottom: 10 }}>
                            {recipe.name}
                        </h2>

                        <div style={{ marginBottom: 10 }}>
                            <div style={{ color: "#9fbf9f", fontSize: 20, fontWeight: 700 }}>
                                DESCRIPTION
                            </div>

                            <div style={{ color: "white", fontSize: 16 }}>
                                {recipe.description}
                            </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <div style={{ color: "#9fbf9f", fontSize: 20, fontWeight: 700 }}>
                                AUTHOR ID
                            </div>

                            <div style={{ color: "white", fontSize: 16 }}>
                                {recipe.authorId}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                <div
                    className="dark-green-card shadow-sm p-3"
                    style={{ marginTop: 15, borderRadius: 12 }}
                >
                    <div style={{ color: "white", fontSize: 20, fontWeight: 800, marginBottom: 15 }}>
                        Ingredients
                    </div>

                    {recipe.ingredients.length === 0 ? (
                        <div style={{ color: "white" }}>
                            No ingredients
                        </div>
                    ) : (
                        recipe.ingredients.map((ing) => (
                            <div
                                key={ing.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    border: "1px solid #2f4f2f",
                                    padding: "10px",
                                    borderRadius: 8,
                                    marginBottom: 10,
                                    color: "white",
                                }}
                            >
                                <div>{ing.name}</div>
                                <div>
                                    {ing.amount} {ing.unit}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};