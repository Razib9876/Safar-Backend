import mongoose from "mongoose";
import crypto from "crypto";
import { Payment } from "./payment.model";
import { Booking } from "../booking/booking.model";

const generateTransactionId = () => {
  return "SAFAR-TXN-" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

const initiatePayment = async (payload: {
  bookingId: string;
  amount: number;
  paymentMethod: string;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(payload.bookingId).session(session);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.paymentStatus === "paid") {
      const err: any = new Error("Booking already paid");
      err.code = "ALREADY_PAID";
      throw err;
    }

    const transactionId = generateTransactionId();

    const payment = await Payment.create(
      [
        {
          booking: booking._id,
          transactionId,
          amount: payload.amount,
          paymentMethod: payload.paymentMethod,
          status: "pending",
        },
      ],
      { session },
    );

    // Simulate Payment Gateway
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      payment[0].status = "paid";
      payment[0].paidAt = new Date();
      await payment[0].save({ session });

      // Now TS knows booking.payment exists
      booking.payment = payment[0]._id;
      booking.status = "confirmed";
      booking.paymentStatus = "paid";

      await booking.save({ session });
    } else {
      payment[0].status = "failed";
      await payment[0].save({ session });
    }
    await session.commitTransaction();
    session.endSession();

    return payment[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  initiatePayment,
};
