import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './errors/app.error';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`App is running on PORT:${PORT} 🚀🚀🚀`);
});
