import { PaymentStatus } from '@purple-miroservices/interfaces';
import { UserEntity } from './../entities/user.entity';
import { BuyCourseSaga } from "./buy-course.saga";
export interface PaymentLink {
    paymentLink: string;
    user: UserEntity;
}

export abstract class BuyCourseSagaState {
    public saga: BuyCourseSaga;

    public setContext(saga: BuyCourseSaga){
        this.saga = saga
    }

    public abstract pay(): Promise<PaymentLink> | PaymentLink;
    public abstract checkPayment(): Promise<{user: UserEntity, status: PaymentStatus}>
    public abstract cancel(): Promise<{user: UserEntity}>
}