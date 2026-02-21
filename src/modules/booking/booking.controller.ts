import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as bookingService from "./booking.service";
import { ApiError } from "../../utils/ApiError";
import { IBookingCreate, IBookingUpdate } from "./booking.interface";
import { Booking } from "./booking.model";
import { addOrUpdateDriverQuote } from "./booking.service";
import { User } from "../user/user.model";

// Create booking
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body as IBookingCreate;

    if (!data.userId) {
      throw new ApiError(400, "User ID is required");
    }

    // Map tripType
    const tripType = data.tripType || "one_way";

    const payload = {
      ...data,
      tripType,
      status: "pending",
      paymentStatus: "pending",
    };

    const created = await bookingService.createBooking(payload);

    const booking = await Booking.findById(created._id)
      .populate("userId", "name email phone role photoURL")
      .populate("driverId");

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const booking = await Booking.findById(id)
      .populate("userId", "name email phone role photoURL")
      .populate("driverId");

    if (!booking) throw new ApiError(404, "Booking not found");

    res.status(200).json({ success: true, data: booking });
  } catch (e) {
    next(e);
  }
};
export const list = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.query.userId as string | undefined;
    const driverId = req.query.driverId as string | undefined;
    const status = req.query.status as string | undefined;

    const filter: any = {};

    if (userId) filter.userId = new Types.ObjectId(userId);
    if (driverId) filter.driverId = new Types.ObjectId(driverId);
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("userId", "name email phone role photoURL")
      .populate("driverId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (e) {
    next(e);
  }
};
// get by user id
export const getBookingsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid userId");
    }

    const bookings = await bookingService.getBookingsByUserId(
      new Types.ObjectId(userId),
    );

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// by user id and driverQuote status pending

export const getUserBookingsWithPendingQuotes = async (
  userId: Types.ObjectId,
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const bookings = await Booking.find({
    userId,
    driverQuote: {
      $elemMatch: { status: "pending" },
    },
  })
    .populate("userId", "name email phone")
    .populate("driverQuote.driverId", "name phoneNumber vehicleDetails")
    .sort({ createdAt: -1 });

  return bookings;
};
export const listRejected = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const bookings = await Booking.find({ status: "rejected" })
      .populate("userId", "name email phone role photoURL")
      .populate("driverId")
      .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};
// get by user id, driverQuote status pending

export const listUserPendingQuoteBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const bookings = await getUserBookingsWithPendingQuotes(
      new Types.ObjectId(userId),
    );

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
export const listPending = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const bookings = await Booking.find({ status: "pending" })
      .populate("userId", "name email phone role photoURL")
      .populate("driverId")
      .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * Get all bookings by user email
 * GET /api/bookings/by-email?email=user@example.com
 */
export const getBookingsByUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      throw new ApiError(400, "Valid email is required");
    }

    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const bookings = await Booking.find({ userId: user._id })
      .populate("userId", "name email phone")
      .populate("driverId", "name phoneNumber vehicleDetails")
      .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// GET driverQuote array by driverId
export const getDriverQuotesByDriverId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const driverId = req.params.driverId;

    if (!Types.ObjectId.isValid(driverId)) {
      throw new ApiError(400, "Valid driverId is required");
    }

    const bookings = await Booking.find({
      "driverQuote.driverId": new Types.ObjectId(driverId),
    }).lean();

    const result = bookings.map((booking) => {
      const matchedQuotes = booking.driverQuote.filter(
        (q) => q.driverId.toString() === driverId,
      );
      return {
        bookingId: booking._id,
        driverQuotes: matchedQuotes,
      };
    });

    res.status(200).json({
      success: true,
      results: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// payment confirmed button will change this
export const confirmBookingWithDriver = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id, quoteId } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid bookingId");
    }

    if (!quoteId || Array.isArray(quoteId)) {
      throw new ApiError(400, "Invalid quoteId");
    }

    if (!Types.ObjectId.isValid(quoteId)) {
      throw new ApiError(400, "Invalid quoteId");
    }

    const bookingId = new Types.ObjectId(id);

    const updatedBooking = await bookingService.confirmSelectedDriverQuote(
      bookingId,
      quoteId,
    );

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Get driverQuote array by bookingId
 */
