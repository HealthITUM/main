import { useState } from "react";
import { userService, useAuth } from "@project/frontend-shared";
import type { IUserLoginRequestDTO } from "@project/shared";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api";
//save data from input
export default function LoginPage() {
    //navigation - example to home page
    const navigate = useNavigate();
    //gets login function
    const { login } = useAuth();
    //form info
    const [form, setForm] = useState<IUserLoginRequestDTO>({
        username: "",
        email: "",
        password: "",
    });

    //show errors
    const [error, setError] = useState("");

    const service = userService(api);

    //runs when button is clicked
    const handleLogin = async () => {
        setError("");
        //basic validation
        if(!form.username || !form.password){
            setError("Please fill in all fields");
            return;
        }

        try {
            //request to backend - API call
            const res = await service.login(form);
            //save token
            await login(res.token);
            navigate("/");
        }catch (err: any){
            console.log("Login error:", err);
            setError(err?.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="dark-green-card shadow p-4" style={{ width: "400px"}}>
                <h1 className="text-center mb-4">Login</h1>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username"
                        value={form.username}
                        onChange={(e) => 
                            setForm({ ...form, username: e.target.value})
                        }
                    />
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={(e) => 
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                </div>

                {error && (
                    <div className="alert alert-danger py-2">
                        {error}
                    </div>
                )}

                <button
                    className="btn dark-green-btn w-100"
                    onClick={handleLogin}>Login
                </button>

                <button
                    type="button"
                    className="btn w-100 mt-2"
                    onClick={() => navigate("/")}
                    style={{ backgroundColor: "#8aa08a", color: "white" }}
                >
                    Continue without login
                </button>

                <p className="text-center mt-3 mb-0">
                    Don’t have an account yet? {" "}
                    <span
                        style={{ color: "white", cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => navigate("/register")}
                    >
                        Create one
                    </span>
                </p>
            </div>
        </div>
    );
}