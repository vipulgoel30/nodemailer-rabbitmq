// Third party imports
import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";

let connection: undefined | Connection = undefined;
const queue = "mail";

const initRabbitMq = async () => {
  try {
    connection = await amqp.connect(process.env.CLOUDAMQP_KEY);
    const channel: Channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg: ConsumeMessage | null) => {
      if (msg) {
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export default initRabbitMq;
