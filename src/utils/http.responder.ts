import { Response } from 'express';

function sendResponse<T>(res: Response, statusCode: number, data: T | null, message?: string) {
  const response: any = {
    ...(data !== null ? { data } : {}),
    ...(message ? { message } : {}),
    error: statusCode < 300 ? false : true,
  };
  res.status(statusCode).json(response);
}

export default sendResponse;
