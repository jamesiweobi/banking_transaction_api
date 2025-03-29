import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AppError } from '../../errors/app.error';
import logger from '../logger/custom.logger';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectToMongo = async () => {
  if (!MONGO_URI) {
    throw new AppError('MONGO_URI environment variable is not set.', 500);
  }

  try {
    await mongoose.connect(MONGO_URI, {});
    logger.info('✅ MongoDB Connected!');

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connection established.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('MongoDB disconnected.');
    });
  } catch (error) {
    logger.error('❌ MongoDB Connection Error:', error);
    throw error;
  }
};
