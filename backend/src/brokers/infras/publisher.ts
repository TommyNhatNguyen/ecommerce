import RabbitMQ from 'src/brokers/infras/dto';
import { QueueTypes } from 'src/brokers/transport/queueTypes';

export class Publisher {
  constructor(private readonly rabbitMQ: RabbitMQ) {}
  async publishMessage(queue: QueueTypes, message: object) {
    try {
      const channel = await this.rabbitMQ.getChannel(queue);
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      console.log(`📩 Message sent to ${queue}:`, message);
    } catch (error) {
      console.error(`❌ Error publishing to ${queue}:`, error);
    }
  }
}

export default Publisher;