export const getDriverQuotesByBookingId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid bookingId");
    }

    const booking = await Booking.findById(id).lean();
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    res.status(200).json({
      success: true,
      data: booking.driverQuote || [],
    });
  } catch (error) {
    next(error);
  }
};
export const makePublic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = "public";
    await booking.save();

    const populatedBooking = await Booking.findById(id)
      .populate("userId", "name email phone role photoURL")
      .populate("driverId")
      .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails");

    return res.status(200).json({
      success: true,
      message: "Booking status updated to public",
      data: populatedBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const makeQuotedWithDriver = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { driverId, amount } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking ID" });
    }

    if (!driverId || !Types.ObjectId.isValid(driverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid driverId is required" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = "assigned";

    const quote = {
      _id: new Types.ObjectId(),
      driverId: new Types.ObjectId(driverId),
      amount: amount ?? 0,
      status: "pending",
      createdAt: new Date(),
    };
    booking.assignToDriver.push(quote);

    await booking.save();

    const populatedBooking = await Booking.findById(id)
      .populate("userId", "name email phone role photoURL")
      .populate("driverId")
      .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails");

    return res.status(200).json({
      success: true,
      message: "Booking status updated to quoted and driver added",
      data: populatedBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const makeRejected = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = "rejected";
    await booking.save();

    const populatedBooking = await Booking.findById(id)
      .populate("userId", "name email phone role photoURL")
      .populate("driverId");

    return res.status(200).json({
      success: true,
      message: "Booking status updated to rejected",
      data: populatedBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET all rejected bookings
export const getRejectedBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const bookings = await Booking.find({ status: "rejected" })
      .populate("userId", "name email phone role photoURL")
      .populate("driverId", "name phoneNumber status vehicleDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const data = req.body as IBookingUpdate;
    const booking = await bookingService.updateBooking(id, data);
    if (!booking) throw new ApiError(404, "Booking not found");
    res.status(200).json({ success: true, data: booking });
  } catch (e) {
    next(e);
  }
};

export const addQuote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const driverId = new Types.ObjectId(req.body.driverId);
    const amount = Number(req.body.amount);
    const booking = await bookingService.addDriverQuote(id, driverId, amount);
    if (!booking) throw new ApiError(404, "Booking not found");
    res.status(200).json({ success: true, data: booking });
  } catch (e) {
    next(e);
  }
};

export const rejectQuote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const { quoteId } = req.params;
    const booking = await bookingService.rejectQuote(id, quoteId);
    if (!booking) throw new ApiError(404, "Booking not found");
    res.status(200).json({ success: true, data: booking });
  } catch (e) {
    next(e);
  }
};

export const selectQuote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const { quoteId } = req.body;
    if (!quoteId) throw new ApiError(400, "quoteId is required");
    const booking = await bookingService.selectQuote(id, quoteId);
    if (!booking) throw new ApiError(404, "Booking not found");
    res.status(200).json({ success: true, data: booking });
  } catch (e) {
    next(e);
  }
};

// to get pending bookings for driver dashboard
export const listAvailableForDriver = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let driverId = req.query.driverId;
    if (Array.isArray(driverId)) driverId = driverId[0];
    if (
      !driverId ||
      typeof driverId !== "string" ||
      !Types.ObjectId.isValid(driverId)
    ) {
      throw new ApiError(400, "Valid driverId is required");
    }

    const driverObjectId = new Types.ObjectId(driverId);

    const bookings = await Booking.find({
      $or: [
        { status: "public" },
        {
          status: "assigned",
          assignToDriver: { $elemMatch: { driverId: driverObjectId } },
        },
      ],
    })
      .populate("userId", "name email phone")
      .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
// Driver Quote create and update
export const sendDriverQuote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { driverId, amount } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking id" });
    }

    if (!Types.ObjectId.isValid(driverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid driver id" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Amount must be a positive number" });
    }

    // Add or update the driver quote
    const updatedBooking = await addOrUpdateDriverQuote(
      new Types.ObjectId(id),
      new Types.ObjectId(driverId),
      amount,
    );

    res.status(200).json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

export const complete = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const booking = await bookingService.completeBooking(id);
    if (!booking) throw new ApiError(404, "Booking not found");
    res.status(200).json({ success: true, data: booking });
  } catch (e) {
    next(e);
  }
};

export const listCompleted = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const bookings = await Booking.find({ status: "completed" })
      .populate("userId", "name email phone")
      .populate("driverId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    return res
      .status(200)
      .json({ success: true, message: "Status updated", data: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const { otp } = req.body;
    if (!otp) throw new ApiError(400, "otp is required");
    const valid = await bookingService.verifyCompletionOtp(id, otp);
    if (!valid) throw new ApiError(400, "Invalid OTP");
    res.status(200).json({ success: true, message: "OTP verified" });
  } catch (e) {
    next(e);
  }
};

export const cancel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const cancellationReason = req.body.cancellationReason as
      | string
      | undefined;
    const booking = await bookingService.updateBooking(id, {
      status: "cancelled",
      cancellationReason,
    });
    if (!booking) throw new ApiError(404, "Booking not found");
    res.status(200).json({ success: true, data: booking });
  } catch (e) {
    next(e);
  }
};
