import { Controller, Get, Query, UseGuards,  Request } from '@nestjs/common';
import { EventsService } from './events.service';
import {JwtAuthGuard} from "../auth/jwt.guard";
import {DateRangeDto} from "../common/dto/daterange.dto";

@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
    ) {}

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getEventsByAuthUser(@Query() query: DateRangeDto, @Request() req: any) {
        const { startDate, endDate } = query;
        const uerCallerId: string = req.user.phoneNumber;
        return this.eventsService.getEventsByDateRange(uerCallerId, startDate, endDate);
    }

    @Get('/')
    async getAllEvents(@Query() query: DateRangeDto) {
        const { startDate, endDate } = query;
        return this.eventsService.getEventsByDateRange(startDate, endDate);
    }
}
