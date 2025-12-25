import { Channel, ConsumeMessage } from 'amqplib';
import {
  CreatePostPayload,
  createPostService,
  DeletePostService,
  updatePostService,
} from './post.service';
import {
  ForbiddenError,
  UnauthenticatedError,
} from '@/utils/error/custom_error_handler';
import { Role } from '@prisma/client';
import { logger } from '@/utils/logger/logger';

interface MessageMeta {
  userId: string;
  role: Role;
  requestId: string;
  timestamp: number;
}

interface MessagePayload<T> {
  action: 'post.create' | 'post.update' | 'post.delete';
  data: T;
  meta: MessageMeta;
}

export async function startPostConsumer(channel: Channel) {
  const exchange = 'post. exchange';
  const queue = 'post.commands';

  await channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.assertQueue(queue, { durable: true });

  await channel.bindQueue(queue, exchange, 'post.create');
  await channel.bindQueue(queue, exchange, 'post.update');
  await channel.bindQueue(queue, exchange, 'post.delete');

  await channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const message = JSON.parse(msg.content.toString());
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
          logger.warn('Unknown message type: ' + message.type);
      }
      channel.ack(msg, false);
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

async function handleUpdatePost(
  message: MessagePayload<{
    id: string;
    title?: string;
    content?: string;
    excerpt?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    categoryId?: string;
    tags?: string[];
    authorId?: string | null;
    role?: Role;
  }>,
) {
  const { data, meta } = message;

  if (meta.role !== Role.ADMIN && meta.role !== Role.AUTHOR) {
    throw new ForbiddenError(
      'Not authorized to update post',
      'post.consumer.handleUpdatePost',
    );
  }

  await updatePostService({
    id: data.id,
    data,
    authorId: meta.userId,
    role: meta.role,
  });
}

async function handleDeletePost(message: MessagePayload<{ id: string }>) {
  const { data, meta } = message;

  if (meta.role !== Role.ADMIN && meta.role !== Role.AUTHOR) {
    throw new ForbiddenError(
      'Not authorized to delete post',
      'post.consumer.handleDeletePost',
    );
  }

  await DeletePostService(data.id, meta.userId, meta.role);
}
