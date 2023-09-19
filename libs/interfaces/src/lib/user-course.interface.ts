export enum PurchaseState {
    Started = 'Started',
    WaitingForPayment = 'WaitingForPayment',
    Purchased = 'Purchased',
    Canceled = 'Canceled',
}

export interface IUserCourse {
    courseId: string;
    purchaseState: PurchaseState;
}
