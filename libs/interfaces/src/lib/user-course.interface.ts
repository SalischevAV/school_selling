export enum PurchaseState {
    Started = 'Started',
    WaitingForPayment = 'WaitingForPayment',
    Purchased = 'Purchased',
    Canceled = 'Canceled',
}

export interface IUserCourse {
    _id?: string;
    courseId: string;
    purchaseState: PurchaseState;
}
