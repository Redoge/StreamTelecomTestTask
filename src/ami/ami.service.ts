import { Injectable, Logger } from '@nestjs/common';
import AsteriskManager from 'asterisk-manager';
import { RabbitMqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class AmiService {
    private ami: ReturnType<typeof AsteriskManager>;
    private readonly logger = new Logger(AmiService.name);

    constructor(private readonly rabbitMqService: RabbitMqService) {
        const amiHost = process.env.ASTERISK_HOST || 'localhost';
        const amiPort = parseInt(process.env.ASTERISK_PORT || '5038', 10);
        const amiUser = process.env.ASTERISK_USER || 'admin';
        const amiPass = process.env.ASTERISK_PASS || 'secret';
        console.log({amiUser, amiPass, amiHost, amiPort})
        this.ami = AsteriskManager(amiPort, amiHost, amiUser, amiPass, true);

        this.ami.on('connect', () => {
            this.logger.log('Connected to Asterisk AMI');
        });

        this.ami.on('close', () => {
            this.logger.warn('Disconnected from Asterisk AMI');
        });

        this.ami.on('rawevent', (event: any) => {
            this.handleEvent(event);
        });
        this.ami.on('error', (err: any) => {
            console.log(err)
            this.logger.error(`AMI Error: ${err}`);
        });
    }

    private async handleEvent(event: any) {
        this.logger.log(`Received event: ${event.Event}`);
        await this.rabbitMqService.publish('call_events', event);
    }
}
