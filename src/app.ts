import { createRabbitChannel } from './config/rabbitmq';
import { startPostConsumer } from './module/post/post.consumer';

async function bootstrap() {
  const channel = await createRabbitChannel();
  await startPostConsumer(channel);

  console.log('Post Service is running and listening...');
}

bootstrap();
