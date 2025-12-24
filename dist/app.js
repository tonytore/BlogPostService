"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitmq_1 = require("./config/rabbitmq");
const post_consumer_1 = require("./module/post/post.consumer");
async function bootstrap() {
    const channel = await (0, rabbitmq_1.createRabbitChannel)();
    await (0, post_consumer_1.startPostConsumer)(channel);
    console.log('Post Service is running and listening...');
}
bootstrap();
