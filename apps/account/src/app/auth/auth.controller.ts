import { AuthService } from './auth.service';
import { Controller, Logger } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@purple-miroservices/contracts';
import { Message, RMQMessage, RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @RMQRoute(AccountRegister.topic)
    @RMQValidate()
    async register(registerUserDto:  AccountRegister.Request, @RMQMessage msg: Message): Promise<AccountRegister.Response>{
        const requestId = msg.properties.headers['requestId'];
        const logger = new Logger(requestId) //TODO implement decorator to get id and create logger
        try {
            return this.authService.register(registerUserDto);
        } catch (error) {
            logger.error(error);
        }
        
    }

    @RMQRoute(AccountLogin.topic)
    @RMQValidate()
    async login({email, password}: AccountLogin.Request): Promise<AccountLogin.Response>{
        const {_id} = await this.authService.verifyUser(email, password);
        return this.authService.login(_id);
    }
}
