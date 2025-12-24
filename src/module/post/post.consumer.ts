import { Channel, ConsumeMessage } from 'amqplib';
import { CreatePostPayload, createPostService } from './post.service';
import { UnauthenticatedError } from '@/utils/error/custom_error_handler';
import { Role } from '@prisma/client';
import { logger } from '@/utils/logger/logger';

export async function startPostConsumer(channel: Channel) {
  const queue = 'post.commands';
  await channel.assertQueue(queue, { durable: true });
  await channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const message = JSON.parse(msg.content.toString());
      switch (message.type) {
        case 'CREATE_POST':
          await handleCreatePost(message.payload);
          break;
        default:
          logger.warn('Unknown message type: ' + message.type);
          channel.ack(msg, false);
      }
    } catch (error) {
      logger.error('Post Consumer error: ' + error);
      channel.nack(msg, false, false); // discard
    }
  });
}

async function handleCreatePost(payload: CreatePostPayload) {
  const { title, content, excerpt, status, categoryId, tags, authorId, role } =
    payload;

  if (role !== Role.ADMIN && role !== Role.AUTHOR) {
    throw new UnauthenticatedError(
      'Not authorized to create post',
      'post.consumer.handleCreatePost()',
    );
  }

  await createPostService({
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
