import { UnprocessableEntityException } from "@nestjs/common";
import { UserEntity } from "../../entities/user.entity";
import { BuyCourseSagaState, PaymentLink } from "../buy-course.state";
import { CourseGetCourse, PaymentGenerateLink } from '@purple-miroservices/contracts';
import { PaymentStatus, PurchaseState } from "@purple-miroservices/interfaces";

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
    public async pay(): Promise<PaymentLink>{
        const { course } = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
            id: this.saga.courseId
        });
        if(!course){
            throw new UnprocessableEntityException('Course does not exist');
        }
        if(course.price === 0){
            this.saga.setState(PurchaseState.Purchased, course._id);
            return {paymentLink: null, user: this.saga.user};
        }
        const {paymentLink} = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(
            PaymentGenerateLink.topic, {
                courseId: course._id,
                userId: this.saga.user._id,
                sum: course.price,
            }
        )
        this.saga.setState(PurchaseState.WaitingForPayment, course._id);
        return {paymentLink, user: this.saga.user};
    }
    public checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus; }> {
        throw new Error("You have not started payment");
    }
    public async cancel(): Promise<{ user: UserEntity; }> {
        this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
        return {user: this.saga.user};
    }
    
}