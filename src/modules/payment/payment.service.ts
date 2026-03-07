// import mongoose from "mongoose";
// import crypto from "crypto";
// import { Payment } from "./payment.model";
// import { Booking } from "../booking/booking.model";

// const generateTransactionId = () => {
//   return "SAFAR-TXN-" + crypto.randomBytes(6).toString("hex").toUpperCase();
// };

// const initiatePayment = async (payload: {
//   bookingId: string;
//   amount: number;
//   paymentMethod: string;
// }) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const booking = await Booking.findById(payload.bookingId).session(session);

//     if (!booking) {
//       throw new Error("Booking not found");
//     }

//     if (booking.paymentStatus === "paid") {
//       const err: any = new Error("Booking already paid");
//       err.code = "ALREADY_PAID";
//       throw err;
//     }

//     const transactionId = generateTransactionId();

//     const payment = await Payment.create(
//       [
//         {
//           booking: booking._id,
//           transactionId,
//           amount: payload.amount,
//           paymentMethod: payload.paymentMethod,
//           status: "pending",
//         },
//       ],
//       { session },
//     );

//     // Simulate Payment Gateway
//     const isSuccess = Math.random() > 0.1;

//     if (isSuccess) {
//       payment[0].status = "paid";
//       payment[0].paidAt = new Date();
//       await payment[0].save({ session });

//       // Now TS knows booking.payment exists
//       booking.payment = payment[0]._id;
//       booking.status = "confirmed";
//       booking.paymentStatus = "paid";

//       await booking.save({ session });
//     } else {
//       payment[0].status = "failed";
//       await payment[0].save({ session });
//     }
//     await session.commitTransaction();
//     session.endSession();

//     return payment[0];
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

// export const PaymentService = {
//   initiatePayment,
// };

// import mongoose from "mongoose";
// import crypto from "crypto";
// import { Payment } from "./payment.model";
// import { Booking } from "../booking/booking.model";

// const generateTransactionId = () => {
//   return "SAFAR-TXN-" + crypto.randomBytes(6).toString("hex").toUpperCase();
// };

// const initiatePayment = async (payload: {
//   bookingId: string;
//   amount: number;
//   paymentMethod: string;
// }) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // 1️⃣ Lock the booking for update
//     const booking = await Booking.findOne({ _id: payload.bookingId }).session(
//       session,
//     );

//     if (!booking) throw new Error("Booking not found");

//     // 2️⃣ Check if already paid
//     if (booking.paymentStatus === "paid") {
//       const err: any = new Error("Booking already paid");
//       err.code = "ALREADY_PAID";
//       throw err;
//     }

//     // 3️⃣ Create a payment record
//     const transactionId = generateTransactionId();

//     const payment = await Payment.create(
//       [
//         {
//           booking: booking._id,
//           transactionId,
//           amount: payload.amount,
//           paymentMethod: payload.paymentMethod,
//           status: "pending",
//         },
//       ],
//       { session },
//     );

//     // 4️⃣ Simulate payment gateway
//     const isSuccess = Math.random() > 0.1;

//     if (isSuccess) {
//       payment[0].status = "paid";
//       await payment[0].save({ session });

//       booking.payment = payment[0]._id;
//       booking.paymentStatus = "paid"; // mark as paid
//       booking.status = "confirmed"; // confirm booking
//       await booking.save({ session });
//     } else {
//       payment[0].status = "failed";
//       await payment[0].save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return payment[0];
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

// export const PaymentService = { initiatePayment };
// import mongoose from "mongoose";
// import crypto from "crypto";
// import { Payment } from "./payment.model";
// import { Booking } from "../booking/booking.model";

// const generateTransactionId = () => {
//   return "SAFAR-TXN-" + crypto.randomBytes(6).toString("hex").toUpperCase();
// };

// const initiatePayment = async (payload: {
//   bookingId: string;
//   quoteId: string; // ✅ FIXED (added)
//   amount: number;
//   paymentMethod: string;
// }) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // 1️⃣ Lock the booking for update
//     const booking = await Booking.findOne({ _id: payload.bookingId }).session(
//       session,
//     );

