import { Types } from "mongoose";
import { Booking } from "./booking.model";
import {
  IBookingCreate,
  IBookingUpdate,
  IBookingDoc,
  IDriverQuote,
  BookingStatus,
} from "./booking.interface";
import { ApiError } from "../../utils/ApiError";

export const createBooking = async (
  data: IBookingCreate,
): Promise<IBookingDoc> => {
  const booking = await Booking.create({
    ...data,
    status: data.isPublic === false ? "pending" : "pending",
    paymentStatus: "pending",
    assignToDriver: [],
    isPublic: data.isPublic ?? true,
  });
  return booking;
};

export const findBookingById = async (
  id: Types.ObjectId,
  populate = true,
): Promise<IBookingDoc | null> => {
  const q = Booking.findById(id);
  if (populate) {
    q.populate("userId", "name email phone")
      .populate("driverId")
      .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails");
  }
  return q;
};
// get by user id
export const getBookingsByUserId = async (
  userId: Types.ObjectId,
): Promise<IBookingDoc[]> => {
  return Booking.find({ userId })
    .populate("userId", "name email")
    .populate("driverId", "name phoneNumber")
    .sort({ createdAt: -1 });
};
export const listBookings = async (query: {
  userId?: Types.ObjectId;
  driverId?: Types.ObjectId;
  status?: BookingStatus;
}): Promise<IBookingDoc[]> => {
  const filter: Record<string, unknown> = {};
  if (query.userId) filter.userId = query.userId;
  if (query.driverId) filter.driverId = query.driverId;
  if (query.status) filter.status = query.status;
  return Booking.find(filter)
    .populate("userId", "name email phone")
    .populate("driverId")
    .sort({ createdAt: -1 });
};

export const updateBooking = async (
  id: Types.ObjectId,
  data: IBookingUpdate,
): Promise<IBookingDoc | null> => {
  return Booking.findByIdAndUpdate(id, { $set: data }, { new: true })
    .populate("userId", "name email phone")
    .populate("driverId")
    .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails");
};

// payment conrfirm button will do this
export const confirmSelectedDriverQuote = async (
  bookingId: Types.ObjectId,
  quoteId: string,
): Promise<IBookingDoc | null> => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const selectedQuote = booking.driverQuote.find(
    (q) => q._id?.toString() === quoteId,
  );

  if (!selectedQuote) {
    throw new ApiError(404, "Selected driver quote not found");
  }

  if (selectedQuote.status !== "pending") {
    throw new ApiError(400, "Quote is not pending");
  }

  booking.driverQuote.forEach((quote: any) => {
    if (quote._id.toString() === quoteId) {
      quote.status = "confirmed";
    } else if (quote.status === "pending") {
      quote.status = "rejected";
    }
  });

  booking.status = "confirmed";
  booking.paymentStatus = "paid";
  booking.driverId = selectedQuote.driverId as Types.ObjectId;

  await booking.save();

  return Booking.findById(bookingId)
    .populate("userId", "name email phone")
    .populate("driverId", "name phoneNumber vehicleDetails")
    .populate("driverQuote.driverId", "name phoneNumber vehicleDetails");
};

// driverQuote add and update
export const addOrUpdateDriverQuote = async (
  bookingId: Types.ObjectId,
  driverId: Types.ObjectId,
  amount: number,
) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if driver already has a quote
  const existingQuote = booking.driverQuote.find(
    (q) => q.driverId.toString() === driverId.toString(),
  );

  if (existingQuote) {
    existingQuote.previousAmount = existingQuote.currentAmount;
    existingQuote.currentAmount = amount;
    existingQuote.status = "pending";
  } else {
    booking.driverQuote.push({
      _id: new Types.ObjectId(),
      driverId,
      currentAmount: amount,
      previousAmount: 0,
      status: "pending",
      createdAt: new Date(),
    });
  }

  await booking.save();

  // Return updated booking with populated driver info
  return Booking.findById(bookingId).populate(
    "driverQuote.driverId",
    "name phoneNumber vehicleDetails",
  );
};

export const addDriverQuote = async (
  bookingId: Types.ObjectId,
  driverId: Types.ObjectId,
  amount: number,
): Promise<IBookingDoc | null> => {
  const booking = await Booking.findById(bookingId);
  if (!booking) return null;

  if (booking.status !== "pending" && booking.status !== "quoted") {
    throw new ApiError(400, "Booking not accepting quotes");
  }

  const quote: IDriverQuote = {
    _id: new Types.ObjectId(),
    driverId,
    currentAmount: amount,
    previousAmount: 0,
    status: "pending",
    createdAt: new Date(),
  };

  booking.driverQuote.push(quote); // ✅ FIXED

  booking.status = "quoted";

  await booking.save();

  return findBookingById(bookingId);
};

export const rejectQuote = async (
  bookingId: Types.ObjectId,
  quoteId: string,
): Promise<IBookingDoc | null> => {
  const booking = await Booking.findById(bookingId);
  if (!booking) return null;
  const quote = booking.assignToDriver.find(
    (q) => q._id?.toString() === quoteId,
  );
  if (!quote) throw new ApiError(404, "Quote not found");
  quote.status = "rejected_by_user";
  quote.rejectedAt = new Date();
  await booking.save();
  return findBookingById(bookingId);
};

export const selectQuote = async (
  bookingId: Types.ObjectId,
  quoteId: string,
  amount: number,
): Promise<IBookingDoc | null> => {
  const booking = await Booking.findById(bookingId);
  if (!booking) return null;
  const quote = booking.assignToDriver.find(
    (q) => q._id?.toString() === quoteId,
  );

  if (!quote) throw new ApiError(404, "Quote not found");
  if (quote.status !== "pending")
    throw new ApiError(400, "Quote not available");
  booking.driverId = quote.driverId as Types.ObjectId;
  booking.selectedQuoteId = quoteId;
  booking.totalAmount = quote.amount;
  booking.status = "payment_pending";
  quote.status = "accepted";
  await booking.save();
  return findBookingById(bookingId);
};

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const completeBooking = async (
  bookingId: Types.ObjectId,
): Promise<IBookingDoc | null> => {
  const otp = generateOtp();
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        status: "completed",
        completionOtp: otp,
        completionOtpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    },
    { new: true },
  )
    .populate("userId", "name email phone")
    .populate("driverId");
  return booking;
};

export const verifyCompletionOtp = async (
  bookingId: Types.ObjectId,
  otp: string,
): Promise<boolean> => {
  const booking = await Booking.findById(bookingId);
  if (!booking || !booking.completionOtp) return false;
  if (booking.completionOtp !== otp) return false;
  return true;
};
