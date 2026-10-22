"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel = exports.getDriverCompletedBookings = exports.verifyOtp = exports.getDriverConfirmedBookings = exports.updateBookingStatus = exports.listCompleted = exports.complete = exports.sendDriverQuote = exports.listAvailableForDriver = exports.selectQuote = exports.rejectQuote = exports.addQuote = exports.update = exports.getRejectedBookings = exports.makeRejected = exports.makeQuotedWithDriver = exports.makePublic = exports.getDriverQuotesByBookingId = exports.confirmBookingWithDriver = exports.getDriverQuotesByDriverId = exports.getBookingsByUserEmail = exports.listPending = exports.listUserPendingQuoteBookings = exports.listRejected = exports.getUserBookingsWithPendingQuotes = exports.getBookingsByUser = exports.verifyCompletionOtp = exports.dropOffBooking = exports.list = exports.cancelBooking = exports.getById = exports.create = void 0;
const mongoose_1 = require("mongoose");
const bookingService = __importStar(require("./booking.service"));
const ApiError_1 = require("../../utils/ApiError");
const booking_model_1 = require("./booking.model");
const booking_service_1 = require("./booking.service");
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("../driver/driver.model");
// Create bookingssssssss
const create = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.userId) {
            throw new ApiError_1.ApiError(400, "User ID is required");
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
        const booking = await booking_model_1.Booking.findById(created._id)
            .populate("userId", "name email phone role photoURL")
            .populate("driverId");
        res.status(201).json({ success: true, data: booking });
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const getById = async (req, res, next) => {
    try {
        let idParam = req.params.id;
        if (Array.isArray(idParam)) {
            idParam = idParam[0]; // take the first one if array
        }
        const id = new mongoose_1.Types.ObjectId(idParam);
        const booking = await booking_model_1.Booking.findById(id)
            .populate("userId", "name email phone role photoURL")
            .populate("driverId");
        if (!booking)
            throw new ApiError_1.ApiError(404, "Booking not found");
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.getById = getById;
// Cancel booking
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await booking_model_1.Booking.findById(bookingId);
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
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error from booking controller",
        });
    }
};
exports.cancelBooking = cancelBooking;
const list = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const driverId = req.query.driverId;
        const status = req.query.status;
        const filter = {};
        if (userId)
            filter.userId = new mongoose_1.Types.ObjectId(userId);
        if (driverId)
            filter.driverId = new mongoose_1.Types.ObjectId(driverId);
        if (status)
            filter.status = status;
        const bookings = await booking_model_1.Booking.find(filter)
            .populate("userId", "name email phone role photoURL")
            .populate("driverId")
            .populate({
            path: "driverQuote.driverId",
            model: "Driver",
            select: "name phoneNumber photo vehicleDetails",
        })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bookings });
    }
    catch (e) {
        next(e);
    }
};
exports.list = list;
// PATCH /bookings/:bookingId/drop-off
// PATCH /bookings/:bookingId/drop-off
const dropOffBooking = async (req, res) => {
    try {
        let { bookingId } = req.params;
        // Ensure it's a string
        if (Array.isArray(bookingId))
            bookingId = bookingId[0];
        // Validate ObjectId
        if (!mongoose_1.Types.ObjectId.isValid(bookingId)) {
            throw new ApiError_1.ApiError(400, "Invalid bookingId");
        }
        const booking = await booking_model_1.Booking.findById(bookingId);
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
    }
    catch (error) {
        console.error("DROP OFF ERROR:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};
exports.dropOffBooking = dropOffBooking;
const verifyCompletionOtp = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { otp } = req.body;
        if (!otp) {
            throw new ApiError_1.ApiError(400, "OTP is required");
        }
        const bookingIdStr = Array.isArray(bookingId) ? bookingId[0] : bookingId;
        if (!mongoose_1.Types.ObjectId.isValid(bookingIdStr)) {
            throw new ApiError_1.ApiError(400, "Invalid bookingId");
        }
        const booking = await booking_model_1.Booking.findById(bookingIdStr);
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
        const driverQuote = booking.driverQuote.find((q) => q.driverId.toString() === driverIdStr);
        if (!driverQuote) {
            return res.status(404).json({
                success: false,
                message: "Driver quote not found",
            });
        }
        const driver = await driver_model_1.Driver.findById(driverIdStr);
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
    }
    catch (error) {
        console.error("VERIFY COMPLETION OTP ERROR:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};
exports.verifyCompletionOtp = verifyCompletionOtp;
// get by user id
const getBookingsByUser = async (req, res, next) => {
    try {
        let { userId } = req.params;
        // If userId is an array (e.g., from query param), take the first one
        if (Array.isArray(userId)) {
            userId = userId[0];
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new ApiError_1.ApiError(400, "Invalid userId");
        }
        const bookings = await bookingService.getBookingsByUserId(new mongoose_1.Types.ObjectId(userId));
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBookingsByUser = getBookingsByUser;
// by user id and driverQuote status pending
const getUserBookingsWithPendingQuotes = async (userId) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new ApiError_1.ApiError(400, "Invalid user id");
    }
    const bookings = await booking_model_1.Booking.find({
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
exports.getUserBookingsWithPendingQuotes = getUserBookingsWithPendingQuotes;
const listRejected = async (req, res, next) => {
    try {
        const bookings = await booking_model_1.Booking.find({ status: "rejected" })
            .populate("userId", "name email phone role photoURL")
            .populate("driverId")
            .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.listRejected = listRejected;
// get by user id, driverQuote status pending
const listUserPendingQuoteBookings = async (req, res, next) => {
    try {
        let { userId } = req.params;
        // Ensure userId is a string
        if (Array.isArray(userId)) {
            userId = userId[0];
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }
        const bookings = await (0, exports.getUserBookingsWithPendingQuotes)(new mongoose_1.Types.ObjectId(userId));
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.listUserPendingQuoteBookings = listUserPendingQuoteBookings;
const listPending = async (req, res, next) => {
    try {
        const bookings = await booking_model_1.Booking.find({ status: "pending" })
            .populate("userId", "name email phone role photoURL")
            .populate("driverId")
            .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.listPending = listPending;
/**
 * Get all bookings by user email
 * GET /api/bookings/by-email?email=user@example.com
 */
const getBookingsByUserEmail = async (req, res, next) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string") {
            throw new ApiError_1.ApiError(400, "Valid email is required");
        }
        const user = await user_model_1.User.findOne({ email: email.trim() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const bookings = await booking_model_1.Booking.find({ userId: user._id })
            .populate("userId", "name email phone")
            .populate("driverId", "name phoneNumber vehicleDetails")
            .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails")
            .populate("driverQuote.driverId", "name phoneNumber vehicleDetails")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getBookingsByUserEmail = getBookingsByUserEmail;
// GET driverQuote array by driverId
const getDriverQuotesByDriverId = async (req, res, next) => {
    try {
        let { driverId } = req.params;
        // Normalize driverId to string in case it comes as an array
        if (Array.isArray(driverId)) {
            driverId = driverId[0];
        }
        if (!mongoose_1.Types.ObjectId.isValid(driverId)) {
            throw new ApiError_1.ApiError(400, "Valid driverId is required");
        }
        const bookings = await booking_model_1.Booking.find({
            "driverQuote.driverId": new mongoose_1.Types.ObjectId(driverId),
        }).lean();
        const result = bookings.map((booking) => {
            const matchedQuotes = booking.driverQuote.filter((q) => q.driverId.toString() === driverId);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getDriverQuotesByDriverId = getDriverQuotesByDriverId;
// payment confirmed button will change this
const confirmBookingWithDriver = async (req, res, next) => {
    try {
        let { id, quoteId } = req.params;
        // Normalize params if they are arrays
        if (Array.isArray(id))
            id = id[0];
        if (Array.isArray(quoteId))
            quoteId = quoteId[0];
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new ApiError_1.ApiError(400, "Invalid bookingId");
        }
        if (!quoteId || !mongoose_1.Types.ObjectId.isValid(quoteId)) {
            throw new ApiError_1.ApiError(400, "Invalid quoteId");
        }
        const bookingId = new mongoose_1.Types.ObjectId(id);
        const updatedBooking = await bookingService.confirmSelectedDriverQuote(bookingId, quoteId);
        res.status(200).json({
            success: true,
            message: "Booking confirmed successfully",
            data: updatedBooking,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.confirmBookingWithDriver = confirmBookingWithDriver;
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
const getDriverQuotesByBookingId = async (req, res, next) => {
    try {
        let { id } = req.params;
        if (Array.isArray(id))
            id = id[0];
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new ApiError_1.ApiError(400, "Invalid bookingId");
        }
        const booking = await booking_model_1.Booking.findById(id)
            .populate({
            path: "driverQuote.driverId",
            model: "Driver",
            select: "name phoneNumber profileImage vehicleDetails",
        })
            .lean();
        if (!booking) {
            throw new ApiError_1.ApiError(404, "Booking not found");
        }
        res.status(200).json({
            success: true,
            data: booking.driverQuote || [],
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDriverQuotesByBookingId = getDriverQuotesByBookingId;
const makePublic = async (req, res, next) => {
    try {
        let { id } = req.params;
        if (Array.isArray(id))
            id = id[0];
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid booking ID" });
        }
        const booking = await booking_model_1.Booking.findById(id);
        if (!booking) {
            return res
                .status(404)
                .json({ success: false, message: "Booking not found" });
        }
        // Ensure "public" exists in BookingStatus type
        booking.status = "public";
        await booking.save();
        const populatedBooking = await booking_model_1.Booking.findById(id)
            .populate("userId", "name email phone role photoURL")
            .populate("driverId")
            .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails");
        return res.status(200).json({
            success: true,
            message: "Booking status updated to public",
            data: populatedBooking,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.makePublic = makePublic;
const makeQuotedWithDriver = async (req, res, next) => {
    try {
        let { id } = req.params;
        const { driverId, amount } = req.body;
        if (Array.isArray(id))
            id = id[0]; // fix string | string[] issue
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid booking ID" });
        }
        if (!driverId || !mongoose_1.Types.ObjectId.isValid(driverId)) {
            return res
                .status(400)
                .json({ success: false, message: "Valid driverId is required" });
        }
        const booking = await booking_model_1.Booking.findById(id);
        if (!booking) {
            return res
                .status(404)
                .json({ success: false, message: "Booking not found" });
        }
        // make sure "assigned" exists in BookingStatus type
        booking.status = "assigned";
        const quote = {
            _id: new mongoose_1.Types.ObjectId(),
            driverId: new mongoose_1.Types.ObjectId(driverId),
            amount: amount ?? 0, // make sure IAssignByAdmin has amount
            status: "pending",
            createdAt: new Date(),
        };
        booking.assignToDriver.push(quote);
        await booking.save();
        const populatedBooking = await booking_model_1.Booking.findById(id)
            .populate("userId", "name email phone role photoURL")
            .populate("driverId")
            .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails");
        return res.status(200).json({
            success: true,
            message: "Booking status updated to quoted and driver added",
            data: populatedBooking,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.makeQuotedWithDriver = makeQuotedWithDriver;
const makeRejected = async (req, res, next) => {
    try {
        const idParam = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid booking ID" });
        }
        const booking = await booking_model_1.Booking.findById(idParam);
        if (!booking) {
            return res
                .status(404)
                .json({ success: false, message: "Booking not found" });
        }
        booking.status = "rejected";
        await booking.save();
        const populatedBooking = await booking_model_1.Booking.findById(idParam)
            .populate("userId", "name email phone role photoURL")
            .populate("driverId");
        return res.status(200).json({
            success: true,
            message: "Booking status updated to rejected",
            data: populatedBooking,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.makeRejected = makeRejected;
// GET all rejected bookings
const getRejectedBookings = async (req, res, next) => {
    try {
        const bookings = await booking_model_1.Booking.find({ status: "rejected" })
            .populate("userId", "name email phone role photoURL")
            .populate("driverId", "name phoneNumber status vehicleDetails")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRejectedBookings = getRejectedBookings;
const update = async (req, res, next) => {
    try {
        // Ensure id is a string
        const idParam = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            throw new ApiError_1.ApiError(400, "Invalid booking ID");
        }
        const id = new mongoose_1.Types.ObjectId(idParam);
        const data = req.body;
        const booking = await bookingService.updateBooking(id, data);
        if (!booking)
            throw new ApiError_1.ApiError(404, "Booking not found");
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.update = update;
const addQuote = async (req, res, next) => {
    try {
        // Ensure id and driverId are strings
        const idParam = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const driverIdParam = Array.isArray(req.body.driverId)
            ? req.body.driverId[0]
            : req.body.driverId;
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            throw new ApiError_1.ApiError(400, "Invalid booking ID");
        }
        if (!mongoose_1.Types.ObjectId.isValid(driverIdParam)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const id = new mongoose_1.Types.ObjectId(idParam);
        const driverId = new mongoose_1.Types.ObjectId(driverIdParam);
        const amount = Number(req.body.amount);
        const booking = await bookingService.addDriverQuote(id, driverId, amount);
        if (!booking)
            throw new ApiError_1.ApiError(404, "Booking not found");
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.addQuote = addQuote;
const rejectQuote = async (req, res, next) => {
    try {
        // Ensure params are strings
        const idParam = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const quoteIdParam = Array.isArray(req.params.quoteId)
            ? req.params.quoteId[0]
            : req.params.quoteId;
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            throw new ApiError_1.ApiError(400, "Invalid booking ID");
        }
        if (!quoteIdParam) {
            throw new ApiError_1.ApiError(400, "Invalid quote ID");
        }
        const id = new mongoose_1.Types.ObjectId(idParam);
        const booking = await bookingService.rejectQuote(id, quoteIdParam);
        if (!booking)
            throw new ApiError_1.ApiError(404, "Booking not found");
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.rejectQuote = rejectQuote;
const selectQuote = async (req, res, next) => {
    try {
        // Ensure params are strings
        const idParam = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const { quoteId, amount } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            throw new ApiError_1.ApiError(400, "Invalid booking ID");
        }
        if (!quoteId || Array.isArray(quoteId)) {
            throw new ApiError_1.ApiError(400, "Invalid quoteId");
        }
        if (amount === undefined || isNaN(Number(amount))) {
            throw new ApiError_1.ApiError(400, "Amount is required and must be a number");
        }
        const bookingId = new mongoose_1.Types.ObjectId(idParam);
        // Pass all 3 arguments to the service
        const booking = await bookingService.selectQuote(bookingId, quoteId, Number(amount));
        if (!booking)
            throw new ApiError_1.ApiError(404, "Booking not found");
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.selectQuote = selectQuote;
// to get pending bookings for driver dashboard
const listAvailableForDriver = async (req, res, next) => {
    try {
        let driverId = req.query.driverId;
        if (Array.isArray(driverId))
            driverId = driverId[0];
        if (!driverId ||
            typeof driverId !== "string" ||
            !mongoose_1.Types.ObjectId.isValid(driverId)) {
            throw new ApiError_1.ApiError(400, "Valid driverId is required");
        }
        const driverObjectId = new mongoose_1.Types.ObjectId(driverId);
        const bookings = await booking_model_1.Booking.find({
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
    }
    catch (error) {
        next(error);
    }
};
exports.listAvailableForDriver = listAvailableForDriver;
// Driver Quote create and update
const sendDriverQuote = async (req, res, next) => {
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
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid booking id" });
        }
        if (!mongoose_1.Types.ObjectId.isValid(driverIdParam)) {
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
        const updatedBooking = await (0, booking_service_1.addOrUpdateDriverQuote)(new mongoose_1.Types.ObjectId(idParam), new mongoose_1.Types.ObjectId(driverIdParam), amount);
        res.status(200).json({
            success: true,
            data: updatedBooking,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendDriverQuote = sendDriverQuote;
const complete = async (req, res, next) => {
    try {
        // Ensure we have a single string
        const idParam = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            throw new ApiError_1.ApiError(400, "Invalid booking ID");
        }
        const booking = await bookingService.completeBooking(new mongoose_1.Types.ObjectId(idParam));
        if (!booking)
            throw new ApiError_1.ApiError(404, "Booking not found");
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.complete = complete;
const listCompleted = async (req, res, next) => {
    try {
        const bookings = await booking_model_1.Booking.find({ status: "completed" })
            .populate("userId", "name email phone")
            .populate("driverId")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bookings });
    }
    catch (err) {
        next(err);
    }
};
exports.listCompleted = listCompleted;
const updateBookingStatus = async (req, res, next) => {
    try {
        // Ensure we have a single string for the ID
        const idParam = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid booking ID" });
        }
        const booking = await booking_model_1.Booking.findById(idParam);
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
        ];
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.updateBookingStatus = updateBookingStatus;
// no 1- driver current trip e dekhte pabe
const getDriverConfirmedBookings = async (req, res, next) => {
    try {
        const driverId = Array.isArray(req.params.driverId)
            ? req.params.driverId[0]
            : req.params.driverId; // get driver id from params
        const bookings = await bookingService.getConfirmedPaidBookingsByDriver(new mongoose_1.Types.ObjectId(driverId));
        res.status(200).json({ success: true, data: bookings });
    }
    catch (err) {
        next(err);
    }
};
exports.getDriverConfirmedBookings = getDriverConfirmedBookings;
const verifyOtp = async (req, res, next) => {
    try {
        // Ensure we have a single string for the ID
        const idParam = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            throw new ApiError_1.ApiError(400, "Invalid booking ID");
        }
        const bookingId = new mongoose_1.Types.ObjectId(idParam);
        const { otp } = req.body;
        if (!otp)
            throw new ApiError_1.ApiError(400, "OTP is required");
        const valid = await bookingService.verifyCompletionOtp(bookingId, otp);
        if (!valid)
            throw new ApiError_1.ApiError(400, "Invalid OTP");
        res.status(200).json({ success: true, message: "OTP verified" });
    }
    catch (e) {
        next(e);
    }
};
exports.verifyOtp = verifyOtp;
const getDriverCompletedBookings = async (req, res, next) => {
    try {
        const driverId = Array.isArray(req.params.driverId)
            ? req.params.driverId[0]
            : req.params.driverId; // get driver id from params
        if (!mongoose_1.Types.ObjectId.isValid(driverId)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const bookings = await bookingService.getDriverCompletedBookings(new mongoose_1.Types.ObjectId(driverId));
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDriverCompletedBookings = getDriverCompletedBookings;
const cancel = async (req, res, next) => {
    try {
        // Normalize req.params.id to a single string
        const idParam = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(idParam)) {
            throw new ApiError_1.ApiError(400, "Invalid booking ID");
        }
        const bookingId = new mongoose_1.Types.ObjectId(idParam);
        const cancellationReason = req.body.cancellationReason;
        const booking = await bookingService.updateBooking(bookingId, {
            status: "cancelled",
            cancellationReason,
        });
        if (!booking)
            throw new ApiError_1.ApiError(404, "Booking not found");
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.cancel = cancel;
//# sourceMappingURL=booking.controller.js.map