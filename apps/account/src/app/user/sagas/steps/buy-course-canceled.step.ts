import { PaymentStatus, PurchaseState } from "@purple-miroservices/interfaces";
import { UserEntity } from "../../entities/user.entity";
import { BuyCourseSagaState, PaymentLink } from "../buy-course.state";

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
    public async pay(): Promise<PaymentLink> {
        this.saga.setState(PurchaseState.Started, this.saga.courseId);
        return this.saga.getState().pay();
    }
    public async checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus; }> {
        throw new Error("You have already canceled course");
    }
    public async cancel(): Promise<{ user: UserEntity; }> {
        throw new Error("You have already canceled course");
    }

}