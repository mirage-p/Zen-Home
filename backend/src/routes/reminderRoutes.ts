import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, date, time } = req.body;
    if (!name || !date || !time) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        name,
        date: new Date(date),
        time,
      },
    });

    if (existingReminder) {
      res.status(400).json({
        error: "Reminder already exists with that name, date, and time",
      });
      return;
    }

    const now = new Date();
    const reminderDateTime = new Date(`${date}T${time}:00.000Z`);
    if (reminderDateTime <= now) {
      res.status(400).json({
        error: "Reminder must be scheduled for a future date and time",
      });
      return;
    }

    const newReminder = await prisma.reminder.create({
      data: {
        name,
        description,
        date: new Date(date),
        time,
      },
    });
    res.status(201).json({ newReminder });
    return;
  } catch (err) {
    res.status(500).json({ error: "Failed to create reminder" });
    return;
  }
});

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const reminders = await prisma.reminder.findMany();
    res.status(200).json(reminders);
    return;
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reminders" });
    return;
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reminder = await prisma.reminder.findUnique({ where: { id } });

    if (!reminder) {
      res.status(404).json({ error: "Reminder not found" });
      return;
    } else {
      res.status(200).json({ reminder });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reminder" });
    return;
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, date, time } = req.body;

    if (!name || !date || !time) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const reminder = await prisma.reminder.findUnique({ where: { id } });
    if (!reminder) {
      res.status(404).json({ error: "Reminder not found" });
      return;
    }

    const now = new Date();
    const reminderDateTime = new Date(`${date}T${time}:00.000Z`);
    if (reminderDateTime <= now) {
      res.status(400).json({
        error: "Reminder must be scheduled for a future date and time",
      });
      return;
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: { name, description, date: new Date(date), time },
    });
    res.status(200).json(updatedReminder);
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to update reminder" });
    return;
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exist = await prisma.reminder.findUnique({ where: { id } });
    if (!exist) {
      res.status(404).json({ error: "Reminder not found" });
      return;
    }
    await prisma.reminder.delete({ where: { id } });
    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reminder" });
    return;
  }
});

module.exports = router;
