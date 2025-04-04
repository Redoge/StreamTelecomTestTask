import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AmiServiceModule } from "./ami-service.module";
import { DbServiceModule } from "./db-service.module";
import { EventProcessorModule } from "./event-processor.module";
import { UserModule } from "./user/user.module";
import { AppModule } from "./app.module"; // Потрібно створити цей модуль

async function bootstrap() {
    // Створюємо основний HTTP-сервер (API Gateway)
    const app = await NestFactory.create(AppModule);

    // Реєструємо мікросервіси як клієнти у головному додатку
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: 'localhost',
            port: 3001,
        },
    });

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: 'localhost',
            port: 3002,
        },
    });

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: 'localhost',
            port: 3003,
        },
    });

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: 'localhost',
            port: 3004,
        },
    });

    // Запускаємо мікросервіси разом з основним додатком
    await app.startAllMicroservices();

    // Запускаємо HTTP-сервер
    await app.listen(process.env.PORT || 3000);

    console.log(`Main API Gateway is running on port ${process.env.PORT ?? 3000}`);
    console.log('AMI Service is listening on port 3001');
    console.log('DB Service is listening on port 3002');
    console.log('Event Processor Service is listening on port 3003');
    console.log('User Service is listening on port 3004');
}

bootstrap();