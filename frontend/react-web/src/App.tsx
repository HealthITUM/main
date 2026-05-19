import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import HomePage from "../pages/HomePage";
import { RecipesPage } from "../pages/RecipesPage";
import { RecipeDetailPage } from "../pages/RecipeDetailPage";
import { CreateRecipePage } from "../pages/CreateRecipePage";
import MyPlantsPage from "../pages/MyPlantsPage";
import MyPlantDetailsPage from "../pages/MyPlantDetailsPage";
import AddPlantPage from "../pages/AddPlantPage"
import AddSensorPage from "../pages/AddSensorPage"
import EditPlantPage from "../pages/EditPlantPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recipes" element={<RecipesPage/>} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/recipes/create" element={<CreateRecipePage />} />
        <Route path="/my/plants" element={<MyPlantsPage />} />
        <Route path="/my/plants/:id" element={<MyPlantDetailsPage />} />
        <Route path="/my/plants/add" element={<AddPlantPage />} />
        <Route path="/my/plants/:id/add-sensor" element={<AddSensorPage />} />
        <Route path="/my/plants/:id/edit" element={<EditPlantPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
