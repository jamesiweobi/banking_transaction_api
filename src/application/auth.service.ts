import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoUserRepository } from '../infrastructure/database/mongo.user.repo';
import { DuplicateResourceError } from '../errors/duplicateResource.error';
import { UnAuthorizedError } from '../errors/unAuthorized.error';
import dotenv from 'dotenv';
dotenv.config();

export class AuthService {
  constructor(private userRepository: MongoUserRepository) {}

  async register(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new DuplicateResourceError('Email address already in use.');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.createUser({ name, email, password: hashedPassword });
    return { message: 'User registered successfully', user };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnAuthorizedError('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnAuthorizedError('Invalid credentials');

    const token = jwt.sign({ _id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '10days',
    });

    return { token, _id: user.id };
  }
}
