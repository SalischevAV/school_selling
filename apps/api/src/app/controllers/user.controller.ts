import { Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards';
import { CurrentUser } from '@purple-miroservices/decorators';
import { Cron } from '@nestjs/schedule';

@Controller('user')
export class UserController {
    constructor(){}

    @UseGuards(JWTAuthGuard)
    @Post('info')
    async info(@CurrentUser() id: string){
        return id;
    }

    @Cron('*/5 * * * * *')
    async cron(){
        Logger.log('Scheduled task')
    }
}
