import { UserRepository } from './repositories/user.repository';
import { Body, Controller } from '@nestjs/common';
import { AccountUserCourses, AccountUserInfo } from '@purple-miroservices/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserQueries {

    constructor( private readonly userRepository: UserRepository){}

    @RMQRoute(AccountUserInfo.topic)
    @RMQValidate()
    async userInfo(@Body() { id }:  AccountUserInfo.Request): Promise<AccountUserInfo.Response>{
        const user = await this.userRepository.findById(id);
        return {
            user: new UserEntity(user).getUserPublicProfile()
        }
    }

    @RMQRoute(AccountUserCourses.topic)
    @RMQValidate()
    async userCourses(@Body() { id }:  AccountUserCourses.Request): Promise<AccountUserCourses.Response>{
        const user = await this.userRepository.findById(id);
        return { courses: user.courses };
    }
}