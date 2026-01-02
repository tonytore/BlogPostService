import express from 'express';
import dotenv from 'dotenv';
import { connectRabbitMQChannel } from './rabbitmq/consument';
import { startPostConsumer } from './module/post/post.consumer';
import { logger } from './utils/logger/logger';
import appConfig from './config/app_configs';
import postRoutes from './module/post/post.routes';

dotenv.config();

async function bootstrap() {
  const app = express();
  app.use(express.json());

  app.use('/posts', postRoutes);

  const PORT = appConfig.PORT || 4002;

  app.listen(PORT, () => {
    logger.info(`Post Service is listening on port ${PORT}`);
  });

  const channel = await connectRabbitMQChannel();
  await startPostConsumer(channel);

  logger.info('Post Service is running and listening...');
}

bootstrap();