//     if (!booking) throw new Error("Booking not found");

//     // 2️⃣ Check if already paid
//     if (booking.paymentStatus === "paid") {
//       const err: any = new Error("Booking already paid");
//       err.code = "ALREADY_PAID";
//       throw err;
//     }

//     // 3️⃣ Create a payment record
//     const transactionId = generateTransactionId();

//     const payment = await Payment.create(
//       [
//         {
//           booking: booking._id,
//           transactionId,
//           amount: payload.amount,
//           paymentMethod: payload.paymentMethod,
//           status: "pending",
//         },
//       ],
//       { session },
//     );

//     // 4️⃣ Simulate payment gateway
//     const isSuccess = Math.random() > 0.1;

//     if (isSuccess) {
//       payment[0].status = "paid";
//       await payment[0].save({ session });

//       // Find selected quote
//       const selectedQuote = booking.driverQuote.find(
//         (q: any) => q._id.toString() === payload.quoteId,
//       );

//       if (!selectedQuote) throw new Error("Quote not found");

//       // Assign driver & selectedQuote as ObjectId
//       booking.driverId = new mongoose.Types.ObjectId(selectedQuote.driverId);
//       booking.selectedQuoteId = new mongoose.Types.ObjectId(selectedQuote._id);

//       // Update quote statuses
//       booking.driverQuote.forEach((quote: any) => {
//         if (quote._id.toString() === payload.quoteId) quote.status = "accepted";
//         else quote.status = "rejected";
//       });

//       booking.payment = payment[0]._id;
//       booking.paymentStatus = "paid";
//       booking.status = "confirmed";

//       await booking.save({ session });
//     } else {
//       payment[0].status = "failed";
//       await payment[0].save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return payment[0];
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

// export const PaymentService = { initiatePayment };
import mongoose from "mongoose";
import crypto from "crypto";
import { Payment } from "./payment.model";
import { Booking } from "../booking/booking.model";
import { IPayment } from "./payment.interface";

const generateTransactionId = (): string => {
  return "SAFAR-TXN-" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

const initiatePayment = async (payload: {
  bookingId: string;
  quoteId: string; // selected quote id
  amount: number;
  paymentMethod: string;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Lock the booking
    const booking = await Booking.findById(payload.bookingId).session(session);
    if (!booking) throw new Error("Booking not found");

    // 2️⃣ Check if already paid
    if (booking.paymentStatus === "paid") {
      const err: any = new Error("Booking already paid");
      err.code = "ALREADY_PAID";
      throw err;
    }

    // 3️⃣ Create payment record
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

    // 4️⃣ Simulate payment gateway success/failure
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      payment[0].status = "paid";
      await payment[0].save({ session });

      // Find the selected quote
      const selectedQuote = booking.driverQuote.find(
        (q: any) => q._id?.toString() === payload.quoteId,
      );
      if (!selectedQuote || !selectedQuote.driverId)
        throw new Error("Quote not found or invalid driverId");

      // Assign driver and selectedQuote
      booking.driverId = selectedQuote.driverId;
      booking.selectedQuoteId = selectedQuote._id!; // ✅ non-null assertion

      // Update driverQuote statuses
      booking.driverQuote.forEach((quote: any) => {
        if (quote._id?.toString() === payload.quoteId)
          quote.status = "accepted";
        else quote.status = "rejected_by_user";
      });
      booking.markModified("driverQuote");

      // Add to assignToDriver array
      booking.assignToDriver.push({
        _id: new mongoose.Types.ObjectId(),
        driverId: selectedQuote.driverId,
        amount: selectedQuote.currentAmount,
        status: "accepted",
        createdAt: new Date(),
      });
      booking.markModified("assignToDriver");

      // Update booking payment and status
      booking.payment = payment[0]._id;
      booking.paymentStatus = "paid";
      booking.status = "confirmed";

      await booking.save({ session });
    } else {
      payment[0].status = "failed";
      await payment[0].save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return payment[0] as IPayment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Payment service error:", error);
    throw error;
  }
};

export const PaymentService = { initiatePayment };
