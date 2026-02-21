import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/ApiError";

/* ================== CREATE BOOKING ================== */
export const createBookingRules = () => [
  body("userId").isMongoId().withMessage("Valid userId is required"),
  body("tripType")
    .isIn(["one_way", "round_trip"])
    .withMessage("Invalid tripType"),
  body("vehicleType")
    .isIn(["car", "cng", "hiace"])
    .withMessage("Invalid vehicleType"),
  body("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
  body("fromLocation").notEmpty().withMessage("fromLocation is required"),
  body("toLocation").notEmpty().withMessage("toLocation is required"),
  body("dateFrom").isISO8601().withMessage("Valid dateFrom is required"),
  body("dateTo").optional().isISO8601().withMessage("Valid dateTo is required"),
  body("timeFrom").trim().notEmpty().withMessage("timeFrom is required"),
  body("timeTo").optional().trim(),
  body("isPublic").optional().isBoolean(),
];

/* ================== UPDATE BOOKING ================== */
export const updateBookingRules = () => [
  body("status")
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
  body("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed", "refunded"])
    .withMessage("Invalid paymentStatus"),
  body("driverId")
    .optional()
    .isMongoId()
    .withMessage("Valid driverId is required"),
  body("totalAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("totalAmount must be a positive number"),
  body("selectedQuoteId").optional().trim(),
  body("pickStatus")
    .optional()
    .isIn(["pending", "picked", "dropped"])
    .withMessage("Invalid pickStatus"),
  body("pickupTime").optional().isISO8601(),
  body("dropoffTime").optional().isISO8601(),
  body("isPublic").optional().isBoolean(),
];

/* ================== QUOTES ================== */
export const addQuoteRules = () => [
  body("driverId").isMongoId().withMessage("Valid driverId is required"),
  body("amount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("amount must be a positive number"),
];

export const selectQuoteBodyRules = () => [
  body("quoteId").isMongoId().withMessage("Valid quoteId is required"),
];

export const verifyOtpBodyRules = () => [
  body("otp").trim().notEmpty().withMessage("otp is required"),
];

/* ================== PARAMS ================== */
export const idParamRules = () =>
  param("id").isMongoId().withMessage("Valid id is required");

export const quoteIdParamRules = () =>
  param("quoteId").isMongoId().withMessage("Valid quoteId is required");

/* ✅ New: driverId param for /driver-quotes/:driverId route */
export const driverIdParamRules = () =>
  param("driverId").isMongoId().withMessage("Valid driverId is required");

/* ================== VALIDATION MIDDLEWARE ================== */
export const validate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const message = errors
    .array()
    .map((e) => e.msg)
    .join("; ");
  next(new ApiError(400, message));
};
