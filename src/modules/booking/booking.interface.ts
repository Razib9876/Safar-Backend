import { Document, Types } from "mongoose";

export type TripType = "one_way" | "round_trip";
export type VehicleType = "car" | "cng" | "hiace";

export type BookingStatus =
  | "draft"
  | "pending"
  | "assigned"
  | "quoted"
  | "payment_pending"
  | "confirmed"
  | "on_trip"
  | "completed"
  | "cancelled"
  | "public"
  | "assigned"
  | "rejected";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PickStatus = "pending" | "picked" | "dropped";

export type QuoteStatus = "pending" | "accepted" | "rejected_by_user";

export interface IDriverQuote {
  _id?: Types.ObjectId;
  driverId: Types.ObjectId;
  currentAmount: number;
  previousAmount?: number | string;
  status: QuoteStatus;
  rejectedAt?: Date;
  createdAt: Date;
}
export interface IAssignByAdmin {
  _id: Types.ObjectId;
  driverId: Types.ObjectId;
  amount: number;
  status: "pending" | "accepted" | "rejected_by_user";
  createdAt: Date;
  rejectedAt?: Date;
}

export interface IBooking {
  userId: Types.ObjectId;
  driverId?: Types.ObjectId;

  tripType: TripType;
  vehicleType: VehicleType;

  phoneNumber: string;

  fromLocation: string;
  toLocation: string;

  dateFrom: Date;
  dateTo?: Date;

  timeFrom: string;
  timeTo?: string;

  status: BookingStatus;
  paymentStatus: PaymentStatus;
  payment?: Types.ObjectId;

  totalAmount?: number;
  isPublic: boolean;

  assignToDriver: IAssignByAdmin[];
  driverQuote: IDriverQuote[];
  selectedQuoteId?: string;

  completionOtp?: string;
  completionOtpExpiresAt?: Date;

  pickStatus?: PickStatus;
  pickupTime?: Date;
  dropoffTime?: Date;

  cancellationReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingDoc extends IBooking, Document {
  _id: Types.ObjectId;
}

export interface IBookingCreate {
  userId: Types.ObjectId;
  tripType: TripType | "return";
  vehicleType: VehicleType;
  phoneNumber: string;
  fromLocation: string;
  toLocation: string;
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
  isPublic?: boolean;
}
