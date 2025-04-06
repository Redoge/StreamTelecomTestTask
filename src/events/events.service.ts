import {Injectable, Logger} from '@nestjs/common';
import {RabbitMqService} from '../rabbitmq/rabbitmq.service';
import {isQoSEvent} from "../common/predicates/predicates";
import {mapEventToDbModel} from "../common/mappers/mapper";
import {EventRepository} from "./repository/event.repository";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(
        private readonly eventRepository: EventRepository,
        private readonly rabbitMqService: RabbitMqService,
    ) {
        this.rabbitMqService.consume('call_events', (event) =>
            this.processEvent(event),
        );
    }

    async processEvent(event: any) {
        try {
            if (!event?.event) {
                this.logger.warn('Unsupported event format!');
                return;
            }

            this.logger.log(`Processing event: ${event.event}`);

            // Ігноруємо події QoS (метрики якості дзвінка)
            if (isQoSEvent(event)) return;
            const eventEntity = mapEventToDbModel(event)
            await this.eventRepository.create(eventEntity);
            this.logger.log('Call event processed and saved to DB');
        } catch (err) {
            this.logger.error(`Error processing event: ${err}`);
        }
    }

    async getEventsByDateRange(userCallerId?:string, startDateStr?: string, endDateStr?: string) {
        try {
            let startDate: Date;
            let endDate: Date;

            if(startDateStr)
                 startDate = new Date(new Date(startDateStr).setHours(0, 0, 0))
            else
                startDate = new Date('1970-01-01T00:00:00Z')

            if(endDateStr)
                endDate = new Date(new Date(endDateStr).setHours(23,59,59))
            else
                endDate = new Date('2038-01-18T23:59:59Z')

            if(userCallerId){
                return await this.eventRepository.findByUserCallerIdAndDateRange(userCallerId, startDate,endDate);
            }else{
                return await this.eventRepository.findAll(startDate, endDate)
            }
        } catch (err) {
            this.logger.error(`Error fetching events: ${err}`);
            throw err;
        }
    }
    async getCallsByUserCallerIdAndDateRange(userCallerId: string, startDateStr?: string, endDateStr?: string) {
        try{
            let startDate: Date;
            let endDate: Date;

            if(startDateStr)
                startDate = new Date(new Date(startDateStr).setHours(0, 0, 0))
            else
                startDate = new Date('1970-01-01T00:00:00Z')
            if(endDateStr)
                endDate = new Date(new Date(endDateStr).setHours(23,59,59))
            else
                endDate = new Date('2038-01-18T23:59:59Z')
            return await this.eventRepository.findCallsByUserAndDateRange(userCallerId, startDate, endDate);
        } catch (err){
            this.logger.error(`Error fetching calls: ${err}`);
            throw err;
        }
    }
}