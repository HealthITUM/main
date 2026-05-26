import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService, useAuth } from "@project/frontend-shared";
import type { IUserDTO, IUserUpdateRequestDTO } from "@project/shared";
import { api } from "../src/api";
//api for user
const service = userService(api);

export default function EditProfilePage() {
    const navigate = useNavigate();
    //gets JWT token if user is logged in
    const { token } = useAuth();
    //loged in user
    const [user, setUser] = useState<IUserDTO | null>(null);
    //input fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //validation, api errors
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    /*useEffect(() => {
        //if user is not logged in - redirect to login
        if (!token) {
        navigate("/login");
        return;
        }

        const load = async () => {
            try {
                //api request - current user
                const me = await service.getMe();
                //stores in state
                setUser(me);
                //prefills username input
                setUsername(me.username);
            } catch {
                setErrors(["Failed to load profile"]);
            }
        };
        load();
    }, [token, navigate]);*/ //runs if token or navigation is changed

    const validate = () => {
        //empty error list
        const err: string[] = [];
        //if username exists, shorter than 3
        if (username && username.trim().length > 0 && username.trim().length < 3) {
            err.push("Username must be at least 3 characters");
        }
        //if user puts in new password
        if (password) {
            if (!password.trim()) {
                err.push("Password cannot be empty spaces");
            } else if (password.trim().length < 6) {
                err.push("Password must be at least 6 characters");
            }
        }
        return err;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        //stops page refresh
        e.preventDefault();

        const validationErrors = validate();
        //if error exists - stops sumbit
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        //if there is no user it stops
        if (!user) return;
        //loading spinner
        setLoading(true);
        //clears old errors
        setErrors([]);

        try {
        const payload: IUserUpdateRequestDTO = {
            //includes username if its not empty
            ...(username.trim() ? { username: username.trim() } : {}),
            //includes if user typed it
            ...(password ? { password } : {}),
        };
        //update request to backend
        await service.updateMe(payload);
        //clears password field
        setPassword("");
        //clears errors
        setErrors([]);
        navigate("/profile");
        } catch {
        setErrors(["Failed to update profile"]);
        } finally {
        setLoading(false);
        }
    };
    //fake data
    if (!user) {
        setUser({
            id: 1,
            username: "plantlover",
            email: "plantlover@plantit.com",
        });

        setUsername("plantlover");
        }

    return (
        <div>
        <nav className="navbar navbar-dark dark-green-navbar px-4">
            <span className="navbar-brand fw-bold">PlantIT</span>

            <div className="ms-auto">
                <button
                className="btn dark-green-btn"
                onClick={() => navigate(-1)}
                >
                Back
                </button>
            </div>
        </nav>
        <div className="container mt-5">
        <div className="dark-green-card p-4 shadow-sm">

            <h2 className="text-center fw-bold mb-4">Edit Profile</h2>

            {errors.length > 0 && (
            <div className="alert alert-danger">
                {errors.map((e, i) => (
                <div key={i}>{e}</div>
                ))}
            </div>
            )}

            <form onSubmit={handleSubmit}>

            <div className="mb-3">
                <label className="form-label fw-bold">Username</label>
                <input
                className="form-control dark-green-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold">New Password</label>
                <input
                type="password"
                className="form-control dark-green-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave empty if no change"
                />
            </div>

            <button
                className="btn dark-green-btn w-100"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>

            </form>
        </div>
        </div>
        </div>
    );
}