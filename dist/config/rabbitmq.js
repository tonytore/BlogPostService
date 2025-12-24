"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRabbitChannel = createRabbitChannel;
const amqplib_1 = __importDefault(require("amqplib"));
const app_configs_1 = __importDefault(require("./app_configs"));
const URL = app_configs_1.default.RABBITMQ_URL;
async function createRabbitChannel() {
    const connection = await amqplib_1.default.connect(URL);
    const channel = await connection.createChannel();
    return channel;
}
