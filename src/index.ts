import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors';

const prisma = new PrismaClient()
const app = express()

app.use(cors());
app.use(express.json())

// Middleware para verificar o header x-channel
app.use((req, res, next) => {
  const channel = req.headers['x-channel'];
  if (!channel) {
    return res.status(400).json({ error: 'x-channel header is required' });
  }
  next();
});

app.post(`/task`, async (req, res) => {
  const { title="", content=[] } = req.body
  const phone = req.headers['x-channel'] as string;

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
    
    const createdTask = await prisma.task.create({
      data: {
        title,
        content,
        user: {connect: {
          id: user?.id
        }}
      }
    });
    
    return res.json(createdTask)
  }

  const createdTask = await prisma.task.create({
    data: {
      title,
      content,
      user: {connect: {
        id: user?.id
      }}
    }
  });
  
  res.json(createdTask)
})

const server = app.listen(3000, () =>
  console.log(`Server ready at: http://localhost:3000`),
)
