import { Invoice } from "./invoice";
import { MembershipPackage } from "./membership-package";

export type Payment = {
    paymentId: number;
    price: GLfloat;
    status: string;
    createdAt: string;
    paymentType: string;
    paymentMethod: string;
    accountId: number;
    membershipPackageId?: number;
    invoiceId?: number;
    invoice?: Invoice;
    membershipPackage?: MembershipPackage
}
