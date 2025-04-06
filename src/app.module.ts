import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmiServiceModule } from './ami-service.module';
import { DbServiceModule } from './db-service.module';
import { EventProcessorModule } from './event-processor.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        AmiServiceModule,
        DbServiceModule,
        EventProcessorModule,
        UserModule,
        ClientsModule.register([
            {
                name: 'AMI_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    port: 3001,
                },
            },
            {
                name: 'DB_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    port: 3002,
                },
            },
            {
                name: 'EVENT_PROCESSOR_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    port: 3003,
                },
            },
            {
                name: 'USER_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    port: 3004,
                },
            },
        ]),
    ],
    controllers: [],
    providers: []
})
export class AppModule {}