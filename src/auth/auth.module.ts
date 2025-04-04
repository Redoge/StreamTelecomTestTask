import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {UserModule} from '../user/user.module';
import {JwtAuthGuard} from "./jwt.guard";

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || '',
            signOptions: {expiresIn: '30d'},
        }),
    ],
    providers: [JwtAuthGuard],
    exports: [JwtAuthGuard],
})
export class AuthModule {
}
