import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnAuthorizedError } from '../../errors/unAuthorized.error';
import { AuthRequest } from '../../types/express';
// import { IUser } from '../../application/domain/user';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    throw new UnAuthorizedError('Missing authorization header token.');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    throw new UnAuthorizedError();
  }
};
