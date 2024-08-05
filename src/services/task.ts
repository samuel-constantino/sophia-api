// services/task.ts

import { sendMessage, sortTaskByStartDate } from "../helpers";
import prisma from "../model/db";
import { createTaskSchema, updateTaskSchema } from "../validation/taskSchema";
import dotenv from "dotenv";

dotenv.config();

const {REMINDER_MINUTES_INCREASE="60"} = process.env;

interface CreatePropsType {
  title: string,
  content: string[],
  startAt: string | null,
  finishAt: string | null,
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

  const { title, content, startAt, finishAt, daily, phone } = validatedData;

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    const newUser = await prisma.user.create({ data: { phone } });

    const newTask = await prisma.task.create({
      data: {
        title,
        content,
        startAt,
        finishAt,
        daily,
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

export const reminderTasks = async () => {
  // Buscar todas as tarefas pendentes
  const pendingTasks = await prisma.task.findMany({
    where: { completed: false },
    include: { user: true }
  });

  // Hora atual ajustada para -3 horas
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() - 3);

  // Hora atual + incremento
  const minutesLater = new Date(currentTime.getTime() + Number(REMINDER_MINUTES_INCREASE) * 60 * 1000);

  // Filtrar tarefas com startAt dentro de 5 minutos depois da hora atual
  const filteredTasks = pendingTasks.filter(task => {
    if (!task.startAt) return false;
    const startAtDate = new Date(task.startAt);
    return startAtDate >= currentTime && startAtDate <= minutesLater;
  });
  
  filteredTasks.forEach(async (task) => {
    const phone = task.user.phone;
    const message = `Ei, lembre-se da tarefa ${task.title}`;
    await sendMessage(phone, message);
  });

  const resumeTasks = filteredTasks.map(({title, startAt}) => ({title, startAt}));

  console.dir({currentTime: currentTime, resumeTasks});
  
  return { success: true, currentTime, resumeTasks};
};
