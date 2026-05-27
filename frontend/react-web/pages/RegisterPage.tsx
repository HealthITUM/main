import { useState } from "react";
import { userService } from "@project/frontend-shared";
import type { IUserRegisterRequestDTO } from "@project/shared";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api";

//stores user input for username... -> controlled form
export default function RegisterPage() {
    //navigation
    const navigate = useNavigate();
    const [form, setForm] = useState<IUserRegisterRequestDTO>({
        username: "",
        email: "",
        password: "",
    });

    //seperated field for password match - does not send to backend
    const [confirmPassword, setConfirmPassword] = useState("");
    //errors - validation, API errors - UI
    const [error, setError] = useState("");
    //api for user
    const userApi = userService(api);
    const [loading, setLoading] = useState(false);
    
    //runs when button is clicked
    const handleRegister = async () => {
        setError("");

        //pasword must match
        if (form.password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        //password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
        //error password validation
        if (!passwordRegex.test(form.password)){
            setError(
                "Password must be at least 6 characters long, contain 1 uppercase letter and 1 special character"
            );
            return;
        }

        //email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        //invalid email
        if (!emailRegex.test(form.email)){
            setError("Invalid email format");
            return;
        }

        setLoading(true);

        try {
            //send request - API call -> POST /user/register
            await userApi.register(form);
            navigate("/login");
        }catch (err: any){
            //show error
            setError(err?.response?.data?.message || "Registration failed");
        }finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="dark-green-card shadow p-4" style={{ width: "400px" }}>
                <h1 className="text-center mb-4">Register</h1>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
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
                        className="form-control"
                        placeholder="Enter Email"
                        value={form.email}
                        onChange={(e) => 
                            setForm({ ...form, email: e.target.value})
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
                            setForm({ ...form, password: e.target.value})
                        }
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        />
                </div>
                
                {error && (
                    <div className="alert alert-danger py-2">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    className="btn dark-green-btn w-100"
                    onClick={handleRegister}
                    >
                    Register
                </button>

                <button
                    type="button"
                    className="btn w-100 mt-2"
                    onClick={() => navigate("/")}
                    style={{ backgroundColor: "#8aa08a", color: "white" }}
                >
                    Continue without account
                </button>

                <p className="text-center mt-3 mb-0">
                    Already have an account?{" "}
                    <span
                        style={{
                            color: "white",
                            cursor: "pointer",
                            textDecoration: "underline",
                        }}
                        onClick={() => navigate("/login")}
                        >
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
}