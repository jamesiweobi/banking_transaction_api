import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './errors/app.error';
import { connectToMongo } from './infrastructure/database/mongo.config';
import logger from './infrastructure/logger/custom.logger';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

async function startApp() {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      logger.info(`App is running on PORT:${PORT} 🚀🚀🚀`);
    });
  } catch (error) {
    logger.error('Application failed to start:', error);
  }
}

startApp();
