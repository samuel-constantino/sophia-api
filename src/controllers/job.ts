// controllers/task.ts
import { Request, Response } from "express";
import { reminderTasks } from "../services/task";

export const reminder = async (req: Request, res: Response) => {
  try {
    const data = await reminderTasks();
    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ errors: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};