import { Prisma } from '@prisma/client';
import prisma from "../model/db";

interface CreatePropsType {
  title: string,
  content: string[],
  startAt: string | null,
  phone: string
};

interface UpdatePropsType {
  payload: object,
  id: number,
  phone: string,
}

export const createTask = async (props: CreatePropsType) => {
  const { title, content, startAt, phone } = props;

  const user = await prisma.user
    .findUnique({
      where: {
        phone: phone,
      },
    })

  if (!user) {
    const user = await prisma.user.create({
      data: {
        phone: phone,
        roles: [2],
      }
    });

    const newTask = await prisma.task.create({
      data: {
        title,
        content,
        startAt,
        user: {
          connect: {
            id: user?.id
          }
        }
      }
    });

    return newTask;
  }

  const newTask = await prisma.task.create({
    data: {
      title,
      content,
      startAt,
      user: {
        connect: {
          id: user?.id
        }
      }
    }
  });

  return newTask;
};

export const readTasks = async (props: { phone: string }) => {
  const { phone } = props;

  const user = await prisma.user
    .findUnique({
      where: {
        phone: phone,
      },
    })

  if (!user) return null;

  const tasks = await prisma.task
    .findMany({
      where: {
        userId: user.id,
      },
    })

  return tasks;
};

export const updateTask = async (props: UpdatePropsType) => {
  const { payload, id, phone } = props;

  const user = await prisma.user
    .findUnique({
      where: {
        phone: phone,
      },
    })

  if (!user) return null;

  const updatedTask = await prisma.task
    .update({
      where: { id },
      data: { ...payload }
    })

  return updatedTask;
};

export const removeTask = async (props: {id: number, phone: string}) => {
  const { id, phone } = props;

  const user = await prisma.user
    .findUnique({
      where: {
        phone: phone,
      },
    })

  if (!user) return null;

  const removedTask = await prisma.task
    .delete({
      where: { id },
    })

  return removedTask;
};