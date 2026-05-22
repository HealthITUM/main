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

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port.`);
});

app.get("/test", async (req: Request, res : Response) => {
  if (queueService.isInit()){
    await queueService.publish("pdet.task.important", "test_message");
    console.log("[TEST] Message sent!");
    return res.status(200).json({ message : "Success!"});
  }
  return res.status(400).json({ message : "[TEST] Not initialized!"});
});