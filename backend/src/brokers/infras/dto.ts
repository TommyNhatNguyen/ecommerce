import amqp, { Connection, Channel } from 'amqplib';

class RabbitMQ {
  private connection: Connection | null = null;
  private channels: { [queue: string]: Channel } = {};

  constructor() {}

  getChannels() {
    console.log('🚀 ~ RabbitMQ ~ this.channels:', this.channels);
    return this.channels;
  }

  private async getConnection(): Promise<Connection> {
    if (!this.connection) {
      try {
        this.connection = await amqp.connect(
          `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
        );
        console.log('✅ RabbitMQ Connected.');
        return this.connection;
      } catch (error) {
        console.log('❌ RabbitMQ Connection Failed.');
        throw error;
      }
    }
    return this.connection;
  }

  async getChannel(queueName: string): Promise<Channel> {
    if (!this.channels[queueName]) {
      const connection = await this.getConnection();
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName, { durable: true });
      this.channels[queueName] = channel;
      console.log(`✅ Channel created for queue: ${queueName}`);
    }
    return this.channels[queueName];
  }
}

export default RabbitMQ;
