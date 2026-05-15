import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark dark-green-navbar px-4">
                <a className="navbar-brand fw-bold" href="#" >
                    PlantIT
                </a>

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
                                    <button
                                        className="dropdown-item"
                                        onClick={() => navigate("/login")}
                                        >
                                        Login    
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => navigate("/register")}
                                        >
                                        Register
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => navigate("/profile")}
                                        >
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

            <div className="container text-center mt-5">
                <h1 className="mb-4 fw-bold">Welcome to PlantIT</h1>
                <p className="text-muted">
                    Manage your plants and track their care easily.
                </p>

                <div className="row justify-content-center g-4">
                    <div className="col-md-3">
                        <div className="shadow-sm p-4 dark-green-card">
                            <h4>Recipes</h4>
                            <p>Find recipes and ideas.</p>
                            <button className="btn w-100 dark-green-btn">
                                Open Recipes
                            </button>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="shadow-sm p-4 dark-green-card">
                            <h4>My Plants</h4>
                            <p>View and manage your plant collection.</p>
                            <button className="btn w-100 dark-green-btn">
                                Open
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-5 mb-5">
                <div className="lighter-card shadow-sm p-4">
                    <h3 className="mb-3">Discover More</h3>
                    <p>
                        PlantIT helps you care for your plants, discover recipes and stay connected with nature.
                    </p>

                    <p className="fw-bold">
                        Download PlantIT app:
                        <br />
                        <a href="#">Download PlantIT App</a>
                    </p>

                    <p>
                        <span className="highlight-label">Support:</span>
                        <br />
                        <span className="highlight-label">Email:</span> support@plantit.com
                        <br />
                        <span className="highlight-label">Phone:</span> +386 40 123 456
                    </p>
                </div>
            </div>
        </div> 
    );
}