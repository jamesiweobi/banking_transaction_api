import { NextFunction, Request, Response } from 'express';
import { MongoUserRepository } from '../database/mongo.user.repo';
import { AuthService } from '../../application/auth.service';
import { LoginDto, RegisterDto } from '../../application/dto/auth.dto';
import sendResponse from '../../utils/http.responder';
import validateDto from '../../utils/dto.validator';

const authService = new AuthService(new MongoUserRepository());

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateDto(RegisterDto, req.body, next);
    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);
    sendResponse(res, 201, result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateDto(LoginDto, req.body, next);
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};
