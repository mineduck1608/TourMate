export type Payment = {
    paymentId: number;
    price: GLfloat;
    status: string;
    completeDate: string;
    paymentType: string;
    paymentMethod: string;
    accountId: number;
    membershipId?: number;
    invoiceId?: number;
}
