import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUserCourse, PurchaseState } from '@purple-miroservices/interfaces';
import { Document } from 'mongoose';

@Schema()
export class UserCourse extends Document implements IUserCourse {
    @Prop()
    courseId: string;

    @Prop({required: true, enum: PurchaseState, type: String})
    purchaseState: PurchaseState;
}

export const UserCourseSchema = SchemaFactory.createForClass(UserCourse);
