import { IUser } from '../domain/user';

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
}
