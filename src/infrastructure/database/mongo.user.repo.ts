import UserModel from './schemas/user.schema';
import { IUserRepository } from '../../application/ports/user.interface.repo';
import { IUser } from '../../application/domain/user';
import mongoose from 'mongoose';

export class MongoUserRepository implements IUserRepository {
  async createUser(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    const hydratedUser = savedUser.toObject() as unknown as IUser;
    return hydratedUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email }).select({ password: true });
    return user ? (user.toObject() as unknown as IUser) : null;
  }

  async findById(_id: string): Promise<IUser | null> {
    const user = await UserModel.findById(_id);
    return user ? (user.toObject() as unknown as IUser) : null;
  }
}
