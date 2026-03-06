import { Schema, model } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    paymentMethod: {
      type: String,
      enum: [
        "bkash",
        "nagad",
        "rocket",
        "upay",
        "tap",
        "surecash",
        "visa",
        "mastercard",
        "amex",
        "unionpay",
        "dbbl_nexus",
        "maestro",
        "cash",
        "internet_banking",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ booking: 1, createdAt: -1 });

paymentSchema.pre("save", function (next) {
  if (this.status === "paid" && !this.paidAt) {
    this.paidAt = new Date();
  }
  next();
});

export const Payment = model<IPayment>("Payment", paymentSchema);
