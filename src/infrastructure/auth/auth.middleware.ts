import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnAuthorizedError } from '../../errors/unAuthorized.error';
import { AuthRequest } from '../../types/express';
import { MongoUserRepository } from '../database/mongo.user.repo';

const UserRepository = new MongoUserRepository();

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    throw new UnAuthorizedError('Missing authorization header token.');
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await UserRepository.findById(decoded._id);
    (req as any).user = user;
    next();
  } catch (error) {
    throw new UnAuthorizedError();
  }
};
