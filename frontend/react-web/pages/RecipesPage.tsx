import { useEffect, useState } from "react";
import { recipeService, useAuth, userService } from "@project/frontend-shared";
import type { IRecipeDTO, IUserDTO } from "@project/shared";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api";

const userApi = userService(api);

export default function RecipesPage() {
    //list of recipes from backend
    const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [ingredientFilter, setIngredientFilter] = useState("");
    const [error, setError] = useState<string | null>(null);

    // const [timeFilter, setTimeFilter] = useState("");
    // const [dietFilter, setDietFilter] = useState<"none" | "vegan" | "vegetarian">("none");
    const recipeApi = recipeService(api);
    //login check
    const { token, logout } = useAuth();
    const [user, setUser] = useState<IUserDTO | null>(null);
    
    //navigation
    const navigate = useNavigate();
    /* remove for backend*/
    //fetch data
    /*useEffect(() => {
        //load page
        const fetchRecipes = async () => {
            try {
                //API call: GET /recipes
                const data = await recipeApi.getAll();
                setRecipes(data);
            } catch {
                setError("Failed to load recipes");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);*/

    // fake data for frontend demo
    useEffect(() => {
        const fakeRecipes: IRecipeDTO[] = [
            {
                id: 1,
                name: "Tomato Soup",
                description: "Classic creamy tomato soup",
                authorId: 2,
                imageUrl:
                    "https://images.unsplash.com/photo-1547592180-85f173990554",
                ingredients: [
                    {
                        id: 3,
                        name: "tomato",
                        unit: "pcs",
                        amount: 5,
                    },
                    {
                        id: 4,
                        name: "garlic",
                        unit: "clove",
                        amount: 2,
                    },
                ],
            },
            {
                id: 2,
                name: "Avocado Toast",
                description: "Quick breakfast option",
                authorId: 3,
                imageUrl:
                    "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
                ingredients: [
                    {
                        id: 5,
                        name: "avocado",
                        unit: "pcs",
                        amount: 1,
                    },
                    {
                        id: 6,
                        name: "bread",
                        unit: "slice",
                        amount: 2,
                    },
                ],
            },
        ];

        setRecipes(fakeRecipes);
        setLoading(false);
    }, []);

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

    const handleDelete = async (recipeId: number) => {
        try {
            //api request for delete
            await recipeApi.delete(String(recipeId));
            //deletes local view
            setRecipes((prev) =>
                prev.filter((r) => r.id !== recipeId)
            );
        } catch {
            setError("Failed to delete recipe");
        }
    };
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
                            {!token ? (
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
                        className="shadow-sm dark-green-card p-3 mb-4"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                    >
                        {recipe.imageUrl && (
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.name}
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
                            style={{
                                fontSize: 30,
                                fontWeight: 700,
                            }}
                        >
                            {recipe.name}
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
                                DESCRIPTION
                            </div>

                            <div style={{ color: "white", fontSize: 18 }}>
                                {recipe.description}
                            </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <div
                                style={{
                                    color: "#9fbf9f",
                                    fontSize: 20,
                                    fontWeight: 700,
                                    marginBottom: 4,
                                }}
                            >
                                AUTHOR ID
                            </div>

                            <div style={{ color: "white", fontSize: 18 }}>
                                {recipe.authorId}
                            </div>
                        </div>
                        <div className="d-flex justify-content-start gap-2 w-100 mb-3 mt-2">
                           {/*
                           {token && recipe.authorId === user?.id && ( */}
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
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        if (!window.confirm("Delete this recipe?")) return;

                                        handleDelete(recipe.id);
                                    }}
                                >
                                    Delete
                                </button>
                           {/* )} */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};