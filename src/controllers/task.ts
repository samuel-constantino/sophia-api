import { Prisma } from '@prisma/client';
import { Request, Response } from "express";

import {
    createTask,
    readTasks,
    updateTask,
    removeTask,
} from "../services/task";

export const create = async (req: Request, res: Response) => {
    const { title, content, startAt } = req.body;
    const phone = req.headers['x-channel'] as string;

    const data = { title, content, startAt, phone }

    const result = await createTask(data);
    return res.status(201).json(result);
};

export const findMany = async (req: Request, res: Response) => {
    const phone = req.headers['x-channel'] as string;
    const tasks = await readTasks({ phone });

    return res.status(200).json(tasks);
};

export const update = async (req: Request, res: Response) => {
    const phone = req.headers['x-channel'] as string;
    const id = parseInt(req.params.id);

    let payload = {};

    const {
        title,
        content,
        completed,
        startAt,
        finishAt,
        daily,
    } = req.body;

    if (title) {
        payload = {
            ...payload,
            title,
        }
    }

    if (content) {
        payload = {
            ...payload,
            content,
        }
    }

    if (completed) {
        payload = {
            ...payload,
            completed,
        }
    }

    if (startAt) {
        payload = {
            ...payload,
            startAt,
        }
    }

    if (finishAt) {
        payload = {
            ...payload,
            finishAt,
        }
    }

    if (daily) {
        payload = {
            ...payload,
            daily,
        }
    }

    const task = await updateTask({ payload, id, phone });

    return res.status(200).json(task);
};

export const remove = async (req: Request, res: Response) => {
    const phone = req.headers['x-channel'] as string;
    const id = parseInt(req.params.id);

    const removedTask = await removeTask({ id, phone });

    return res.status(201).json(removedTask);
};