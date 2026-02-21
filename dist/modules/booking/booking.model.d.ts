import mongoose from 'mongoose';
import { IBookingDoc } from './booking.interface';
export declare const Booking: mongoose.Model<IBookingDoc, {}, {}, {}, mongoose.Document<unknown, {}, IBookingDoc, {}, {}> & IBookingDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=booking.model.d.ts.map