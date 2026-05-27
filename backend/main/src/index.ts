import dotenv from 'dotenv';
import express from 'express';
import userRouter from "./routes/UserRoute.js";
import type { Request, Response } from 'express';
import userPlantRouter from "./routes/UserPlantRoute.js";
import recipeRouter from "./routes/RecipeRoute.js";
import plantSpecieRouter from "./routes/PlantSpecieRoute.js";
import { queueService } from './services/RabbitMqService.js';
import { plantSpecieController } from './controllers/PlantSpecieController.js';
import { plantSpecieService } from './services/PlantSpecieService.js';
import type { ISpecieCreateModel } from './models/Species.js';

dotenv.config();

queueService.init();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/my/plants", userPlantRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/species", plantSpecieRouter);

app.post("/api/species/", async (req: Request, res : Response) => {
  const ideal_values : Record<string, any> = {
    moisture : 10,
    soil : 5,
    temp : 10
  }
  const data : ISpecieCreateModel = {
    name : "Shit",
    description : "kaka",
    ideal_values, 
    imageUrl : "https://images.pexels.com/photos/2347496/pexels-photo-2347496.jpeg?auto=compress&cs=tinysrgb&w=600"
  }
  plantSpecieService.create(data);
  return res.status(200).json({ message : "SUCCESS"});
});

const PORT = process.env.MONOLITH_PORT || 1000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port.`);
});