import { Schema, model } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking reference is required"],
      index: true,
    },

    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
      trim: true,
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [1, "Amount must be greater than 0"],
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
      required: [true, "Payment method is required"],
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
  {
    timestamps: true,
  },
);

/**

 * Fast lookup for booking payment history
 */
paymentSchema.index({ booking: 1, createdAt: -1 });

/**

 * Ensure paidAt is set automatically when status becomes paid
 */
paymentSchema.pre("save", function (next) {
  if (this.status === "paid" && !this.paidAt) {
    this.paidAt = new Date();
  }
  next();
});

export const Payment = model<IPayment>("Payment", paymentSchema);
