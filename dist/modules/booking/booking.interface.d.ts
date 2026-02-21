import { Document, Types } from 'mongoose';
export type TripType = 'one_way' | 'round_trip';
export type VehicleType = 'car' | 'cng' | 'hiace';
export type BookingStatus = 'draft' | 'pending_quotes' | 'quoted' | 'payment_pending' | 'confirmed' | 'on_trip' | 'completed' | 'cancelled' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PickStatus = 'pending' | 'picked' | 'dropped';
export type QuoteStatus = 'pending' | 'accepted' | 'rejected_by_user';
export interface IDriverQuote {
    _id?: Types.ObjectId;
    driverId: Types.ObjectId;
    amount: number;
    status: QuoteStatus;
    rejectedAt?: Date;
    createdAt: Date;
}
export interface IBooking {
    userId: Types.ObjectId;
    driverId?: Types.ObjectId;
    tripType: TripType;
    vehicleType: VehicleType;
    phoneNumber: string;
    fromLocation: string | Record<string, unknown>;
    toLocation: string | Record<string, unknown>;
    dateFrom: Date;
    dateTo?: Date;
    timeFrom: string;
    timeTo?: string;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    totalAmount?: number;
    paymentMethod?: string;
    isPublic: boolean;
    driverQuotes: IDriverQuote[];
    selectedQuoteId?: string;
    completionOtp?: string;
    completionOtpExpiresAt?: Date;
    pickStatus?: PickStatus;
    pickupTime?: Date;
    dropoffTime?: Date;
    cancellationReason?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBookingDoc extends IBooking, Document {
    _id: Types.ObjectId;
}
export interface IBookingCreate {
    userId: Types.ObjectId;
    tripType: TripType;
    vehicleType: VehicleType;
    phoneNumber: string;
    fromLocation: string | Record<string, unknown>;
    toLocation: string | Record<string, unknown>;
    dateFrom: Date;
    dateTo?: Date;
    timeFrom: string;
    timeTo?: string;
    isPublic?: boolean;
}
export interface IBookingUpdate {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    driverId?: Types.ObjectId;
    totalAmount?: number;
    selectedQuoteId?: string;
    pickStatus?: PickStatus;
    pickupTime?: Date;
    dropoffTime?: Date;
    completionOtp?: string;
    completionOtpExpiresAt?: Date;
    cancellationReason?: string;
    notes?: string;
    isPublic?: boolean;
}
//# sourceMappingURL=booking.interface.d.ts.map