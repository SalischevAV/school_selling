import { Body, Controller } from '@nestjs/common';
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@purple-miroservices/contracts';
import { RMQRoute, RMQValidate, RMQService } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { BuyCourseSaga } from './sagas/buy-course.saga';

@Controller()
export class UserCommands {

    constructor(
            private readonly userRepository: UserRepository,
            private readonly rMQService: RMQService,
        ){}

    @RMQRoute(AccountChangeProfile.topic)
    @RMQValidate()
    async userInfo(@Body() {id, user} :  AccountChangeProfile.Request): Promise<AccountChangeProfile.Response>{
        const userEntity = await this.userRepository.findById(id);
        const newUserEntity = new UserEntity(userEntity).updateProfile({...user});
        const {_id, ...rest } = newUserEntity;
        await this.userRepository.findOneAndUpdate({_id}, rest);
        return;
    }

    @RMQRoute(AccountBuyCourse.topic)
    @RMQValidate()
    async buyCourse(@Body() {userId, courseId} :  AccountBuyCourse.Request): Promise<AccountBuyCourse.Response>{
        const buyer = await this.userRepository.findById(userId);
        const userEntity = new UserEntity(buyer);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rMQService);
        const { user, paymentLink} = await saga.getState().pay();
        await this.userRepository.findOneAndUpdate({_id: user._id}, user);
        return { paymentLink };
    }

    @RMQRoute(AccountCheckPayment.topic)
    @RMQValidate()
    async checkPayment(@Body() {userId, courseId} :  AccountCheckPayment.Request): Promise<AccountCheckPayment.Response>{
        const buyer = await this.userRepository.findById(userId);
        const userEntity = new UserEntity(buyer);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rMQService);
        const { user, status } = await saga.getState().checkPayment();
        await this.userRepository.findOneAndUpdate({_id: user._id}, user);
        return { status };
    }
}