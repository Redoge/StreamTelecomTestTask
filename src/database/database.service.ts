import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private readonly logger = new Logger(DatabaseService.name);
    pool: Pool;
    private readonly maxRetries = 30;
    private readonly retryDelay = 2000; // мс

    constructor() {
        const dbConfig = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            // Налаштування пулу
            max: 20, // максимальна кількість клієнтів у пулі
            idleTimeoutMillis: 30000, // час простою клієнта перед звільненням
            connectionTimeoutMillis: 2000, // час очікування з'єднання
        };

        console.log({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT || '5432', 10),
        });

        this.pool = new Pool(dbConfig);

        // Слухач помилок пулу
        this.pool.on('error', (err: Error) => {
            this.logger.error(`Несподівана помилка пулу: ${err.message}`);
        });
    }

    // Реалізація інтерфейсу OnModuleInit для автоматичного підключення при запуску
    async onModuleInit() {
        await this.connectWithRetry();
    }

    private async connectWithRetry(retries = 0): Promise<void> {
        try {
            // Перевіряємо підключення, отримуючи тестового клієнта з пулу
            const client = await this.pool.connect();
            client.release();
            this.logger.log('Підключення до пулу PostgreSQL успішне');
        } catch (err) {
            if (retries < this.maxRetries) {
                this.logger.warn(`Спроба підключення до PostgreSQL не вдалася (${retries + 1}/${this.maxRetries}): ${err.message}`);

                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.connectWithRetry(retries + 1);
            }

            this.logger.error(`Не вдалося підключитися до PostgreSQL після ${this.maxRetries} спроб`);
            throw err;
        }
    }

    async executeQuery(query: string, values: any[] = []) {
        if(!query) {
            this.logger.debug('Query is empty')
            return null;
        }

        let client: PoolClient | null = null;

        try {
            client = await this.pool.connect();
            const res = await client.query(query, values);
            return res.rows;
        } catch (err) {
            this.logger.error(JSON.stringify(err))
            this.logger.error(`Помилка виконання запиту: ${err.message}`);
            throw err;
        } finally {
            // Завжди повертаємо клієнта в пул
            if (client) client.release();
        }
    }

    async isPostgresReady(): Promise<boolean> {
        let client: PoolClient | null = null;

        try {
            client = await this.pool.connect();
            await client.query('SELECT 1');
            return true;
        } catch (error) {
            this.logger.warn(`Підключення до PostgreSQL не готове: ${error.message}`);
            return false;
        } finally {
            if (client) client.release();
        }
    }
}