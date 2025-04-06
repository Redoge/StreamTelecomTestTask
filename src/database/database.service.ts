import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Pool, PoolClient} from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private readonly logger = new Logger(DatabaseService.name);
    pool: Pool;
    private readonly maxRetries = 30;
    private readonly retryDelay = 2000;

    constructor() {
        const dbConfig = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        };

        this.pool = new Pool(dbConfig);

        this.pool.on('error', (err: Error) => {
            this.logger.error(`Несподівана помилка пулу: ${err.message}`);
        });
    }

    async onModuleInit() {
        await this.connectWithRetry();
    }

    private async connectWithRetry(retries = 0): Promise<void> {
        try {
            const client = await this.pool.connect();
            client.release();
            this.logger.log(`Successfully connected to PostgreSQL with retry attempt ${retries + 1} of ${this.maxRetries}...`);
        } catch (err) {
            if (retries < this.maxRetries) {
                this.logger.warn(`Try to connect to PostgreSQL again... (${retries + 1}/${this.maxRetries}): ${err.message}`);

                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.connectWithRetry(retries + 1);
            }

            this.logger.error(`Cannot connect to PostgreSQL after ${this.maxRetries} attempts. Exiting...: ${err.message} `);
            throw err;
        }
    }

    async executeQuery(query: string, values: any[] = []) {
        if (!query) {
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
            this.logger.error(`Query execution failed with error: ${err.message}`);
            throw err;
        } finally {
            if (client) client.release();
        }
    }
}