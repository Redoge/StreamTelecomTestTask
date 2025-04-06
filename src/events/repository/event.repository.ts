import {Injectable, Logger} from "@nestjs/common";
import {DatabaseService} from "../../database/database.service";
import {EventEntity} from "../entity/event.entity";

@Injectable()
export class EventRepository {
    private readonly logger = new Logger(EventRepository.name);

    constructor(private readonly databaseService: DatabaseService,) {
    }

    async create(event: EventEntity) {
        try {
            const query = `
                INSERT INTO call_events (event_type, channel, caller_id_num, connected_line_num,
                                         caller_id, recipient_id,
                                         unique_id, linked_id, cause, cause_txt, context, exten,
                                         channel_state, channel_state_desc, timestamp, raw_data)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            `;

            await this.databaseService.executeQuery(query, [
                event.eventType,
                event.channel,
                event.callerIdNum,
                event.connectedLineNum,
                event.callerId,
                event.recipientId,
                event.uniqueId,
                event.linkedId,
                event.cause,
                event.causeTxt,
                event.context,
                event.exten,
                event.channelState,
                event.channelStateDesc,
                event.timestamp,
                event.rawData
            ]);
        } catch (err) {
            this.logger.error(`Error saving call event: ${err}`);
        }
    }

    async findByUserCallerIdAndDateRange(userCallerId: string, startDate: Date, endDate: Date) {
        try {
            const query =
                `SELECT *
                 FROM call_events
                 WHERE (caller_id = $1 OR recipient_id = $1)
                   AND timestamp BETWEEN $2 AND $3;`

            return await this.databaseService.executeQuery(query, [userCallerId, startDate, endDate]);
        } catch (err) {
            this.logger.error(`Error fetching call events for user: ${err}`);
            throw err;
        }
    }

    async findAll(startDate: Date, endDate: Date) {
        console.log({startDate, endDate})
        try {
            const query =
                `SELECT *
                 FROM call_events
                 WHERE timestamp BETWEEN $1 AND $2;`

            return await this.databaseService.executeQuery(query, [startDate, endDate]);
        } catch (err) {
            this.logger.error(`Error fetching call events for user: ${err}`);
            throw err;
        }
    }

    async findCallsByUserAndDateRange(userCallerId: string, startDate: Date, endDate: Date) {
        try {
            const query = `SELECT DISTINCT ON (linked_id) *
                           FROM call_events
                           WHERE (caller_id = $1 OR recipient_id = $1)
                             AND timestamp BETWEEN $2 AND $3
                           ORDER BY linked_id, timestamp DESC;`;

            return await this.databaseService.executeQuery(query, [userCallerId, startDate, endDate]);
        } catch (err) {
            this.logger.error(`Error fetching unique call events: ${err}`);
            throw err;
        }
    }

}