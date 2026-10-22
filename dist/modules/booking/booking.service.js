"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCompletionOtp = exports.getDriverCompletedBookings = exports.completeBooking = exports.getConfirmedPaidBookingsByDriver = exports.selectQuote = exports.rejectQuote = exports.addDriverQuote = exports.addOrUpdateDriverQuote = exports.confirmSelectedDriverQuote = exports.updateBooking = exports.listBookings = exports.getBookingsByUserId = exports.findBookingById = exports.createBooking = void 0;
const mongoose_1 = require("mongoose");
const booking_model_1 = require("./booking.model");
const ApiError_1 = require("../../utils/ApiError");
const createBooking = async (data) => {
    const booking = await booking_model_1.Booking.create({
        ...data,
        status: data.isPublic === false ? "pending" : "pending",
        paymentStatus: "pending",
        assignToDriver: [],
        isPublic: data.isPublic ?? true,
    });
    return booking;
};
exports.createBooking = createBooking;
const findBookingById = async (id, populate = true) => {
    const q = booking_model_1.Booking.findById(id);
    if (populate) {
        q.populate("userId", "name email phone")
            .populate("driverId")
            .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails");
    }
    return q;
};
exports.findBookingById = findBookingById;
// get by user id
const getBookingsByUserId = async (userId) => {
    return booking_model_1.Booking.find({ userId })
        .populate("userId", "name email")
        .populate("driverId", "name phoneNumber")
        .sort({ createdAt: -1 });
};
exports.getBookingsByUserId = getBookingsByUserId;
const listBookings = async (query) => {
    const filter = {};
    if (query.userId)
        filter.userId = query.userId;
    if (query.driverId)
        filter.driverId = query.driverId;
    if (query.status)
        filter.status = query.status;
    return booking_model_1.Booking.find(filter)
        .populate("userId", "name email phone")
        .populate("driverId")
        .sort({ createdAt: -1 });
};
exports.listBookings = listBookings;
const updateBooking = async (id, data) => {
    return booking_model_1.Booking.findByIdAndUpdate(id, { $set: data }, { new: true })
        .populate("userId", "name email phone")
        .populate("driverId")
        .populate("assignToDriver.driverId", "name phoneNumber vehicleDetails");
};
exports.updateBooking = updateBooking;
// payment conrfirm button will do this
const confirmSelectedDriverQuote = async (bookingId, quoteId) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError_1.ApiError(404, "Booking not found");
    }
    const selectedQuote = booking.driverQuote.find((q) => q._id?.toString() === quoteId);
    if (!selectedQuote) {
        throw new ApiError_1.ApiError(404, "Selected driver quote not found");
    }
    if (selectedQuote.status !== "pending") {
        throw new ApiError_1.ApiError(400, "Quote is not pending");
    }
    booking.driverQuote.forEach((quote) => {
        if (quote._id.toString() === quoteId) {
            quote.status = "confirmed";
        }
        else if (quote.status === "pending") {
            quote.status = "rejected";
        }
    });
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.driverId = selectedQuote.driverId;
    await booking.save();
    return booking_model_1.Booking.findById(bookingId)
        .populate("userId", "name email phone")
        .populate("driverId", "name phoneNumber vehicleDetails")
        .populate("driverQuote.driverId", "name phoneNumber vehicleDetails");
};
exports.confirmSelectedDriverQuote = confirmSelectedDriverQuote;
// driverQuote add and update
const addOrUpdateDriverQuote = async (bookingId, driverId, amount) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError_1.ApiError(404, "Booking not found");
    }
    // Check if driver already has a quote
    const existingQuote = booking.driverQuote.find((q) => q.driverId.toString() === driverId.toString());
    if (existingQuote) {
        existingQuote.previousAmount = existingQuote.currentAmount;
        existingQuote.currentAmount = amount;
        existingQuote.status = "pending";
    }
    else {
        booking.driverQuote.push({
            _id: new mongoose_1.Types.ObjectId(),
            driverId,
            currentAmount: amount,
            previousAmount: "",
            status: "pending",
            createdAt: new Date(),
        });
    }
    await booking.save();
    // Return updated booking with populated driver info
    return booking_model_1.Booking.findById(bookingId).populate("driverQuote.driverId", "name phoneNumber vehicleDetails");
};
exports.addOrUpdateDriverQuote = addOrUpdateDriverQuote;
const addDriverQuote = async (bookingId, driverId, amount) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking)
        return null;
    if (booking.status !== "pending" && booking.status !== "quoted") {
        throw new ApiError_1.ApiError(400, "Booking not accepting quotes");
    }
    const quote = {
        _id: new mongoose_1.Types.ObjectId(),
        driverId,
        currentAmount: amount,
        previousAmount: "",
        status: "pending",
        createdAt: new Date(),
    };
    booking.driverQuote.push(quote); // ✅ FIXED
    booking.status = "quoted";
    await booking.save();
    return (0, exports.findBookingById)(bookingId);
};
exports.addDriverQuote = addDriverQuote;
const rejectQuote = async (bookingId, quoteId) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking)
        return null;
    const quote = booking.assignToDriver.find((q) => q._id?.toString() === quoteId);
    if (!quote)
        throw new ApiError_1.ApiError(404, "Quote not found");
    quote.status = "rejected_by_user";
    quote.rejectedAt = new Date();
    await booking.save();
    return (0, exports.findBookingById)(bookingId);
};
exports.rejectQuote = rejectQuote;
const selectQuote = async (bookingId, quoteId, amount) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking)
        return null;
    const quote = booking.assignToDriver.find((q) => q._id?.toString() === quoteId);
    if (!quote)
        throw new ApiError_1.ApiError(404, "Quote not found");
    if (quote.status !== "pending")
        throw new ApiError_1.ApiError(400, "Quote not available");
    booking.driverId = quote.driverId;
    booking.selectedQuoteId = new mongoose_1.Types.ObjectId(quoteId);
    booking.totalAmount = quote.amount;
    booking.status = "payment_pending";
    quote.status = "accepted";
    await booking.save();
    return (0, exports.findBookingById)(bookingId);
};
exports.selectQuote = selectQuote;
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// no 1- driver current trip e dekhte pabe
const getConfirmedPaidBookingsByDriver = async (driverId) => {
    return booking_model_1.Booking.find({
        driverId,
        status: { $in: ["confirmed", "on_trip"] },
        paymentStatus: "paid",
    })
        .populate("userId", "name email phone") // populate user info
        .populate("driverId", "name phoneNumber vehicleDetails") // driver info if needed
        .sort({ dateFrom: -1 });
};
exports.getConfirmedPaidBookingsByDriver = getConfirmedPaidBookingsByDriver;
const completeBooking = async (bookingId) => {
    const otp = generateOtp();
    const booking = await booking_model_1.Booking.findByIdAndUpdate(bookingId, {
        $set: {
            status: "completed",
            completionOtp: otp,
            completionOtpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
    }, { new: true })
        .populate("userId", "name email phone")
        .populate("driverId");
    return booking;
};
exports.completeBooking = completeBooking;
const getDriverCompletedBookings = async (driverId) => {
    return booking_model_1.Booking.find({
        driverId,
        status: "completed",
    });
};
exports.getDriverCompletedBookings = getDriverCompletedBookings;
const verifyCompletionOtp = async (bookingId, otp) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking || !booking.completionOtp)
        return false;
    if (booking.completionOtp !== otp)
        return false;
    return true;
};
exports.verifyCompletionOtp = verifyCompletionOtp;
//# sourceMappingURL=booking.service.js.map