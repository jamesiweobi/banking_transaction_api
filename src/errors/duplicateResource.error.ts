import { AppError } from './appError.error';

export class DuplicateResourceError extends AppError {
  constructor(message: string = 'Duplicate entry. Resource with the specified identifier already exists.') {
    super(message, 409);
  }
}
