import {Controller, Get,  UseGuards,  Request, Post, Body} from '@nestjs/common';
import {UserService} from "../user.service";
import {CreateUserDto} from "../dto/create-user.dto";
import {JwtAuthGuard} from "../../auth/jwt.guard";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post()
    async create(@Body() userCreationData: CreateUserDto) {
        return this.userService.create(userCreationData);
    }
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Request() req: any) {
        return req.user;
    }
}
