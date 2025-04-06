import { Injectable, Logger } from '@nestjs/common';
import { connect, Channel } from 'amqplib';

@Injectable()
export class RabbitMqService{
    private channel: Channel;
    private readonly logger = new Logger(RabbitMqService.name);

    async connect() {
        try {
            const rabbitMqUrl = process.env.RABBITMQ_URL;
            this.logger.log(`Connecting to RabbitMQ at ${rabbitMqUrl}`);
            if (!rabbitMqUrl) {
                throw new Error('RabbitMQ URL is not defined in environment variables');
            }
            const connection = await connect(rabbitMqUrl);
            this.logger.log('Successfully connected to RabbitMQ');

            this.channel = await connection.createChannel();
            this.logger.log('Channel created successfully');

            await this.channel.assertQueue('call_events', { durable: true });
            this.logger.log('Queue "call_events" asserted');
        } catch (err) {
            this.logger.error(`RabbitMQ connection error: ${err}`);
        }
    }

    async publish(queue: string, message: any) {
        try {
            if (!this.channel) {
                this.logger.log('Channel is not initialized, waiting for connection...');
                await this.connect();
            }
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });
            this.logger.log(`Message sent to queue ${queue}`);
        } catch (err) {
            this.logger.error(`Error publishing to RabbitMQ: ${err}`);
        }
    }

    async consume(queue: string, callback: (msg: any) => void) {
        try {
            if (!this.channel) {
                this.logger.log('Channel is not initialized, waiting for connection...');
                await this.connect();
            }

            this.channel.consume(queue, (msg) => {
                if (msg) {
                    callback(JSON.parse(msg.content.toString()));
                    this.channel.ack(msg);
                }
            });
            this.logger.log(`Started consuming from queue ${queue}`);
        } catch (err) {
            this.logger.error(`Error consuming from RabbitMQ: ${err}`);
        }
    }

}
