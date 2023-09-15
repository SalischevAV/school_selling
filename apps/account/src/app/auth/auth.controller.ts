import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

export class RegisterUserDto {
    email: string;
    password: string;
    displayName?: string;
}

export class LoginUserDto {
    email: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto){
        return this.authService.register(registerUserDto)
    }

    @Post('login')
    async login(@Body() {email, password}: LoginUserDto){
        const {_id} = await this.authService.verifyUser(email, password);
        return this.authService.login(_id);
    }
}
