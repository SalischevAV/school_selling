import { Controller, Post, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards';
import { CurrentUser } from '@purple-miroservices/decorators';

@Controller('user')
export class UserController {
    constructor(){}

    @UseGuards(JWTAuthGuard)
    @Post('info')
    async info(@CurrentUser() id: string){
        return id;
    }
}
