import amqp from "amqplib"
import appConfig from "./config/app_configs"

const URL = appConfig.RABBITMQ_URL

export async function createChannel() {
    const connection = await amqp.connect(URL)
    const channel = await connection.createChannel()
    return channel
}