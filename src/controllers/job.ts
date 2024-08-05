// controllers/task.ts
import { Request, Response } from "express";
import { reminderTasks } from "../services/task";
import { sendLetter } from "../services/postman";

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

export const postman = async (req: Request, res: Response) => {
  try {
    const data = await sendLetter();
    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.dir({ errors: error.message });
      return res.status(400).json({ errors: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};