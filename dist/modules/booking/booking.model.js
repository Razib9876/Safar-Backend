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
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const driverQuoteSchema = new mongoose_1.Schema({
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Driver', required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected_by_user'],
        default: 'pending',
    },
    rejectedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
const bookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Driver' },
    tripType: {
        type: String,
        required: true,
        enum: ['one_way', 'round_trip'],
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['car', 'cng', 'hiace'],
    },
    phoneNumber: { type: String, required: true, trim: true },
    fromLocation: { type: mongoose_1.Schema.Types.Mixed, required: true },
    toLocation: { type: mongoose_1.Schema.Types.Mixed, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date },
    timeFrom: { type: String, required: true },
    timeTo: { type: String },
    status: {
        type: String,
        required: true,
        enum: [
            'draft',
            'pending_quotes',
            'quoted',
            'payment_pending',
            'confirmed',
            'on_trip',
            'completed',
            'cancelled',
            'rejected',
        ],
        default: 'pending_quotes',
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    totalAmount: { type: Number },
    paymentMethod: { type: String },
    isPublic: { type: Boolean, required: true, default: true },
    driverQuotes: [driverQuoteSchema],
    selectedQuoteId: { type: String },
    completionOtp: { type: String },
    completionOtpExpiresAt: { type: Date },
    pickStatus: { type: String, enum: ['pending', 'picked', 'dropped'] },
    pickupTime: { type: Date },
    dropoffTime: { type: Date },
    cancellationReason: { type: String },
    notes: { type: String },
}, {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
});
exports.Booking = mongoose_1.default.model('Booking', bookingSchema);
//# sourceMappingURL=booking.model.js.map