import { Types } from 'mongoose';
import { IBookingCreate, IBookingUpdate, IBookingDoc, BookingStatus } from './booking.interface';
export declare const createBooking: (data: IBookingCreate) => Promise<IBookingDoc>;
export declare const findBookingById: (id: Types.ObjectId, populate?: boolean) => Promise<IBookingDoc | null>;
export declare const listBookings: (query: {
    userId?: Types.ObjectId;
    driverId?: Types.ObjectId;
    status?: BookingStatus;
}) => Promise<IBookingDoc[]>;
export declare const updateBooking: (id: Types.ObjectId, data: IBookingUpdate) => Promise<IBookingDoc | null>;
export declare const addDriverQuote: (bookingId: Types.ObjectId, driverId: Types.ObjectId, amount: number) => Promise<IBookingDoc | null>;
export declare const rejectQuote: (bookingId: Types.ObjectId, quoteId: string) => Promise<IBookingDoc | null>;
export declare const selectQuote: (bookingId: Types.ObjectId, quoteId: string) => Promise<IBookingDoc | null>;
export declare const completeBooking: (bookingId: Types.ObjectId) => Promise<IBookingDoc | null>;
export declare const verifyCompletionOtp: (bookingId: Types.ObjectId, otp: string) => Promise<boolean>;
//# sourceMappingURL=booking.service.d.ts.map