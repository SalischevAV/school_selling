import { PaymentStatus, PurchaseState } from '@purple-miroservices/interfaces';
import { IsString } from 'class-validator';

export namespace AccountCheckPayment {
	export const topic = 'account.check-payment.query';

	export class Request {
        @IsString()
		userId: string;

		@IsString()
		courseId: string;
	}

	export class Response{
        status: PaymentStatus;
    }
}