// controllers/task.ts

import { Request, Response } from "express";
import { z } from 'zod';
import {
  createTask,
  readTasks,
  updateTask,
  removeTask,
} from "../services/task";

export const create = async (req: Request, res: Response) => {
  try {
    const { title, subtasks, startAt, remindAt, daily } = req.body;
    const channel = req.headers['x-channel'] as string;
    const phone = channel.split('@')[0];

    const data = { title, subtasks, startAt, remindAt, daily, phone };

    const result = await createTask(data);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    if (error instanceof Error) {
      return res.status(400).json({ errors: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const findMany = async (req: Request, res: Response) => {
  try {
    const channel = req.headers['x-channel'] as string;
    const phone = channel.split('@')[0];

    const tasks = await readTasks({ phone });

    return res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ errors: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const channel = req.headers['x-channel'] as string;
    const phone = channel.split('@')[0];
    const id = parseInt(req.params.id);

    const {
      title,
      subtasks,
      completed,
      startAt,
      remindAt,
      daily,
    } = req.body;

    const payload = {
      title,
      subtasks,
      completed,
      startAt,
      remindAt,
      daily,
    };

    const task = await updateTask({ payload, id, phone });

    return res.status(200).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const channel = req.headers['x-channel'] as string;
    const phone = channel.split('@')[0];
    const id = parseInt(req.params.id);

    const removedTask = await removeTask({ id, phone });

    return res.status(200).json(removedTask);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
