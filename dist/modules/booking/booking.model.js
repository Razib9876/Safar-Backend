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
/* ================= DRIVER QUOTE SCHEMA ================= */
const assignToDriverSchema = new mongoose_1.Schema({
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver" },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected_by_user"],
        default: "pending",
    },
    rejectedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
const driverQuoteSchema = new mongoose_1.Schema({
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver" },
    currentAmount: { type: Number, required: true },
    previousAmount: { type: Number },
    status: {
        type: String,
        enum: ["pending", "confirmed", "rejected"],
        default: "pending",
    },
    rejectedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
/* ================= BOOKING SCHEMA ================= */
const bookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver",
        default: null,
    },
    tripType: {
        type: String,
        enum: ["one_way", "round_trip"],
        default: "one_way",
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ["car", "cng", "hiace"],
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    fromLocation: { type: String, required: true },
    toLocation: { type: String, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, default: null },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, default: null },
    status: {
        type: String,
        enum: [
            "draft",
            "pending",
            "public",
            "assigned",
            "quoted",
            "payment_pending",
            "confirmed",
            "on_trip",
            "completed",
            "cancelled",
            "rejected",
        ],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
    },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" },
    totalAmount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
    assignToDriver: { type: [assignToDriverSchema], default: [] },
    driverQuote: { type: [driverQuoteSchema], default: [] },
    selectedQuoteId: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
    },
    completionOtp: { type: String, default: null },
    completionOtpExpiresAt: { type: Date, default: null },
    pickStatus: {
        type: String,
        enum: ["pending", "picked", "dropped"],
        default: "pending",
    },
    pickupTime: { type: Date, default: null },
    dropoffTime: { type: Date, default: null },
    cancellationReason: { type: String, default: null },
}, {
    timestamps: true,
});
exports.Booking = mongoose_1.default.model("Booking", bookingSchema);
//# sourceMappingURL=booking.model.js.map