import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import reminderRoutes from "./routes/reminderRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/reminders", reminderRoutes);

app.get("/", async (_req: Request, res: Response): Promise<void> => {
  res.send("API Running");
});

export default app;
