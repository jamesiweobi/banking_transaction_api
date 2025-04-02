import { Request } from 'express';
import { IUser } from '../application/domain/user';

export interface AuthRequest extends Request {
  user?: IUser;
}
