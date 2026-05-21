import { useEffect, useState } from "react";
import { userService } from "@project/frontend-shared";
import type { IUserDTO} from "@project/shared";
import { useNavigate } from "react-router-dom";
import { api } from "../src/api";

//relies on GET /user/me
export default function ProfilePage() {
  //user - currently logged in user - starts as null - later IUserDTO
  const [user, setUser] = useState<IUserDTO | null>(null);
  //navigacija
  const navigate = useNavigate();

  const service = userService(api);
  
  //runs once when component is mount
  useEffect(() => {
    //fetch user
    const loadUser = async () => {
      try {
        //send request to backend - checks token, return data
        const data = await service.getMe();
        setUser(data);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    loadUser();
    //runs only once when page loads
  }, []);

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-3 text-muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar navbar-dark dark-green-navbar px-4">
        <span className="navbar-brand fw-bold">PlantIT</span>

        <button
          className="btn dark-green-btn"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </nav>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">

            <div className="shadow-sm p-4 dark-green-card">
              <h2 className="mb-4 fw-bold text-center">My Profile</h2>

              <div className="mb-3">
                <label className="form-label fw-bold">ID</label>
                <div className="form-control bg-light">{user.id}</div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Username</label>
                <div className="form-control bg-light">{user.username}</div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <div className="form-control bg-light">{user.email}</div>
              </div>

              <button
                className="btn dark-green-btn w-100 mt-3"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}