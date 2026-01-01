import appConfig from '@/config/app_configs';
import amqp from 'amqplib';

const URL = appConfig.RABBITMQ_URL;

export async function connectRabbitMQChannel() {
  while (true) {
    try {
      const connection = await amqp.connect(URL);
      const channel = await connection.createChannel();
      return channel;
    } catch (error) {
      console.warn('RabbitMQ not ready, retrying in 5s...', error);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}
