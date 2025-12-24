"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const app_configs_1 = __importDefault(require("@/config/app_configs"));
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const winstonLogger = (name, level, nodeEnv) => {
    const options = {
        console: {
            level,
            handleExceptions: true,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ level, message, label, timestamp }) => {
                return `${timestamp} [${label || name}] ${level}: ${message}`;
            })),
        },
        file: new winston_daily_rotate_file_1.default({
            filename: 'logs/application%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '14d',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
        }),
    };
    const transports = [options.file];
    if (nodeEnv === 'development') {
        transports.push(new winston_1.default.transports.Console(options.console));
    }
    return winston_1.default.createLogger({
        exitOnError: false,
        defaultMeta: { service: name },
        transports: transports,
    });
};
const logger = winstonLogger(app_configs_1.default.APP_NAME || 'blog-backend', app_configs_1.default.LOG_LEVEL || 'info', app_configs_1.default.NODE_ENV || 'development');
exports.logger = logger;
