import { Module } from '@nestjs/common';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RabbitMqModule,
    EventsModule,
  ],
})
export class EventProcessorModule {}