import { Module } from '@nestjs/common';
import { AmiService } from './ami.service';
import {RabbitMqModule} from "../rabbitmq/rabbitmq.module";

@Module({
    providers: [AmiService],
    exports: [AmiService],
    imports: [RabbitMqModule]
})
export class AmiModule {}