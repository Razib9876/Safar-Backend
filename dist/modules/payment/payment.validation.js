"use strict";
// import { body } from "express-validator";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePaymentValidation = void 0;
// export const initiatePaymentValidation = [
//   body("bookingId").notEmpty().withMessage("Booking ID is required"),
//   body("amount")
//     .isFloat({ gt: 0 })
//     .withMessage("Amount must be greater than 0"),
//   body("paymentMethod")
//     .isIn([
//       "bkash",
//       "nagad",
//       "rocket",
//       "upay",
//       "tap",
//       "surecash",
//       "visa",
//       "mastercard",
//       "amex",
//       "unionpay",
//       "dbbl_nexus",
//       "maestro",
//       "cash",
//       "internet_banking",
//     ])
//     .withMessage("Invalid payment method"),
// ];
// import { body } from "express-validator";
// export const initiatePaymentValidation = [
//   body("bookingId").notEmpty().withMessage("Booking ID is required"),
//   body("amount")
//     .isFloat({ gt: 0 })
//     .withMessage("Amount must be greater than 0"),
//   body("paymentMethod")
//     .isIn([
//       "bkash",
//       "nagad",
//       "rocket",
//       "upay",
//       "tap",
//       "surecash",
//       "visa",
//       "mastercard",
//       "amex",
//       "unionpay",
//       "dbbl_nexus",
//       "maestro",
//       "cash",
//       "internet_banking",
//     ])
//     .withMessage("Invalid payment method"),
// ];
const express_validator_1 = require("express-validator");
exports.initiatePaymentValidation = [
    (0, express_validator_1.body)("bookingId").notEmpty().withMessage("Booking ID is required"),
    (0, express_validator_1.body)("driverId")
        .notEmpty()
        .isMongoId()
        .withMessage("Valid driverId is required"), // ✅ নতুন
    (0, express_validator_1.body)("amount")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than 0"),
    (0, express_validator_1.body)("paymentMethod")
        .isIn([
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
    ])
        .withMessage("Invalid payment method"),
];
//# sourceMappingURL=payment.validation.js.map