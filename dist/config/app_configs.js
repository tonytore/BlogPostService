"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const appConfig = {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    BLOG_DB: process.env.BLOG_DB,
    DB_PASSWORD: process.env.DB_PASSWORD,
    APP_NAME: process.env.APP_NAME,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5000',
    DATABASE_URL: process.env.DATABASE_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: 18000,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRY: 86400,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    PORT: process.env.PORT || 3000,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOKI_URL: process.env.LOKI_URL || 'http://loki:3100',
    ACCESS_COOKIE_OPTIONS: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 54000000, // 15 minutes in milliseconds
    },
    RABBITMQ_URL: process.env.RABBITMQ_ENDPOINT || 'amqp://localhost',
};
exports.default = appConfig;
