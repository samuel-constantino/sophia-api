
// index.ts
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import router from "./routes/index";
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware para verificar o header x-channel
app.use((req, res, next) => {
  if (req.path.startsWith('/api-docs')) {
    return next();
  }
  
  const channel = req.headers['x-channel'];
  if (!channel) {
    return res.status(400).json({ error: 'x-channel header is required' });
  }
  next();
});

app.use(router);

// Configuração do Swagger
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
