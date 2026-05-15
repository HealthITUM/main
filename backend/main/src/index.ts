import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const app = express();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
const PORT = 3001;

app.use(express.json());

// A test route to check DB connection
app.get('/test-db', async (req: Request, res: Response) => {
  try {
    // This executes a simple query to see if the DB responds
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'Success', message: 'Connected to PostgreSQL!' });
  } catch (error: any) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});