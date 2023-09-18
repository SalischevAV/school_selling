import { IsString } from 'class-validator';
import { PaymentStatus } from 'libs/interfaces/src/lib/payment-status.enum';


export namespace PaymentCheck {
	export const topic = 'payment.check.query';

	export class Request {
		@IsString()
		courseId: string;

		@IsString()
		userId: string;
	}

	export class Response {
		status: PaymentStatus;
	}
}