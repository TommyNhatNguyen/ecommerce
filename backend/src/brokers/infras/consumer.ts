import { QueueTypes } from 'src/brokers/transport/queueTypes';
import RabbitMQ from 'src/brokers/infras/dto';

export class Consumer {
  constructor(private readonly rabbitMQ: RabbitMQ) {}
  async consumeMessages(queue: QueueTypes, callback: (msg: any) => void) {
    try {
      const channel = await this.rabbitMQ.getChannel(queue);
      await channel.consume(queue, (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
          console.log(`📥 Received message from ${queue}:`, content);
          callback(content);
          channel.ack(msg); // Acknowledge the message
        }
      });
    } catch (error) {
      console.error(`❌ Error consuming from ${queue}:`, error);
    }
  }
}

export default Consumer;
