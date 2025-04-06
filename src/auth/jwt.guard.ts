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
            throw new UnauthorizedException('JWT not found!');
        }

        try {

            const user = await this.usersService.getByAuthToken(token);

            if (!user) {
                throw new UnauthorizedException('User not found!');
            }

            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid JWT or user not found!');
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}