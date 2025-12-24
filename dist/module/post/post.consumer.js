"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPostConsumer = startPostConsumer;
const post_service_1 = require("./post.service");
const custom_error_handler_1 = require("@/utils/error/custom_error_handler");
const client_1 = require("@prisma/client");
const logger_1 = require("@/utils/logger/logger");
async function startPostConsumer(channel) {
    const queue = 'post.commands';
    await channel.assertQueue(queue, { durable: true });
    await channel.consume(queue, async (msg) => {
        if (!msg)
            return;
        try {
            const message = JSON.parse(msg.content.toString());
            switch (message.type) {
                case 'CREATE_POST':
                    await handleCreatePost(message.payload);
                    break;
                default:
                    logger_1.logger.warn('Unknown message type: ' + message.type);
                    channel.ack(msg, false);
            }
        }
        catch (error) {
            logger_1.logger.error('Post Consumer error: ' + error);
            channel.nack(msg, false, false); // discard
        }
    });
}
async function handleCreatePost(payload) {
    const { title, content, excerpt, status, categoryId, tags, authorId, role } = payload;
    if (role !== client_1.Role.ADMIN && role !== client_1.Role.AUTHOR) {
        throw new custom_error_handler_1.UnauthenticatedError('Not authorized to create post', 'post.consumer.handleCreatePost()');
    }
    await (0, post_service_1.createPostService)({
        data: {
            title,
            content,
            excerpt,
            status,
            categoryId,
            tags,
        },
        authorId,
    });
}
