import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.array(z.string()).optional(),
  startAt: z.string().nullable().optional(),
  finishAt: z.string().nullable().optional(),
  daily: z.boolean().optional(),
  phone: z.string().min(1, "Phone is required")
});

export const updateTaskSchema = z.object({
  id: z.number().positive("ID must be a positive number"),
  payload: z.object({
    title: z.string().optional(),
    content: z.array(z.string()).optional(),
    completed: z.boolean().optional(),
    startAt: z.string().nullable().optional(),
    finishAt: z.string().nullable().optional(),
    daily: z.boolean().optional(),
  }),
  phone: z.string().min(1, "Phone is required")
});
