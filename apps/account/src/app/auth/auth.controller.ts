import { AuthService } from './auth.service';
import { Body, Controller } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@purple-miroservices/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @RMQRoute(AccountRegister.topic)
    @RMQValidate()
    async register(@Body() registerUserDto:  AccountRegister.Request): Promise<AccountRegister.Response>{
        return this.authService.register(registerUserDto)
    }

    @RMQRoute(AccountLogin.topic)
    @RMQValidate()
    async login(@Body() {email, password}: AccountLogin.Request): Promise<AccountLogin.Response>{
        const {_id} = await this.authService.verifyUser(email, password);
        return this.authService.login(_id);
    }
}
