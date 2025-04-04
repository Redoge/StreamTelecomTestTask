import {forwardRef, Module} from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import {UserService} from "./user.service";
import {UserRepository} from "./repository/user.repository";
import {UserController} from "./controllers/user.controller";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [DatabaseModule, forwardRef(() => AuthModule)],
    providers: [UserService, UserRepository],
    exports:[UserService],
    controllers:[UserController]
})
export class UserModule {}