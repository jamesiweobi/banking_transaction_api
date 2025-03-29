import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './errors/appError.error';
import { connectToMongo } from './config/database/mongo.config';
import logger from './config/logger/custom.logger';
import { swaggerUiServe, swaggerUiSetup } from './config/swagger/swagger';
import routes from './infrastructure/api/routes';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

Object.entries(routes).forEach(([path, router]) => {
  app.use(`/api/v1/${path}`, router);
});

app.use('/api/v1/api-docs', swaggerUiServe, swaggerUiSetup);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

async function startApp() {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      logger.info(`App is running on PORT:${PORT} 🚀🚀🚀`);
      logger.info('Swagger UI is available at http://localhost:3000/api/v1/api-docs');
    });
  } catch (error) {
    logger.error('Application failed to start:', error);
  }
}

startApp();
