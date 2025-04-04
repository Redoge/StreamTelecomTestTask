import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { DatabaseModule } from '../database/database.module';
import { RabbitMqModule } from '../rabbitmq/rabbitmq.module';
import {EventRepository} from "./repository/event.repository";
import {EventsController} from "./events.controller";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";

@Module({
    imports: [DatabaseModule, RabbitMqModule, AuthModule, UserModule],
    providers: [EventsService, EventRepository],
    controllers: [EventsController],
})
export class EventsModule {}