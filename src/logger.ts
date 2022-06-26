import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logFormat = winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    logFormat
  ),
  transports: [
    // new winstonDaily({
    //   level: 'info',
    //   datePattern: 'YYYY-MM-DD',
    //   dirname: 'logs',
    //   filename: '%DATE%.log',
    //   maxFiles: 10,
    // }),
    // new winstonDaily({
    //     level: 'wran',
    //     datePattern: 'YYYY-MM-DD',
    //     dirname: 'logs/warns',
    //     filename: '%DATE%.log',
    //     maxFiles: 10,
    //   }),
    //   new winstonDaily({
    //     level: 'error',
    //     datePattern: 'YYYY-MM-DD',
    //     dirname: 'logs/errors',
    //     filename: '%DATE%.log',
    //     maxFiles: 10,
    //   })  
    // ]
});

export const stream = {
  write: (message: string) => logger.info(message)
}

