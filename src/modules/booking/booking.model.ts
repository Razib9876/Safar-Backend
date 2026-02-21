import mongoose, { Schema } from "mongoose";
import { IBookingDoc, IDriverQuote, IAssignByAdmin } from "./booking.interface";

/* ================= DRIVER QUOTE SCHEMA ================= */

const assignToDriverSchema = new Schema<IAssignByAdmin>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected_by_user"],
      default: "pending",
    },
    rejectedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);
const driverQuoteSchema = new Schema<IDriverQuote>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
    currentAmount: { type: Number, required: true },
    previousAmount: { type: Number, default: "0" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
    rejectedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

/* ================= BOOKING SCHEMA ================= */

const bookingSchema = new Schema<IBookingDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    tripType: {
      type: String,
      enum: ["one_way", "round_trip"],
      default: "one_way",
      required: true,
    },

    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "cng", "hiace"],
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    fromLocation: { type: String, required: true },
    toLocation: { type: String, required: true },

    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, default: null },

    timeFrom: { type: String, required: true },
    timeTo: { type: String, default: null },

    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "public",
        "assigned",
        "quoted",
        "payment_pending",
        "confirmed",
        "on_trip",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    totalAmount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },

    assignToDriver: { type: [assignToDriverSchema], default: [] },
    driverQuote: { type: [driverQuoteSchema], default: [] },

    selectedQuoteId: {
      type: Schema.Types.ObjectId,
      default: null,
    },

    completionOtp: { type: String, default: null },
    completionOtpExpiresAt: { type: Date, default: null },

    pickStatus: {
      type: String,
      enum: ["pending", "picked", "dropped"],
      default: "pending",
    },

    pickupTime: { type: Date, default: null },
    dropoffTime: { type: Date, default: null },

    cancellationReason: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

export const Booking = mongoose.model<IBookingDoc>("Booking", bookingSchema);
