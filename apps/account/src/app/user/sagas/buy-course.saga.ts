import { RMQService } from "nestjs-rmq";
import { UserEntity } from "../entities/user.entity";
import { PurchaseState } from "@purple-miroservices/interfaces";
import { BuyCourseSagaState } from "./buy-course.state";
import {
    BuyCourseSagaStateStarted,
    BuyCourseSagaStateWaitingForPayment,
    BuyCourseSagaStateCanceled,
    BuyCourseSagaStatePurchased
} from "./steps";

export class BuyCourseSaga {
    private state: BuyCourseSagaState;

    constructor(
        public user: UserEntity,
        public courseId: string,
        public rmqService: RMQService,
    ) { 
        this.setState(user.getCourseState(courseId), courseId);
    }

    public getState() {
        return this.state;
    }

    setState(state: PurchaseState, courseId: string) {
        switch (state) {
            case PurchaseState.Started:
                this.state = new BuyCourseSagaStateStarted();
                break;
            case PurchaseState.WaitingForPayment:
                this.state = new BuyCourseSagaStateWaitingForPayment();
                break;
            case PurchaseState.Purchased:
                this.state = new BuyCourseSagaStatePurchased();
                break;
            case PurchaseState.Canceled:
                this.state = new BuyCourseSagaStateCanceled();
                break;
        }
        this.state.setContext(this);
        this.user.setCourseState(courseId, state);
    }
}