
import { Body, Controller, Post, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@purple-miroservices/contracts';
import { RMQService } from 'nestjs-rmq';
import { LoginDto, RegisterDto } from '../dtos';

@Controller('auth')
export class AuthController {
    constructor(private readonly rmqService: RMQService) { }

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() loginUserDto: RegisterDto) {
        try {
            return await this.rmqService.send<AccountRegister.Request, AccountRegister.Response>(
                AccountRegister.topic,
                loginUserDto,
                {
                    headers: {
                        requestId: 'qwe', //TODO implement autogenerate, implement wrapper
                    }
                }
            )
        } catch (error) {
            if (error instanceof Error){
                throw new UnauthorizedException(error.message);
            }
        }
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() loginUserDto: LoginDto) {
        try {
            return await this.rmqService.send<AccountLogin.Request, AccountLogin.Response>(AccountLogin.topic, loginUserDto)
        } catch (error) {
            if (error instanceof Error){
                throw new UnauthorizedException(error.message);
            }
        }
    }
}
