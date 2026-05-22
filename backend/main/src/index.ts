import dotenv from 'dotenv';
import express from 'express';
import userRouter from "./routes/UserRoute.js";
import type { Request, Response } from 'express';
import userPlantRouter from "./routes/UserPlantRoute.js";
import recipeRouter from "./routes/RecipeRoute.js";
import plantSpecieRouter from "./routes/PlantSpecieRoute.js";
import { queueService } from './services/RabbitMqService.js';

dotenv.config();

queueService.init();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/my/plants", userPlantRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/species", plantSpecieRouter);

const PORT = process.env.MONOLITH_PORT || 1000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port.`);
});