import winston, { Logger } from 'winston';

class CustomLogger {
  private static instance: CustomLogger;
  private logger: Logger;
  private environment: string;

  constructor(environment: string) {
    this.environment = environment;
    this.logger = this.createLogger();
  }

  private createLogger(): Logger {
    const transports = [];

    if (this.environment === 'production') {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      );
    } else {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
      );
    }

    return winston.createLogger({
      level: 'info',
      transports,
    });
  }

  static getInstance(environment: string): CustomLogger {
    if (!CustomLogger.instance) {
      CustomLogger.instance = new CustomLogger(environment);
    }
    return CustomLogger.instance;
  }

  log(level: string, message: string, meta?: any): void {
    this.logger.log(level, message, meta);
  }

  info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: any): void {
    this.log('error', message, meta);
  }

  debug(message: string, meta?: any): void {
    if (this.environment !== 'production') {
      this.log('debug', message, meta);
    }
  }
}

const environment = process.env.NODE_ENV || 'development';
const logger = CustomLogger.getInstance(environment);
export default logger;
