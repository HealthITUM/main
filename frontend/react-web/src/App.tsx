import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import HomePage from "../pages/HomePage";
import { RecipesPage } from "../pages/RecipesPage";
import { RecipeDetailPage } from "../pages/RecipeDetailPage";
import { CreateRecipePage } from "../pages/CreateRecipePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recipes" element={<RecipesPage/>} />
        <Route path="/recipes/;id" element={<RecipeDetailPage />} />
        <Route path="/recipes/create" element={<CreateRecipePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
