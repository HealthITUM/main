import dotenv from 'dotenv';
import express from 'express';
// import { PrismaClient } from "./generated/prisma/client.js";
// import { PrismaPg } from "@prisma/adapter-pg";
import userRouter from "./routes/UserRoute.js";
import userPlantRouter from "./routes/UserPlantRoute.js";
import recipeRouter from "./routes/RecipeRoute.js";
import plantSpecieRouter from "./routes/PlantSpecieRoute.js";
import { uploadMiddleware, uploadFile, BUCKETS } from './configs/storage.config.js';
import path from 'node:path';

dotenv.config();

const app = express();
// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// });
// const prisma = new PrismaClient({ adapter });
// const PORT = 3001;
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

// test route
app.post('/api/upload-test', (req, res) => {
  // 1. Вызываем multer-мидлвар
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Файл не выбран' });
    }

    try {
      const ext = path.extname(req.file.originalname);
      const objectName = `${Date.now()}${ext}`;

      const fileUrl = await uploadFile(
        BUCKETS.PLANTS,
        objectName,
        req.file.buffer,
        req.file.mimetype
      );

      return res.status(200).json({
        success: true,
        message: 'Файл успешно загружен в MinIO!',
        url: fileUrl,
      });
    } catch (uploadError: any) {
      return res.status(500).json({ success: false, error: uploadError.message });
    }
  });
});