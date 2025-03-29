import { AppError } from './appError.error';

export class BadRequestError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}
