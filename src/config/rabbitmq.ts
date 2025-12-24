import amqp from "amqplib"
import appConfig from "./app_configs"

const URL = appConfig.RABBITMQ_URL

export async function createRabbitChannel() {
    const connection = await amqp.connect(URL)
    const channel = await connection.createChannel()
    return channel
}