import { UserEventEmitter } from './user.event-emitter';
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from "@purple-miroservices/contracts";
import { UserEntity } from "./entities/user.entity";
import { RMQService } from "nestjs-rmq";
import { BuyCourseSaga } from "./sagas/buy-course.saga";

@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly rmqService: RMQService,
        private readonly userEventEmitter: UserEventEmitter,
        ){}

    async changeProfile({id, user} :  AccountChangeProfile.Request){
        const candidate = await this.userRepository.findById(id);
        const newUserEntity = new UserEntity(candidate).updateProfile({...user});
        await this.updateUser(newUserEntity);
        return;
    }

    async buyCourse({userId, courseId} :  AccountBuyCourse.Request): Promise<AccountBuyCourse.Response>{
        const buyer = await this.userRepository.findById(userId);
        const userEntity = new UserEntity(buyer);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
        const { user, paymentLink} = await saga.getState().pay();
        await this.updateUser(user);
        return { paymentLink };
    }

    async checkPayment({userId, courseId} :  AccountCheckPayment.Request): Promise<AccountCheckPayment.Response>{
        const buyer = await this.userRepository.findById(userId);
        const userEntity = new UserEntity(buyer);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
        const { user, status } = await saga.getState().checkPayment();
        await this.userRepository.findOneAndUpdate({_id: user._id}, user);
        return { status };
    }

    private updateUser(user: UserEntity){
        return Promise.all([
            this.userEventEmitter.handle(user),
            this.userRepository.findOneAndUpdate({_id: user._id}, user),
        ]);
    }

}