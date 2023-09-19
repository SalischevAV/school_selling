import { UserEntity } from "../../entities/user.entity";
import { BuyCourseSagaState, PaymentLink } from "../buy-course.state";
import { PaymentCheck } from '@purple-miroservices/contracts';
import { PaymentStatus, PurchaseState } from "@purple-miroservices/interfaces";

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
    public async pay(): Promise<PaymentLink> {
        throw new Error("You have already started payment");
    }
    public async checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus; }> {
        const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(
            PaymentCheck.topic,
            {
                userId: this.saga.user._id,
                courseId: this.saga.courseId,
            }
        )
        if(status === 'canceled'){
            this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
            return { user: this.saga.user, status: PaymentStatus.canceled};
        }
        if(status === 'inProgress'){
            return { user: this.saga.user, status: PaymentStatus.inProgress};
        }
        if(status === 'success'){
            this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
            return { user: this.saga.user, status: PaymentStatus.success};
        }
    }
    public async cancel(): Promise<{ user: UserEntity; }> {
        throw new Error("You have already started payment");
    }

}