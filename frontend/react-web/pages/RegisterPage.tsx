import { useState } from "react";
import { userService } from "../services/userServices";
import type { IUserRegisterDTO } from "../../../shared/UserDTO";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<IUserRegisterDTO>({
        username: "",
        email: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        setError("");

        if (form.password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;

        if (!passwordRegex.test(form.password)){
            setError(
                "Password must be at least 6 characters long, contain 1 uppercase letter and 1 special character"
            );
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)){
            setError("Invalid email format");
            return;
        }

        try {
            await userService.register(form);
            navigate("/login");
        }catch (err: any){
            console.log("Register error:", err);
            setError(err?.response?.data?.message || "Registration failed");
        }
    };

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