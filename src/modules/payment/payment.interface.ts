import { Types } from "mongoose";

export type TPaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type TPaymentMethod =
  | "bkash"
  | "nagad"
  | "rocket"
  | "upay"
  | "tap"
  | "surecash"
  | "visa"
  | "mastercard"
  | "amex"
  | "unionpay"
  | "dbbl_nexus"
  | "maestro"
  | "cash"
  | "internet_banking";

export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentMethod: TPaymentMethod;
  status: TPaymentStatus;
  paidAt?: Date;
}
