"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.driverIdParamRules = exports.quoteIdParamRules = exports.idParamRules = exports.verifyOtpBodyRules = exports.selectQuoteBodyRules = exports.addQuoteRules = exports.updateBookingRules = exports.createBookingRules = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../../utils/ApiError");
/* ================== CREATE BOOKING ================== */
const createBookingRules = () => [
    (0, express_validator_1.body)("userId").isMongoId().withMessage("Valid userId is required"),
    (0, express_validator_1.body)("tripType")
        .isIn(["one_way", "round_trip"])
        .withMessage("Invalid tripType"),
    (0, express_validator_1.body)("vehicleType")
        .isIn(["car", "cng", "hiace"])
        .withMessage("Invalid vehicleType"),
    (0, express_validator_1.body)("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
    (0, express_validator_1.body)("fromLocation").notEmpty().withMessage("fromLocation is required"),
    (0, express_validator_1.body)("toLocation").notEmpty().withMessage("toLocation is required"),
    (0, express_validator_1.body)("dateFrom").isISO8601().withMessage("Valid dateFrom is required"),
    (0, express_validator_1.body)("dateTo").optional().isISO8601().withMessage("Valid dateTo is required"),
    (0, express_validator_1.body)("timeFrom").trim().notEmpty().withMessage("timeFrom is required"),
    (0, express_validator_1.body)("timeTo").optional().trim(),
    (0, express_validator_1.body)("isPublic").optional().isBoolean(),
];
exports.createBookingRules = createBookingRules;
/* ================== UPDATE BOOKING ================== */
const updateBookingRules = () => [
    (0, express_validator_1.body)("status")
        .optional()
        .isIn([
        "draft",
        "pending",
        "quoted",
        "payment_pending",
        "confirmed",
        "on_trip",
        "completed",
        "cancelled",
        "rejected",
    ])
        .withMessage("Invalid status"),
    (0, express_validator_1.body)("paymentStatus")
        .optional()
        .isIn(["pending", "paid", "failed", "refunded"])
        .withMessage("Invalid paymentStatus"),
    (0, express_validator_1.body)("driverId")
        .optional()
        .isMongoId()
        .withMessage("Valid driverId is required"),
    (0, express_validator_1.body)("totalAmount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("totalAmount must be a positive number"),
    (0, express_validator_1.body)("selectedQuoteId").optional().trim(),
    (0, express_validator_1.body)("pickStatus")
        .optional()
        .isIn(["pending", "picked", "dropped"])
        .withMessage("Invalid pickStatus"),
    (0, express_validator_1.body)("pickupTime").optional().isISO8601(),
    (0, express_validator_1.body)("dropoffTime").optional().isISO8601(),
    (0, express_validator_1.body)("isPublic").optional().isBoolean(),
];
exports.updateBookingRules = updateBookingRules;
/* ================== QUOTES ================== */
const addQuoteRules = () => [
    (0, express_validator_1.body)("driverId").isMongoId().withMessage("Valid driverId is required"),
    (0, express_validator_1.body)("amount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("amount must be a positive number"),
];
exports.addQuoteRules = addQuoteRules;
const selectQuoteBodyRules = () => [
    (0, express_validator_1.body)("quoteId").isMongoId().withMessage("Valid quoteId is required"),
];
exports.selectQuoteBodyRules = selectQuoteBodyRules;
const verifyOtpBodyRules = () => [
    (0, express_validator_1.body)("otp").trim().notEmpty().withMessage("otp is required"),
];
exports.verifyOtpBodyRules = verifyOtpBodyRules;
/* ================== PARAMS ================== */
const idParamRules = () => (0, express_validator_1.param)("id").isMongoId().withMessage("Valid id is required");
exports.idParamRules = idParamRules;
const quoteIdParamRules = () => (0, express_validator_1.param)("quoteId").isMongoId().withMessage("Valid quoteId is required");
exports.quoteIdParamRules = quoteIdParamRules;
/* ✅ New: driverId param for /driver-quotes/:driverId route */
const driverIdParamRules = () => (0, express_validator_1.param)("driverId").isMongoId().withMessage("Valid driverId is required");
exports.driverIdParamRules = driverIdParamRules;
/* ================== VALIDATION MIDDLEWARE ================== */
const validate = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty())
        return next();
    const message = errors
        .array()
        .map((e) => e.msg)
        .join("; ");
    next(new ApiError_1.ApiError(400, message));
};
exports.validate = validate;
//# sourceMappingURL=booking.validation.js.map