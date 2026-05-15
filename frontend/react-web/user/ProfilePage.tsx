import { useEffect, useState } from "react";
import { userService } from "../services/userServices";
import type { IUser } from "../../../shared/UserDTO";

export default function ProfilePage() {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await userService.getMe();
        setUser(data);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    loadUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>

      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}