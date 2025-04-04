import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import {UserService} from "../user/user.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private usersService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('JWT токен не знайдено');
        }

        try {

            const user = await this.usersService.getByAuthToken(token);

            if (!user) {
                throw new UnauthorizedException('Користувача не знайдено');
            }

            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Невалідний JWT токен');
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}