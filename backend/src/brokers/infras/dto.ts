import amqp, { Connection, Channel } from 'amqplib';

class RabbitMQ {
  private static connection: Connection | null = null;
  private static channels: { [queue: string]: Channel } = {};

  private async getConnection(): Promise<Connection> {
    if (!RabbitMQ.connection) {
      RabbitMQ.connection = await amqp.connect('amqp://localhost');
      console.log('✅ RabbitMQ Connected.');
    }
    return RabbitMQ.connection;
  }

  async getChannel(queueName: string): Promise<Channel> {
    if (!RabbitMQ.channels[queueName]) {
      const connection = await this.getConnection();
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName, { durable: true });
      RabbitMQ.channels[queueName] = channel;
      console.log(`✅ Channel created for queue: ${queueName}`);
    }
    return RabbitMQ.channels[queueName];
  }
}

export default RabbitMQ;
