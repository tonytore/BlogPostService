import appConfig from '@/config/app_configs';
import amqp from 'amqplib';

const URL = appConfig.RABBITMQ_URL;

export async function connectRabbitMQChannel() {
  const connection = await amqp.connect(URL);
  const channel = await connection.createChannel();
  return channel;
}
