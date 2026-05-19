import dotenv from 'dotenv';
import express from 'express';
import userRouter from "./routes/UserRoute.js";
import userPlantRouter from "./routes/UserPlantRoute.js";
import recipeRouter from "./routes/RecipeRoute.js";
import plantSpecieRouter from "./routes/PlantSpecieRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/my/plants", userPlantRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/species", plantSpecieRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port.`);
});