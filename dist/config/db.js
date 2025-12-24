"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.connectToDB = connectToDB;
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const app_configs_1 = __importDefault(require("./app_configs"));
const client_1 = require("@prisma/client");
const logger_1 = require("@/utils/logger/logger");
const pool = new pg_1.Pool({
    host: app_configs_1.default.DB_HOST,
    port: Number(app_configs_1.default.DB_PORT),
    database: app_configs_1.default.BLOG_DB,
    user: app_configs_1.default.DB_USER,
    password: app_configs_1.default.DB_PASSWORD,
    max: 5,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.db = new client_1.PrismaClient({ adapter });
async function connectToDB() {
    try {
        await exports.db.$connect();
        logger_1.logger.info('[database]: connected!');
    }
    catch (err) {
        console.log('[database]: connection error: ', err);
        await exports.db.$disconnect();
    }
}
