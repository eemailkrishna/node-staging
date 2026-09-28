import express, { type Express } from 'express';
import helloRoutes from './routes/hello.routes.js';
import userRoutes from './routes/user.routes.js';
import { logger, notFound, errorHandler } from './middleware/common.js';

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(logger);

  app.use('/', helloRoutes);
  app.use('/api/users', userRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
