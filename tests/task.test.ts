import request from 'supertest';
import express from 'express';
import taskRouter from '../src/routes/task';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const channel = req.headers['x-channel'];
  if (!channel) {
    return res.status(400).json({ error: 'x-channel header is required' });
  }
  next();
});
app.use('/tasks', taskRouter);

jest.mock('../src/controllers/task', () => ({
  create: jest.fn((req: express.Request, res: express.Response) => res.status(201).json({ message: 'Task created successfully' })),
  findMany: jest.fn((req: express.Request, res: express.Response) => res.status(200).json([{ id: 1, title: 'Sample Task' }])),
  update: jest.fn((req: express.Request, res: express.Response) => res.status(200).json({ message: 'Task updated successfully' })),
  remove: jest.fn((req: express.Request, res: express.Response) => res.status(200).json({ message: 'Task removed successfully' })),
}));

describe('Task API', () => {
  it('should return 400 if x-channel header is missing', async () => {
    const response = await request(app).post('/tasks');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'x-channel header is required' });
  });

  it('should create a task if x-channel header is present', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('x-channel', 'test-channel')
      .send({ title: 'New Task', content: ['Content'], startAt: null });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Task created successfully' });
  });

  it('should retrieve tasks if x-channel header is present', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('x-channel', 'test-channel');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, title: 'Sample Task' }]);
  });

  it('should update a task if x-channel header is present', async () => {
    const response = await request(app)
      .put('/tasks/1')
      .set('x-channel', 'test-channel')
      .send({ title: 'Updated Task' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Task updated successfully' });
  });

  it('should remove a task if x-channel header is present', async () => {
    const response = await request(app)
      .delete('/tasks/1')
      .set('x-channel', 'test-channel');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Task removed successfully' });
  });
});
