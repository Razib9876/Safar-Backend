"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        index: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 1,
    },
    paymentMethod: {
        type: String,
        enum: [
            "bkash",
            "nagad",
            "rocket",
            "upay",
            "tap",
            "surecash",
            "visa",
            "mastercard",
            "amex",
            "unionpay",
            "dbbl_nexus",
            "maestro",
            "cash",
            "internet_banking",
        ],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
        index: true,
    },
    paidAt: {
        type: Date,
    },
}, { timestamps: true });
paymentSchema.index({ booking: 1, createdAt: -1 });
paymentSchema.pre("save", function (next) {
    if (this.status === "paid" && !this.paidAt) {
        this.paidAt = new Date();
    }
    next();
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
//# sourceMappingURL=payment.model.js.map