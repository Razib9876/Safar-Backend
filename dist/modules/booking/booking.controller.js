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
exports.cancel = exports.verifyOtp = exports.complete = exports.selectQuote = exports.rejectQuote = exports.addQuote = exports.update = exports.list = exports.getById = exports.create = void 0;
const mongoose_1 = require("mongoose");
const bookingService = __importStar(require("./booking.service"));
const ApiError_1 = require("../../utils/ApiError");
const create = async (req, res, next) => {
    try {
        const data = req.body;
        const booking = await bookingService.createBooking(data);
        res.status(201).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.create = create;
const getById = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const booking = await bookingService.findBookingById(id);
        if (!booking)
            throw new ApiError_1.ApiError(404, 'Booking not found');
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.getById = getById;
const list = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const driverId = req.query.driverId;
        const status = req.query.status;
        const bookings = await bookingService.listBookings({
            userId: userId ? new mongoose_1.Types.ObjectId(userId) : undefined,
            driverId: driverId ? new mongoose_1.Types.ObjectId(driverId) : undefined,
            status: status,
        });
        res.status(200).json({ success: true, data: bookings });
    }
    catch (e) {
        next(e);
    }
};
exports.list = list;
const update = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const data = req.body;
        const booking = await bookingService.updateBooking(id, data);
        if (!booking)
            throw new ApiError_1.ApiError(404, 'Booking not found');
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.update = update;
const addQuote = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const driverId = new mongoose_1.Types.ObjectId(req.body.driverId);
        const amount = Number(req.body.amount);
        const booking = await bookingService.addDriverQuote(id, driverId, amount);
        if (!booking)
            throw new ApiError_1.ApiError(404, 'Booking not found');
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.addQuote = addQuote;
const rejectQuote = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const { quoteId } = req.params;
        const booking = await bookingService.rejectQuote(id, quoteId);
        if (!booking)
            throw new ApiError_1.ApiError(404, 'Booking not found');
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.rejectQuote = rejectQuote;
const selectQuote = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const { quoteId } = req.body;
        if (!quoteId)
            throw new ApiError_1.ApiError(400, 'quoteId is required');
        const booking = await bookingService.selectQuote(id, quoteId);
        if (!booking)
            throw new ApiError_1.ApiError(404, 'Booking not found');
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.selectQuote = selectQuote;
const complete = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const booking = await bookingService.completeBooking(id);
        if (!booking)
            throw new ApiError_1.ApiError(404, 'Booking not found');
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.complete = complete;
const verifyOtp = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const { otp } = req.body;
        if (!otp)
            throw new ApiError_1.ApiError(400, 'otp is required');
        const valid = await bookingService.verifyCompletionOtp(id, otp);
        if (!valid)
            throw new ApiError_1.ApiError(400, 'Invalid OTP');
        res.status(200).json({ success: true, message: 'OTP verified' });
    }
    catch (e) {
        next(e);
    }
};
exports.verifyOtp = verifyOtp;
const cancel = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const cancellationReason = req.body.cancellationReason;
        const booking = await bookingService.updateBooking(id, {
            status: 'cancelled',
            cancellationReason,
        });
        if (!booking)
            throw new ApiError_1.ApiError(404, 'Booking not found');
        res.status(200).json({ success: true, data: booking });
    }
    catch (e) {
        next(e);
    }
};
exports.cancel = cancel;
//# sourceMappingURL=booking.controller.js.map