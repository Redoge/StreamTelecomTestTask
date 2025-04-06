import { Module } from '@nestjs/common';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RabbitMqModule,
    DatabaseModule,
    AuthModule,
  ],
  providers: [],
})
export class DbServiceModule {}