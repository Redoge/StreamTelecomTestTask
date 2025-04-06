import {Injectable, Logger, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {DatabaseService} from "../../database/database.service";
import {CreateUserDto} from "../dto/create-user.dto";
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {UserCreationResultDto} from "../dto/user-creation-result.dto";
import {mapUserToDto} from "../../common/mappers/mapper";

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);
    private readonly JWT_SECRET = process.env.JWT_SECRET|| '';

    constructor(private readonly databaseService: DatabaseService) {}

    async create(userCreationData: CreateUserDto) {
        try {
            // Start a transaction
            const client = await this.databaseService.pool.connect();

            try {
                // Begin transaction
                await client.query('BEGIN');

                // Insert user
                const userQuery = `INSERT INTO users (name, phone_number) 
                                  VALUES ($1, $2) 
                                  RETURNING id, name, phone_number`;

                const userResult = await client.query(userQuery, [
                    userCreationData.name,
                    userCreationData.phoneNumber,
                ]);

                const newUser = userResult.rows[0];

                const token = this.generateJwtToken(newUser.id);

                const tokenQuery = `INSERT INTO auth_tokens (user_id, token)
                                   VALUES ($1, $2)`;

                await client.query(tokenQuery, [
                    newUser.id,
                    token
                ]);

                // Commit transaction
                await client.query('COMMIT');

                let userCreationResult: UserCreationResultDto = {
                    id: newUser.id,
                    ...userCreationData,
                    token
                };
                return userCreationResult;
            } catch (err) {
                // Rollback in case of error
                await client.query('ROLLBACK');
                throw err;
            } finally {
                // Release client back to pool
                client.release();
            }
        } catch (err) {
            this.logger.error(`Error saving user: ${err}`);
            throw err;
        }
    }

    async findByUserAndDateRange(userCallerId: string, startDate: string, endDate: string) {
        try {
            const query = `SELECT * FROM call_events 
                          WHERE (caller_id = $1 OR recipient_id = $1) 
                          AND timestamp BETWEEN $2 AND $3`;

            return await this.databaseService.executeQuery(query, [userCallerId, startDate, endDate]);
        } catch (err) {
            this.logger.error(`Error fetching call events for user: ${err}`);
            throw err;
        }
    }

    async getByAuthToken(token: string) {
        try {
            // Check if the token exists in the database
            const query = `SELECT u.* 
                          FROM users u
                          JOIN auth_tokens a ON u.id = a.user_id
                          WHERE a.token = $1`;

            const result = await this.databaseService.executeQuery(query, [token]);

            if (!result || result.length === 0) {
                throw new UnauthorizedException('Token not found or invalid');
            }

            const  user = result[0];
            if(user){
                return mapUserToDto(user)
            }
            throw new NotFoundException("User not found");
        } catch (err) {
            this.logger.error(`Error finding user by token: ${err}`);
            throw err;
        }
    }

    private generateJwtToken(userId: string): string {
        // Create a payload with user ID and no expiration date for unlimited access
        const payload = {
            sub: userId,
            iat: Math.floor(Date.now() / 1000),
            jti: uuidv4()
        };

        // Sign the token with our secret
        return jwt.sign(payload, this.JWT_SECRET, {expiresIn: '1y'});
    }
}