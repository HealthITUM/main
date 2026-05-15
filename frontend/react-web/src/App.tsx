import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "../user/RegisterPage";
import LoginPage from "../user/LoginPage";
import ProfilePage from "../user/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
