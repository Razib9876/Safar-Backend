"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCompletionOtp = exports.completeBooking = exports.selectQuote = exports.rejectQuote = exports.addDriverQuote = exports.updateBooking = exports.listBookings = exports.findBookingById = exports.createBooking = void 0;
const mongoose_1 = require("mongoose");
const booking_model_1 = require("./booking.model");
const ApiError_1 = require("../../utils/ApiError");
const createBooking = async (data) => {
    const booking = await booking_model_1.Booking.create({
        ...data,
        status: data.isPublic === false ? 'pending_quotes' : 'pending_quotes',
        paymentStatus: 'pending',
        driverQuotes: [],
        isPublic: data.isPublic ?? true,
    });
    return booking;
};
exports.createBooking = createBooking;
const findBookingById = async (id, populate = true) => {
    const q = booking_model_1.Booking.findById(id);
    if (populate) {
        q.populate('userId', 'name email phone')
            .populate('driverId')
            .populate('driverQuotes.driverId', 'name phoneNumber vehicleDetails');
    }
    return q;
};
exports.findBookingById = findBookingById;
const listBookings = async (query) => {
    const filter = {};
    if (query.userId)
        filter.userId = query.userId;
    if (query.driverId)
        filter.driverId = query.driverId;
    if (query.status)
        filter.status = query.status;
    return booking_model_1.Booking.find(filter)
        .populate('userId', 'name email phone')
        .populate('driverId')
        .sort({ createdAt: -1 });
};
exports.listBookings = listBookings;
const updateBooking = async (id, data) => {
    return booking_model_1.Booking.findByIdAndUpdate(id, { $set: data }, { new: true })
        .populate('userId', 'name email phone')
        .populate('driverId')
        .populate('driverQuotes.driverId', 'name phoneNumber vehicleDetails');
};
exports.updateBooking = updateBooking;
const addDriverQuote = async (bookingId, driverId, amount) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking)
        return null;
    if (booking.status !== 'pending_quotes' && booking.status !== 'quoted') {
        throw new ApiError_1.ApiError(400, 'Booking not accepting quotes');
    }
    const quote = {
        _id: new mongoose_1.Types.ObjectId(),
        driverId,
        amount,
        status: 'pending',
        createdAt: new Date(),
    };
    booking.driverQuotes.push(quote);
    booking.status = 'quoted';
    await booking.save();
    return (0, exports.findBookingById)(bookingId);
};
exports.addDriverQuote = addDriverQuote;
const rejectQuote = async (bookingId, quoteId) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking)
        return null;
    const quote = booking.driverQuotes.id(quoteId);
    if (!quote)
        throw new ApiError_1.ApiError(404, 'Quote not found');
    quote.status = 'rejected_by_user';
    quote.rejectedAt = new Date();
    await booking.save();
    return (0, exports.findBookingById)(bookingId);
};
exports.rejectQuote = rejectQuote;
const selectQuote = async (bookingId, quoteId) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking)
        return null;
    const quote = booking.driverQuotes.id(quoteId);
    if (!quote)
        throw new ApiError_1.ApiError(404, 'Quote not found');
    if (quote.status !== 'pending')
        throw new ApiError_1.ApiError(400, 'Quote not available');
    booking.driverId = quote.driverId;
    booking.selectedQuoteId = quoteId;
    booking.totalAmount = quote.amount;
    booking.status = 'payment_pending';
    quote.status = 'accepted';
    await booking.save();
    return (0, exports.findBookingById)(bookingId);
};
exports.selectQuote = selectQuote;
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const completeBooking = async (bookingId) => {
    const otp = generateOtp();
    const booking = await booking_model_1.Booking.findByIdAndUpdate(bookingId, {
        $set: {
            status: 'completed',
            completionOtp: otp,
            completionOtpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
    }, { new: true })
        .populate('userId', 'name email phone')
        .populate('driverId');
    return booking;
};
exports.completeBooking = completeBooking;
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