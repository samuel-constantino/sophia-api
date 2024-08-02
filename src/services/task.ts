// services/task.ts
import { sortTaskByStartDate } from "../helpers";
import prisma from "../model/db";
import { createTaskSchema, updateTaskSchema } from "../validation/taskSchema";

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
  const validatedData = createTaskSchema.parse(props);

  const { title, content, startAt, phone } = validatedData;

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    const newUser = await prisma.user.create({ data: { phone } });

    const newTask = await prisma.task.create({
      data: {
        title,
        content,
        startAt,
        user: { connect: { id: newUser.id } }
      }
    });

    return newTask;
  }

  const newTask = await prisma.task.create({
    data: {
      title,
      content,
      startAt,
      user: { connect: { id: user?.id } }
    }
  });

  return newTask;
};

export const readTasks = async (props: { phone: string }) => {
  const { phone } = props;

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    throw new Error(`Usuário com telefone ${phone} não encontrado`);
  };

  const tasks = await prisma.task.findMany({ 
    where: { userId: user.id }
  });

  return sortTaskByStartDate(tasks);
};

export const updateTask = async (props: UpdatePropsType) => {
  const validatedData = updateTaskSchema.parse(props);

  const { payload, id, phone } = validatedData;

  const user = await prisma.user.findUnique({ 
    where: { phone },
  });

  if (!user) return null;

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { ...payload }
  });

  return updatedTask;
};

export const removeTask = async (props: { id: number, phone: string }) => {
  const { id, phone } = props;

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) return null;

  const removedTask = await prisma.task.delete({ where: { id } });

  return removedTask;
};
