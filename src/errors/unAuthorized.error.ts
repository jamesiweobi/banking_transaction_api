import { AppError } from './appError.error';

export class UnAuthorizedError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 401);
  }
}
