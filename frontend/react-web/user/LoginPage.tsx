import { useState } from "react";
import { userService } from "../services/userServices";
import type { IUserLoginDTO } from "../../../shared/UserDTO";

export default function LoginPage() {
    const [form, setForm] = useState<IUserLoginDTO>({
        username: "",
        email: "",
        password: "",
    });

    const handleLogin = async () => {
        try {
            const res = await userService.login(form);

            localStorage.setItem("token", res.token);

            console.log("Logged in:", res);
        }catch (err){
            console.error("Login error:", err);
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <input
                placeholder="username"
                onChange={(e) => setForm({...form, username: e.target.value})}
            />

            <input
                placeholder="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
                type="password"
                placeholder="password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}