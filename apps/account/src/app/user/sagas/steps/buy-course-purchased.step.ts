import { PaymentStatus } from "@purple-miroservices/interfaces";
import { UserEntity } from "../../entities/user.entity";
import { BuyCourseSagaState, PaymentLink } from "../buy-course.state";

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
    public async pay(): Promise<PaymentLink> {
        throw new Error("You have already purchased course");
    }
    public async checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus; }> {
        throw new Error("You have already purchased course");
    }
    public async cancel(): Promise<{ user: UserEntity; }> {
        throw new Error("You have already purchased course");
    }

}