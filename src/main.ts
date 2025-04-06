import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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

    await app.startAllMicroservices();

    await app.listen(process.env.PORT || 3000);

    console.log(`Main API Gateway is running on port ${process.env.PORT ?? 3000}`);
    console.log('AMI Service is listening on port 3001');
    console.log('DB Service is listening on port 3002');
    console.log('Event Processor Service is listening on port 3003');
    console.log('User Service is listening on port 3004');
}

bootstrap();