import { UserService } from './user.service';
import { Body, Controller } from '@nestjs/common';
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@purple-miroservices/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class UserCommands {

    constructor(private readonly userService: UserService){}

    @RMQRoute(AccountChangeProfile.topic)
    @RMQValidate()
    async changeProfile(@Body() dto :  AccountChangeProfile.Request): Promise<AccountChangeProfile.Response>{
        this.userService.changeProfile(dto);
        return;
    }

    @RMQRoute(AccountBuyCourse.topic)
    @RMQValidate()
    async buyCourse(@Body() dto :  AccountBuyCourse.Request): Promise<AccountBuyCourse.Response>{
        return this.userService.buyCourse(dto);
    }

    @RMQRoute(AccountCheckPayment.topic)
    @RMQValidate()
    async checkPayment(@Body() dto :  AccountCheckPayment.Request): Promise<AccountCheckPayment.Response>{
       return this.userService.checkPayment(dto);
    }
}