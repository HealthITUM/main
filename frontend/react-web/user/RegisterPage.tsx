import { useState } from "react";
import { userService } from "../services/userServices";
import type { IUserRegisterDTO } from "../../../shared/UserDTO";

export default function RegisterPage() {
    const [form, setForm] = useState<IUserRegisterDTO>({
        username: "",
        email: "",
        password: "",
    });

    const handleRegister = async () => {
        try {
            const res = await userService.register(form);
            console.log("Registered user:", res);
        }catch (err){
            console.log("Register error:", err);
        }
    };

    return (
        <div>
            <h1>
                Register
            </h1>

            <input
                placeholder="username"
                onChange={(e) => setForm({...form, username: e.target.value})}
            />

            <input
                placeholder="email"
                onChange={(e) => setForm({...form, email: e.target.value})}
            />

            <input
                type="password"
                placeholder="password"
                onChange={(e) => setForm({...form, password: e.target.value})}
            />

            <button onClick={handleRegister}>Register</button>
        </div>
    );
}