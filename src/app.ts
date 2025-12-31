import { connectRabbitMQChannel } from './rabbitmq/consument';
import { startPostConsumer } from './module/post/post.consumer';
import { logger } from './utils/logger/logger';

async function bootstrap() {
  const channel = await connectRabbitMQChannel();
  await startPostConsumer(channel);

  logger.info('Post Service is running and listening...');
}

bootstrap();
