import {
    Injectable,
} from '@nestjs/common';
import {UserRepository} from './repository/user.repository';
import {User} from './entities/user.entity';
import {CreateUserDto} from './dto/create-user.dto';
import {UserCreationResultDto} from "./dto/user-creation-result.dto";


@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {
    }

    async create(creationData: CreateUserDto): Promise<UserCreationResultDto> {
        return this.userRepository.create(creationData);
    }

    async getByAuthToken(token: string): Promise<User> {
        return this.userRepository.getByAuthToken(token);
    }


}
