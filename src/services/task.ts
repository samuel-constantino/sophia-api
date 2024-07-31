import { Prisma } from '@prisma/client';
import prisma from "../model/db";

interface PropsType {
  title: string, 
  content: string[], 
  startAt: string| null,
  phone: string
};

export const createTask = async (props: PropsType) => {
    const {title, content, startAt, phone} = props;
    
    const user = await prisma.user
    .findUnique({
      where: {
        phone: phone,
      },
    })
  
    if(!user) {
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
          user: {connect: {
            id: user?.id
          }}
        }
      });
      
      return newTask;
    }
  
    const newTask = await prisma.task.create({
      data: {
        title,
        content,
        startAt,
        user: {connect: {
          id: user?.id
        }}
      }
    });

    return newTask;
};