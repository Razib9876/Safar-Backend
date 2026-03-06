import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as bookingService from "./booking.service";
import { ApiError } from "../../utils/ApiError";
import { IBookingCreate, IBookingUpdate } from "./booking.interface";
import { Booking } from "./booking.model";
import { addOrUpdateDriverQuote } from "./booking.service";
import { User } from "../user/user.model";
import { IAssignByAdmin } from "./booking.interface";
import { Driver } from "../driver/driver.model";

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
    let idParam = req.params.id;
    if (Array.isArray(idParam)) {
      idParam = idParam[0]; // take the first one if array
    }

    const id = new Types.ObjectId(idParam);

    const booking = await Booking.findById(id)
      .populate("userId", "name email phone role photoURL")
      .populate("driverId");

    if (!booking) throw new ApiError(404, "Booking not found");

    res.status(200).json({ success: true, data: booking });
  } catch (e) {
    next(e);
  }
};
// export const list = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const userId = req.query.userId as string | undefined;
//     const driverId = req.query.driverId as string | undefined;
//     const status = req.query.status as string | undefined;

//     const filter: any = {};

//     if (userId) filter.userId = new Types.ObjectId(userId);
//     if (driverId) filter.driverId = new Types.ObjectId(driverId);
//     if (status) filter.status = status;

//     const bookings = await Booking.find(filter)
//       .populate("userId", "name email phone role photoURL")
//       .populate("driverId")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: bookings });
//   } catch (e) {
//     next(e);
//   }
// };

