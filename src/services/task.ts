// services/task.ts

import { sendMessage, sortTaskByStartDate } from "../helpers";
import prisma from "../model/db";
import { createTaskSchema, updateTaskSchema } from "../validation/taskSchema";

interface CreatePropsType {
  title: string,
  subtasks: string[],
  startAt: string | null,
  remindAt: string | null,
  daily: boolean,
  phone: string
};

interface UpdatePropsType {
  payload: object,
  id: number,
  phone: string,
}

export const createTask = async (props: CreatePropsType) => {
  const validatedData = createTaskSchema.parse(props);

  const { title, subtasks, startAt, remindAt, daily, phone } = validatedData;

  const user = await prisma.user.findUnique({ where: { phone } });

  const payload = {
    title,
    subtasks,
    startAt,
    remindAt,
    daily
  };

  if (!user) {
    const newUser = await prisma.user.create({ data: { phone } });

    const newTask = await prisma.task.create({
      data: {
        ...payload,
        user: { connect: { id: newUser.id } }
      }
    });

    console.dir({ createdTask: newTask });

    return newTask;
  }

  const newTask = await prisma.task.create({
    data: {
      ...payload,
      user: { connect: { id: user?.id } }
    }
  });

  console.dir({ createdTask: newTask });

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

  console.dir({ updatedTask });

  return updatedTask;
};

export const removeTask = async (props: { id: number, phone: string }) => {
  const { id, phone } = props;

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) return null;

  const removedTask = await prisma.task.delete({ where: { id } });

  console.dir({ removedTask });

  return removedTask;
};

export const reminderTasks = async () => {
  // Buscar todas as tarefas pendentes
  const pendingTasks = await prisma.task.findMany({
    where: {
      completed: false
    },
    include: { user: true }
  });

  // Hora atual com segundos zerados e ajustada para -3 horas (fuso horário)
  const currentTime = new Date();
  currentTime.setSeconds(0, 0);
  currentTime.setHours(currentTime.getHours() - 3);

  pendingTasks.forEach(async ({ title, remindAt, startAt, user }) => {
    if (!remindAt || !startAt) return;

    const remindTime = new Date(remindAt);
    remindTime.setSeconds(0, 0);

    if (currentTime.getTime() !== remindTime.getTime()) return;

    const startTime = new Date(startAt);
    startTime.setSeconds(0, 0);

    if(currentTime > startTime) {
      console.dir({remindedTask: {title, startAt, remindAt}});
      const message = `Ei, você completou a tarefa ${title}?`;
      await sendMessage(user.phone, message);
    }
    
    if(currentTime <= startTime) {
      console.dir({confirmatedTask: {title, startAt, remindAt}});
      const formatedTime = startTime.toLocaleDateString('pt-BR', {
        hour: "numeric",
        minute: "numeric"
      })

      const message = `Ei, você lembre-se da tarefa ${title} às ${formatedTime}`;
      await sendMessage(user.phone, message);
    } 
  });

  return { success: true, currentTime };
};
