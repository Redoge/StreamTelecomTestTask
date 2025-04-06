import { Module } from '@nestjs/common';
import { AmiModule } from './ami/ami.module';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AmiModule,
    RabbitMqModule,
  ],
})
export class AmiServiceModule  {}