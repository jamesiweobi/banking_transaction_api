import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { ValidationError } from 'class-validator';
import logger from '../infrastructure/logger/custom.logger';

dotenv.config();

export class AppError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number = 400, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.details || [],
    });
  }
  logger.error('Unexpected Error: ', err);
  return handleInternalServerError(res, err);
};

function handleInternalServerError(res: Response, err: Error) {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    logger.error('Internal Server Error (Production):', err);
    return res.status(500).json({ message: 'Service temporarily unavailable. Please try again later.' });
  } else {
    logger.error('Internal Server Error (Development):', err);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: err.message,
      stack: err.stack,
      timestamp: new Date(),
    });
  }
}
