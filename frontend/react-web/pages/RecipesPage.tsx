import { useEffect, useState } from "react";
import { recipeService } from "@project/frontend-shared";
import type { IRecipeDTO } from "@project/shared";
import { useNavigate } from "react-router-dom";

export const RecipesPage = () => {
    //list of recipes from backend
    const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [ingredientFilter, setIngredientFilter] = useState("");
    const [error, setError] = useState<string | null>(null);

    // const [timeFilter, setTimeFilter] = useState("");
    // const [dietFilter, setDietFilter] = useState<"none" | "vegan" | "vegetarian">("none");

    //login check
    const token = localStorage.getItem("token");
    //boolean
    const isLoggedIn = !!token;
    //navigation
    const navigate = useNavigate();
    /* remove for backend
    //fetch data
    useEffect(() => {
        //load page
        const fetchRecipes = async () => {
            try {
                //API call: GET /recipes
                const data = await recipeService.getAll();
                setRecipes(data);
            } catch {
                setError("Failed to load recipes");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);*/
    //filter logic - creates a filtered version of recipes
    const filteredRecipes = recipes.filter((recipe) => {
        const matchesIngredient =
            //filter empty - show all recipes
            ingredientFilter.trim() === "" ||
            //check if any ingredients match
            recipe.ingredients.some((ingredient) =>
                ingredient.name.toLowerCase().includes(ingredientFilter.toLowerCase())
            );

        // const totalTime = recipe.prepTime + recipe.cookTime;

        /*
        const matchesTime =
            timeFilter === "" ||
            (timeFilter === "under15" && totalTime < 15) ||
            (timeFilter === "15to30" &&
                totalTime >= 15 &&
                totalTime <= 30) ||
            (timeFilter === "over30" && totalTime > 30);
        */

        /*
        const matchesDiet =
            dietFilter === "none" ||
            recipe.dietType === dietFilter;

        return matchesIngredient && matchesTime && matchesDiet;
        */

        return matchesIngredient;
    });
    //remove for backend
    //if (loading) return <p>Loading recipes...</p>;

    return (
        <div>

            <div>

                <nav className="navbar navbar-expand-lg navbar-dark dark-green-navbar px-4">
                    <div className="d-flex align-items-center">
                        <a className="navbar-brand fw-bold" href="#">
                            PlantIT
                        </a>

                        <button
                            className="btn dark-green-btn ms-3"
                            onClick={() => navigate("/")}
                        >
                            ← Home
                        </button>
                    </div>

                    <div className="ms-auto dropdown">
                        <button
                            className="btn dark-green-btn dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
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
                                            className="dropdown-item text-danger"
                                            onClick={() => {
                                                localStorage.removeItem("token");
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
                            style={{
                                marginTop: "-4px"
                            }}
                            onClick={() => navigate("/recipes/create")}
                        >
                            + Add Recipe
                        </button>
                    </div>
                </div>

            </div>

            <div className="container mt-4">

                <h1 className="mb-3 fw-bold">Recipes</h1>

                <div className="dark-green-card shadow-sm p-3 mb-4">
                    <div className="row g-3 justify-content-center">

                        <div className="col-md-3">
                            <label className="form-label fw-bold text-white">
                                Ingredients
                            </label>
                            <input
                                type="text"
                                className="form-control dark-green-input"
                                placeholder="Ingredient (e.g. basil)"
                                value={ingredientFilter}
                                onChange={(e) => setIngredientFilter(e.target.value)}
                            />
                        </div>

                        {/*
                        <div className="col-md-3">
                            <label className="form-label fw-bold text-white">
                                Preparation time
                            </label>
                            <select
                                className="form-select dark-green-select"
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                            >
                                <option value="">Choose...</option>
                                <option value="under15">Under 15 min</option>
                                <option value="15to30">15 - 30 min</option>
                                <option value="over30">30+ min</option>
                            </select>
                        </div>
                        */}

                        {/*
                        <div className="col-md-3">
                            <label className="form-label fw-bold text-white">
                                Diet
                            </label>
                            <select
                                className="form-select dark-green-select"
                                value={dietFilter}
                                onChange={(e) => setDietFilter(e.target.value as any)}
                            >
                                <option value="">All</option>
                                <option value="vegan">Vegan</option>
                                <option value="vegetarian">Vegetarian</option>
                            </select>
                        </div>
                        */}

                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {filteredRecipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="border p-3 mb-3 rounded shadow-sm"
                    >

                        {recipe.imageUrl && (
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginBottom: "10px"
                                }}
                            />
                        )}

                        <h3
                            onClick={() => navigate(`/recipes/${recipe.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            {recipe.name}
                        </h3>

                        <p>{recipe.description}</p>
                        <small>Author: {recipe.authorId}</small>
                    </div>
                ))}

            </div>

        </div>
    );
};