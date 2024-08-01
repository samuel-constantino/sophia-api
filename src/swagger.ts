import swaggerUi from 'swagger-ui-express';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

export const setupSwagger = (app: express.Express) => {
  const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../openapi.json'), 'utf-8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
