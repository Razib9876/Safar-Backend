"use strict";
// import { Request, Response } from "express";
// import { validationResult } from "express-validator";
// import { PaymentService } from "./payment.service";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePayment = void 0;
const express_validator_1 = require("express-validator");
const payment_service_1 = require("./payment.service");
const initiatePayment = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const payment = await payment_service_1.PaymentService.initiatePayment(req.body);
        return res.status(200).json({
            success: true,
            message: "Payment processed successfully",
            data: payment,
        });
    }
    catch (err) {
        if (err.code === "ALREADY_PAID") {
            return res.status(400).json({
                success: false,
                message: "Booking already paid",
            });
        }
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.initiatePayment = initiatePayment;
//# sourceMappingURL=payment.controller.js.map