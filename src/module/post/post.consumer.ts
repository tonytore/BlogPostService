import { Channel, ConsumeMessage } from 'amqplib';
import { logger } from '@/utils/logger/logger';
import {
  handleCreatePost,
  handleDeletePost,
  handleUpdatePost,
} from './post.controller';
import { PostCommandMessage } from '@/types/message.types';

export async function startPostConsumer(channel: Channel) {
  const exchange = 'post.exchange';
  const queue = 'post.commands';

  await channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, exchange, 'post.create');
  await channel.bindQueue(queue, exchange, 'post.update');
  await channel.bindQueue(queue, exchange, 'post.delete');

  await channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const message: PostCommandMessage = JSON.parse(msg.content.toString());
      switch (message.action) {
        case 'post.create':
          await handleCreatePost(message.payload);
          break;
        case 'post.update':
          await handleUpdatePost(message.payload);
          break;
        case 'post.delete':
          await handleDeletePost(message.payload);
          break;
        default:
          logger.warn('Unknown message action: ' + message.action);
      }
      channel.ack(msg, false);
    } catch (error) {
      logger.error('Post Consumer error: ' + error);
      channel.nack(msg, false, false); // discard
    }
  });

  logger.info('Post Consumer started and listening for messages...');
}
