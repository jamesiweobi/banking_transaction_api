import { AppError } from "./app.error";

export class BadRequestError extends AppError {
  constructor(message: string, details?: string) {
    super(message, 400, details);
  }
}