// Cancel booking
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    booking.status = "cancelled";
    booking.cancellationReason = "User cancelled";
    await booking.save();

    return res
      .status(200)
      .json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error from booking controller",
    });
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
      .populate({
        path: "driverQuote.driverId",
        model: "Driver",
        select: "name phoneNumber photo vehicleDetails",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (e) {
    next(e);
  }
};
// PATCH /bookings/:bookingId/drop-off

// PATCH /bookings/:bookingId/drop-off
export const dropOffBooking = async (req: Request, res: Response) => {
  try {
    let { bookingId } = req.params;

    // Ensure it's a string
    if (Array.isArray(bookingId)) bookingId = bookingId[0];

    // Validate ObjectId
    if (!Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, "Invalid bookingId");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Update booking
    booking.pickStatus = "dropped";
    booking.status = "completed"; // use correct enum/type

    // Generate a new OTP for completion (4-digit random)
    booking.completionOtp = Math.floor(1000 + Math.random() * 9000).toString();

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking dropped off successfully",
      data: {
        bookingId: booking._id,
        pickStatus: booking.pickStatus,
        status: booking.status,
        completionOtp: booking.completionOtp,
      },
    });
  } catch (error: any) {
    console.error("DROP OFF ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// PATCH /bookings/:bookingId/verify-completion-otp

// export const verifyCompletionOtp = async (req: Request, res: Response) => {
//   try {
//     const { bookingId } = req.params;
//     let { otp, driverId } = req.body;

//     // Convert driverId from array if frontend sends multiple values
//     const driverIdStr = Array.isArray(driverId) ? driverId[0] : driverId;

//     // Validate required fields
//     if (!otp || !driverIdStr) {
//       throw new ApiError(400, "OTP and driverId are required");
//     }

//     // Validate ObjectIds
//     const bookingIdStr = Array.isArray(bookingId) ? bookingId[0] : bookingId;
//     if (!Types.ObjectId.isValid(bookingIdStr)) {
//       throw new ApiError(400, "Invalid bookingId");
//     }
//     if (!Types.ObjectId.isValid(driverIdStr)) {
//       throw new ApiError(400, "Invalid driverId");
//     }

//     // Fetch booking
//     const booking = await Booking.findById(bookingIdStr);
//     if (!booking) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Booking not found" });
//     }

//     // Validate OTP
//     if (!booking.completionOtp || booking.completionOtp !== otp) {
//       return res.status(400).json({ success: false, message: "OTP mismatch" });
//     }

//     // Find the driver quote for this driver
//     const driverQuote = booking.driverQuote.find(
//       (q) => q.driverId.toString() === driverIdStr,
//     );
//     if (!driverQuote) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Driver quote not found" });
//     }

//     // Fetch driver and update earnings + status
//     const driver = await Driver.findById(driverIdStr);
//     if (!driver) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Driver not found" });
//     }

//     driver.totalEarnings =
//       (driver.totalEarnings || 0) + driverQuote.currentAmount;
//     driver.status = "available";
//     await driver.save();

//     // Update booking status
//     booking.status = "completed"; // mark as completed
//     booking.pickStatus = "dropped"; // ensure pickStatus is dropped
//     booking.completionOtp = undefined; // invalidate OTP
//     booking.completionOtpExpiresAt = undefined;
//     await booking.save();

//     // Respond success
//     return res.status(200).json({
//       success: true,
//       message: "Booking completed successfully and driver earnings updated",
//       data: {
//         bookingId: booking._id,
//         driverId: driver._id,
//         driverTotalEarnings: driver.totalEarnings,
//         bookingStatus: booking.status,
//         pickStatus: booking.pickStatus,
//       },
//     });
//   } catch (error: any) {
//     console.error("VERIFY COMPLETION OTP ERROR:", error);
//     return res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };

export const verifyCompletionOtp = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { otp } = req.body;

    if (!otp) {
      throw new ApiError(400, "OTP is required");
    }

    const bookingIdStr = Array.isArray(bookingId) ? bookingId[0] : bookingId;

    if (!Types.ObjectId.isValid(bookingIdStr)) {
      throw new ApiError(400, "Invalid bookingId");
    }

    const booking = await Booking.findById(bookingIdStr);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Validate OTP
    if (!booking.driverId) {
      return res.status(400).json({
        success: false,
        message: "Driver not assigned to this booking",
      });
    }

    const driverIdStr = booking.driverId.toString();

    // Find driver quote
    const driverQuote = booking.driverQuote.find(
      (q) => q.driverId.toString() === driverIdStr,
    );

    if (!driverQuote) {
      return res.status(404).json({
        success: false,
        message: "Driver quote not found",
      });
    }

    const driver = await Driver.findById(driverIdStr);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    driver.totalEarnings =
      (driver.totalEarnings || 0) + driverQuote.currentAmount;

    driver.status = "available";
    await driver.save();

    booking.status = "completed";
    booking.pickStatus = "dropped";
    booking.completionOtp = undefined;
    booking.completionOtpExpiresAt = undefined;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking completed successfully",
      data: {
        bookingId: booking._id,
        driverId: driver._id,
        driverTotalEarnings: driver.totalEarnings,
        bookingStatus: booking.status,
      },
    });
  } catch (error: any) {
    console.error("VERIFY COMPLETION OTP ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
// get by user id
export const getBookingsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let { userId } = req.params;

    // If userId is an array (e.g., from query param), take the first one
    if (Array.isArray(userId)) {
      userId = userId[0];
    }

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
    let { userId } = req.params;

    // Ensure userId is a string
    if (Array.isArray(userId)) {
      userId = userId[0];
    }

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
    let { driverId } = req.params;

    // Normalize driverId to string in case it comes as an array
    if (Array.isArray(driverId)) {
      driverId = driverId[0];
    }

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
    let { id, quoteId } = req.params;

    // Normalize params if they are arrays
    if (Array.isArray(id)) id = id[0];
    if (Array.isArray(quoteId)) quoteId = quoteId[0];

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid bookingId");
    }

    if (!quoteId || !Types.ObjectId.isValid(quoteId)) {
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
// export const getDriverQuotesByBookingId = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     let { id } = req.params;

//     // Normalize in case id comes as an array
//     if (Array.isArray(id)) id = id[0];

//     if (!Types.ObjectId.isValid(id)) {
//       throw new ApiError(400, "Invalid bookingId");
//     }

//     const booking = await Booking.findById(id).lean();
//     if (!booking) {
//       throw new ApiError(404, "Booking not found");
//     }

//     res.status(200).json({
//       success: true,
//       data: booking.driverQuote || [],
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getDriverQuotesByBookingId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let { id } = req.params;

    if (Array.isArray(id)) id = id[0];

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid bookingId");
    }

    const booking = await Booking.findById(id)
      .populate({
        path: "driverQuote.driverId",
        model: "Driver",
        select: "name phoneNumber profileImage vehicleDetails",
      })
      .lean();

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
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0];

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

    // Ensure "public" exists in BookingStatus type
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
    let { id } = req.params;
    const { driverId, amount } = req.body;

    if (Array.isArray(id)) id = id[0]; // fix string | string[] issue

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

    // make sure "assigned" exists in BookingStatus type
    booking.status = "assigned";

    const quote: IAssignByAdmin = {
      _id: new Types.ObjectId(),
      driverId: new Types.ObjectId(driverId),
      amount: amount ?? 0, // make sure IAssignByAdmin has amount
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
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!Types.ObjectId.isValid(idParam)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(idParam);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = "rejected";
    await booking.save();

    const populatedBooking = await Booking.findById(idParam)
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
    // Ensure id is a string
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!Types.ObjectId.isValid(idParam)) {
      throw new ApiError(400, "Invalid booking ID");
    }

    const id = new Types.ObjectId(idParam);
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
    // Ensure id and driverId are strings
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const driverIdParam = Array.isArray(req.body.driverId)
      ? req.body.driverId[0]
      : req.body.driverId;

    if (!Types.ObjectId.isValid(idParam)) {
      throw new ApiError(400, "Invalid booking ID");
    }

    if (!Types.ObjectId.isValid(driverIdParam)) {
      throw new ApiError(400, "Invalid driver ID");
    }

    const id = new Types.ObjectId(idParam);
    const driverId = new Types.ObjectId(driverIdParam);
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
    // Ensure params are strings
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const quoteIdParam = Array.isArray(req.params.quoteId)
      ? req.params.quoteId[0]
      : req.params.quoteId;

    if (!Types.ObjectId.isValid(idParam)) {
      throw new ApiError(400, "Invalid booking ID");
    }

    if (!quoteIdParam) {
      throw new ApiError(400, "Invalid quote ID");
    }

    const id = new Types.ObjectId(idParam);

    const booking = await bookingService.rejectQuote(id, quoteIdParam);
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
    // Ensure params are strings
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const { quoteId, amount } = req.body;

    if (!Types.ObjectId.isValid(idParam)) {
      throw new ApiError(400, "Invalid booking ID");
    }

    if (!quoteId || Array.isArray(quoteId)) {
      throw new ApiError(400, "Invalid quoteId");
    }

    if (amount === undefined || isNaN(Number(amount))) {
      throw new ApiError(400, "Amount is required and must be a number");
    }

    const bookingId = new Types.ObjectId(idParam);

    // Pass all 3 arguments to the service
    const booking = await bookingService.selectQuote(
      bookingId,
      quoteId,
      Number(amount),
    );

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
    // Ensure id is a single string
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    // Ensure driverId is a single string
    const driverIdParam = Array.isArray(req.body.driverId)
      ? req.body.driverId[0]
      : req.body.driverId;

    const { amount } = req.body;

    if (!Types.ObjectId.isValid(idParam)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking id" });
    }

    if (!Types.ObjectId.isValid(driverIdParam)) {
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
      new Types.ObjectId(idParam),
      new Types.ObjectId(driverIdParam),
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
    // Ensure we have a single string
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!Types.ObjectId.isValid(idParam)) {
      throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await bookingService.completeBooking(
      new Types.ObjectId(idParam),
    );
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
    // Ensure we have a single string for the ID
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!Types.ObjectId.isValid(idParam)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(idParam);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Optionally, validate the status against allowed values
    const allowedStatuses = [
      "draft",
      "pending",
      "quoted",
      "payment_pending",
      "confirmed",
      "on_trip",
      "completed",
      "cancelled",
      "rejected",
    ] as const;
    if (!allowedStatuses.includes(req.body.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    booking.status = req.body.status;
    await booking.save();

    return res
      .status(200)
      .json({ success: true, message: "Status updated", data: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// no 1- driver current trip e dekhte pabe
export const getDriverConfirmedBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const driverId = Array.isArray(req.params.driverId)
      ? req.params.driverId[0]
      : req.params.driverId; // get driver id from params
    const bookings = await bookingService.getConfirmedPaidBookingsByDriver(
      new Types.ObjectId(driverId),
    );
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Ensure we have a single string for the ID
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!Types.ObjectId.isValid(idParam)) {
      throw new ApiError(400, "Invalid booking ID");
    }

    const bookingId = new Types.ObjectId(idParam);
    const { otp } = req.body;

    if (!otp) throw new ApiError(400, "OTP is required");

    const valid = await bookingService.verifyCompletionOtp(bookingId, otp);

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
    // Normalize req.params.id to a single string
    const idParam = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!Types.ObjectId.isValid(idParam)) {
      throw new ApiError(400, "Invalid booking ID");
    }

    const bookingId = new Types.ObjectId(idParam);
    const cancellationReason = req.body.cancellationReason as
      | string
      | undefined;

    const booking = await bookingService.updateBooking(bookingId, {
      status: "cancelled",
      cancellationReason,
    });

    if (!booking) throw new ApiError(404, "Booking not found");

    res.status(200).json({ success: true, data: booking });
  } catch (e) {
    next(e);
  }
};
