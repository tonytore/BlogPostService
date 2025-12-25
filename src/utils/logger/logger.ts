import appConfig from '@/config/app_configs';
import winston, { Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const winstonLogger = (
  name: string,
  level: string,
  nodeEnv: 'development' | 'production',
): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${label || name}] ${level}: ${message}`;
        }),
      ),
    },
    file: new DailyRotateFile({
      filename: 'logs/application%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  };

  const transports: winston.transport[] = [options.file];

  if (nodeEnv === 'development') {
    transports.push(new winston.transports.Console(options.console));
  }
  return winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: transports,
  });
};

const logger = winstonLogger(
  appConfig.APP_NAME || 'post-service',
  appConfig.LOG_LEVEL || 'info',
  appConfig.NODE_ENV || 'development',
);

export { logger };
