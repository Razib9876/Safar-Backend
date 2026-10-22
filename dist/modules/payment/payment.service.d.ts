import mongoose from "mongoose";
export declare const PaymentService: {
    initiatePayment: (payload: {
        bookingId: string;
        amount: number;
        paymentMethod: string;
        driverId: string;
    }) => Promise<mongoose.Document<unknown, {}, import("./payment.interface").IPayment, {}, {}> & import("./payment.interface").IPayment & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
};
//# sourceMappingURL=payment.service.d.ts.map