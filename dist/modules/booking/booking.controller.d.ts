import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
export declare const create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const dropOffBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyCompletionOtp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBookingsByUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserBookingsWithPendingQuotes: (userId: Types.ObjectId) => Promise<(import("mongoose").Document<unknown, {}, import("./booking.interface").IBookingDoc, {}, {}> & import("./booking.interface").IBookingDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const listRejected: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listUserPendingQuoteBookings: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const listPending: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get all bookings by user email
 * GET /api/bookings/by-email?email=user@example.com
 */
export declare const getBookingsByUserEmail: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDriverQuotesByDriverId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const confirmBookingWithDriver: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get driverQuote array by bookingId
 */
export declare const getDriverQuotesByBookingId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const makePublic: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
export declare const makeQuotedWithDriver: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
export declare const makeRejected: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
export declare const getRejectedBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addQuote: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const rejectQuote: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const selectQuote: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listAvailableForDriver: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const sendDriverQuote: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const complete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listCompleted: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBookingStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
export declare const getDriverConfirmedBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyOtp: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDriverCompletedBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cancel: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=booking.controller.d.ts.map