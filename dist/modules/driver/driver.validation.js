"use strict";
// import { body, param, validationResult } from "express-validator";
// import { Request, Response, NextFunction } from "express";
// import { ApiError } from "../../utils/ApiError";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.bookingIdParamRules = exports.driverIdParamRules = exports.userIdParamRules = exports.idParamRules = exports.updateDriverRules = exports.createDriverRules = void 0;
// export const createDriverRules = () => [
//   body("userId").isMongoId().withMessage("Valid userId is required"),
//   body("name").trim().notEmpty().withMessage("Name is required"),
//   body("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
//   body("photo").optional().trim(),
//   body("vehicleDetails")
//     .isArray({ min: 1 })
//     .withMessage("vehicleDetails must be an array with at least 1 vehicle"),
//   body("vehicleDetails.*.type")
//     .trim()
//     .notEmpty()
//     .withMessage("Vehicle type is required")
//     .isIn(["car", "cng", "hiace"])
//     .withMessage("Vehicle type must be one of car, cng, hiace"),
//   body("vehicleDetails.*.model").optional().trim(),
//   body("vehicleDetails.*.registrationNumber")
//     .trim()
//     .notEmpty()
//     .withMessage("Registration number is required"),
//   body("vehicleDetails.*.capacity")
//     .optional()
//     .isInt({ min: 1, max: 20 })
//     .withMessage("Capacity must be between 1 and 20"),
//   body("vehicleDetails.*.mainPhoto")
//     .trim()
//     .notEmpty()
//     .withMessage("Vehicle main photo is required"),
//   // NID
//   body("nid").notEmpty().withMessage("NID document is required"),
//   body("nid.number").trim().notEmpty().withMessage("NID number is required"),
//   body("nid.photos")
//     .isArray({ min: 2, max: 2 })
//     .withMessage("NID must have exactly 2 photos"),
//   body("nid.verified").optional().isBoolean(),
//   // Driving License
//   body("drivingLicense").notEmpty().withMessage("Driving license is required"),
//   body("drivingLicense.number")
//     .trim()
//     .notEmpty()
//     .withMessage("Driving license number is required"),
//   body("drivingLicense.photos")
//     .isArray({ min: 2, max: 2 })
//     .withMessage("Driving license must have exactly 2 photos"),
//   body("drivingLicense.verified").optional().isBoolean(),
//   // Optional extraDrivingLicense
//   body("extraDrivingLicense").optional(),
//   body("extraDrivingLicense.number")
//     .if(body("extraDrivingLicense").exists())
//     .trim()
//     .notEmpty()
//     .withMessage("Extra driving license number is required"),
//   body("extraDrivingLicense.photos")
//     .if(body("extraDrivingLicense").exists())
//     .isArray({ min: 2, max: 2 })
//     .withMessage("Extra driving license must have exactly 2 photos"),
//   body("extraDrivingLicense.verified").optional().isBoolean(),
// ];
// export const updateDriverRules = () => [
//   body("name").optional().trim().notEmpty(),
//   body("phoneNumber").optional().trim().notEmpty(),
//   body("photo").optional().trim(),
//   body("status")
//     .optional()
//     .isIn([
//       "pending",
//       "available",
//       "approved",
//       "rejected",
//       "suspended",
//       "on-ride",
//     ])
//     .withMessage("Invalid status"),
//   body("approvedByAdmin").optional().isBoolean(),
//   body("totalEarnings")
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage("Total earnings must be a positive number"),
//   // vehicleDetails array
//   body("vehicleDetails").optional().isArray(),
//   body("vehicleDetails.*.type")
//     .optional()
//     .trim()
//     .notEmpty()
//     .isIn(["car", "cng", "hiace"])
//     .withMessage("Vehicle type must be one of car, cng, hiace"),
//   body("vehicleDetails.*.model").optional().trim(),
//   body("vehicleDetails.*.registrationNumber").optional().trim(),
//   body("vehicleDetails.*.capacity").optional().isInt({ min: 1, max: 20 }),
//   body("vehicleDetails.*.mainPhoto").optional().trim(),
//   // NID & Licenses
//   body("nid.number").optional().trim().notEmpty(),
//   body("nid.photos").optional().isArray({ min: 2, max: 2 }),
//   body("nid.verified").optional().isBoolean(),
//   body("drivingLicense.number").optional().trim().notEmpty(),
//   body("drivingLicense.photos").optional().isArray({ min: 2, max: 2 }),
//   body("drivingLicense.verified").optional().isBoolean(),
// ];
// // driver.validation.ts
// // Validate driverId in request body for ride-start
// // export const rideStartBodyRules = (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction,
// // ): void => {
// //   const errors = validationResult(req);
// //   if (errors.isEmpty()) return next();
// //   const message = errors
// //     .array()
// //     .map((e) => e.msg)
// //     .join("; ");
// //   // Respond with consistent JSON
// //   res.status(400).json({
// //     success: false,
// //     message,
// //     errors: errors.array(), // optional: full details
// //   });
// // };
// // export const bookingIdParamRules = () =>
// //   param("bookingId").isMongoId().withMessage("Valid bookingId is required");
// // export const idParamRules = () =>
// //   param("id").isMongoId().withMessage("Valid id is required");
// // export const userIdParamRules = () =>
// //   param("userId").isMongoId().withMessage("Valid userId is required");
// // export const validate = (
// //   req: Request,
// //   _res: Response,
// //   next: NextFunction,
// // ): void => {
// //   const errors = validationResult(req);
// //   if (errors.isEmpty()) return next();
// //   const message = errors
// //     .array()
// //     .map((e) => e.msg)
// //     .join("; ");
// //   next(new ApiError(400, message));
// // };
// /* ================= PARAM VALIDATION ================= */
// // Validate bookingId param
// // Validate driverId param (already exists as idParamRules)
// export const idParamRules = () =>
//   param("id").isMongoId().withMessage("Valid id is required");
// export const userIdParamRules = () =>
//   param("userId").isMongoId().withMessage("Valid userId is required");
// export const bookingIdParamRules = () =>
//   param("bookingId").isMongoId().withMessage("Valid bookingId is required");
// /* ================= RIDE-START BODY VALIDATION ================= */
// export const rideStartRules = () => [
//   body("driverId").isMongoId().withMessage("Valid driverId is required"),
// ];
// /* ================= VALIDATE MIDDLEWARE ================= */
// export const validate = (req: Request, res: Response, next: NextFunction) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) return next();
//   const message = errors
//     .array()
//     .map((e) => e.msg)
//     .join("; ");
//   res.status(400).json({
//     success: false,
//     message,
//     errors: errors.array(),
//   });
// };
// driver.validation.ts
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// ______________________________________________________________________________
// import { body, param, validationResult } from "express-validator";
// import { Request, Response, NextFunction } from "express";
// import { ApiError } from "../../utils/ApiError";
// /* ================= DRIVER CREATE VALIDATION ================= */
// export const createDriverRules = () => [
//   body("userId").isMongoId().withMessage("Valid userId is required"),
//   body("name").trim().notEmpty().withMessage("Name is required"),
//   body("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
//   body("photo").optional().trim(),
//   body("vehicleDetails")
//     .isArray({ min: 1 })
//     .withMessage("vehicleDetails must be an array with at least 1 vehicle"),
//   body("vehicleDetails.*.type")
//     .trim()
//     .notEmpty()
//     .withMessage("Vehicle type is required")
//     .isIn(["car", "cng", "hiace"])
//     .withMessage("Vehicle type must be one of car, cng, hiace"),
//   body("vehicleDetails.*.model").optional().trim(),
//   body("vehicleDetails.*.registrationNumber")
//     .trim()
//     .notEmpty()
//     .withMessage("Registration number is required"),
//   body("vehicleDetails.*.capacity")
//     .optional()
//     .isInt({ min: 1, max: 20 })
//     .withMessage("Capacity must be between 1 and 20"),
//   body("vehicleDetails.*.mainPhoto")
//     .trim()
//     .notEmpty()
//     .withMessage("Vehicle main photo is required"),
//   // NID
//   body("nid").notEmpty().withMessage("NID document is required"),
//   body("nid.number").trim().notEmpty().withMessage("NID number is required"),
//   body("nid.photos")
//     .isArray({ min: 2, max: 2 })
//     .withMessage("NID must have exactly 2 photos"),
//   body("nid.verified").optional().isBoolean(),
//   // Driving License
//   body("drivingLicense").notEmpty().withMessage("Driving license is required"),
//   body("drivingLicense.number")
//     .trim()
//     .notEmpty()
//     .withMessage("Driving license number is required"),
//   body("drivingLicense.photos")
//     .isArray({ min: 2, max: 2 })
//     .withMessage("Driving license must have exactly 2 photos"),
//   body("drivingLicense.verified").optional().isBoolean(),
//   // Optional extraDrivingLicense
//   body("extraDrivingLicense").optional(),
//   body("extraDrivingLicense.number")
//     .if(body("extraDrivingLicense").exists())
//     .trim()
//     .notEmpty()
//     .withMessage("Extra driving license number is required"),
//   body("extraDrivingLicense.photos")
//     .if(body("extraDrivingLicense").exists())
//     .isArray({ min: 2, max: 2 })
//     .withMessage("Extra driving license must have exactly 2 photos"),
//   body("extraDrivingLicense.verified").optional().isBoolean(),
// ];
// /* ================= DRIVER UPDATE VALIDATION ================= */
// export const updateDriverRules = () => [
//   body("name").optional().trim().notEmpty(),
//   body("phoneNumber").optional().trim().notEmpty(),
//   body("photo").optional().trim(),
//   body("status")
//     .optional()
//     .isIn([
//       "pending",
//       "available",
//       "approved",
//       "rejected",
//       "suspended",
//       "on-ride",
//     ])
//     .withMessage("Invalid status"),
//   body("approvedByAdmin").optional().isBoolean(),
//   body("totalEarnings")
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage("Total earnings must be a positive number"),
//   // vehicleDetails array
//   body("vehicleDetails").optional().isArray(),
//   body("vehicleDetails.*.type")
//     .optional()
//     .trim()
//     .notEmpty()
//     .isIn(["car", "cng", "hiace"])
//     .withMessage("Vehicle type must be one of car, cng, hiace"),
//   body("vehicleDetails.*.model").optional().trim(),
//   body("vehicleDetails.*.registrationNumber").optional().trim(),
//   body("vehicleDetails.*.capacity").optional().isInt({ min: 1, max: 20 }),
//   body("vehicleDetails.*.mainPhoto").optional().trim(),
//   // NID & Licenses
//   body("nid.number").optional().trim().notEmpty(),
//   body("nid.photos").optional().isArray({ min: 2, max: 2 }),
//   body("nid.verified").optional().isBoolean(),
//   body("drivingLicense.number").optional().trim().notEmpty(),
//   body("drivingLicense.photos").optional().isArray({ min: 2, max: 2 }),
//   body("drivingLicense.verified").optional().isBoolean(),
// ];
// /* ================= PARAM VALIDATION ================= */
// export const idParamRules = () =>
//   param("id").isMongoId().withMessage("Valid id is required");
// export const userIdParamRules = () =>
//   param("userId").isMongoId().withMessage("Valid userId is required");
// export const bookingIdParamRules = () =>
//   param("bookingId").isMongoId().withMessage("Valid bookingId is required");
// /* ================= RIDE-START BODY VALIDATION ================= */
// export const rideStartRules = () => [
//   body("driverId").isMongoId().withMessage("Valid driverId is required"),
// ];
// /* ================= VALIDATE MIDDLEWARE ================= */
// export const validate = (req: Request, res: Response, next: NextFunction) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) return next();
//   const message = errors
//     .array()
//     .map((e) => e.msg)
//     .join("; ");
//   res.status(400).json({
//     success: false,
//     message,
//     errors: errors.array(),
//   });
// };
const express_validator_1 = require("express-validator");
/* =====================================================
   DRIVER CREATE VALIDATION
===================================================== */
const createDriverRules = () => [
    (0, express_validator_1.body)("userId").isMongoId().withMessage("Valid userId is required"),
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
    (0, express_validator_1.body)("photo").optional().trim(),
    (0, express_validator_1.body)("vehicleDetails")
        .isArray({ min: 1 })
        .withMessage("vehicleDetails must be an array with at least 1 vehicle"),
    (0, express_validator_1.body)("vehicleDetails.*.type")
        .trim()
        .notEmpty()
        .withMessage("Vehicle type is required")
        .isIn(["car", "cng", "hiace"])
        .withMessage("Vehicle type must be one of car, cng, hiace"),
    (0, express_validator_1.body)("vehicleDetails.*.model").optional().trim(),
    (0, express_validator_1.body)("vehicleDetails.*.registrationNumber")
        .trim()
        .notEmpty()
        .withMessage("Registration number is required"),
    (0, express_validator_1.body)("vehicleDetails.*.capacity")
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage("Capacity must be between 1 and 20"),
    (0, express_validator_1.body)("vehicleDetails.*.mainPhoto")
        .trim()
        .notEmpty()
        .withMessage("Vehicle main photo is required"),
    // NID
    (0, express_validator_1.body)("nid").notEmpty().withMessage("NID document is required"),
    (0, express_validator_1.body)("nid.number").trim().notEmpty().withMessage("NID number is required"),
    (0, express_validator_1.body)("nid.photos")
        .isArray({ min: 2, max: 2 })
        .withMessage("NID must have exactly 2 photos"),
    (0, express_validator_1.body)("nid.verified").optional().isBoolean(),
    // Driving License
    (0, express_validator_1.body)("drivingLicense").notEmpty().withMessage("Driving license is required"),
    (0, express_validator_1.body)("drivingLicense.number")
        .trim()
        .notEmpty()
        .withMessage("Driving license number is required"),
    (0, express_validator_1.body)("drivingLicense.photos")
        .isArray({ min: 2, max: 2 })
        .withMessage("Driving license must have exactly 2 photos"),
    (0, express_validator_1.body)("drivingLicense.verified").optional().isBoolean(),
    // Optional extraDrivingLicense
    (0, express_validator_1.body)("extraDrivingLicense").optional(),
    (0, express_validator_1.body)("extraDrivingLicense.number")
        .if((0, express_validator_1.body)("extraDrivingLicense").exists())
        .trim()
        .notEmpty()
        .withMessage("Extra driving license number is required"),
    (0, express_validator_1.body)("extraDrivingLicense.photos")
        .if((0, express_validator_1.body)("extraDrivingLicense").exists())
        .isArray({ min: 2, max: 2 })
        .withMessage("Extra driving license must have exactly 2 photos"),
    (0, express_validator_1.body)("extraDrivingLicense.verified").optional().isBoolean(),
];
exports.createDriverRules = createDriverRules;
/* =====================================================
   DRIVER UPDATE VALIDATION
===================================================== */
const updateDriverRules = () => [
    (0, express_validator_1.body)("name").optional().trim().notEmpty(),
    (0, express_validator_1.body)("phoneNumber").optional().trim().notEmpty(),
    (0, express_validator_1.body)("photo").optional().trim(),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn([
        "pending",
        "available",
        "approved",
        "rejected",
        "suspended",
        "on-ride",
    ])
        .withMessage("Invalid status"),
    (0, express_validator_1.body)("approvedByAdmin").optional().isBoolean(),
    (0, express_validator_1.body)("totalEarnings")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Total earnings must be a positive number"),
    // vehicleDetails array
    (0, express_validator_1.body)("vehicleDetails").optional().isArray(),
    (0, express_validator_1.body)("vehicleDetails.*.type")
        .optional()
        .trim()
        .notEmpty()
        .isIn(["car", "cng", "hiace"])
        .withMessage("Vehicle type must be one of car, cng, hiace"),
    (0, express_validator_1.body)("vehicleDetails.*.model").optional().trim(),
    (0, express_validator_1.body)("vehicleDetails.*.registrationNumber").optional().trim(),
    (0, express_validator_1.body)("vehicleDetails.*.capacity").optional().isInt({ min: 1, max: 20 }),
    (0, express_validator_1.body)("vehicleDetails.*.mainPhoto").optional().trim(),
    // NID
    (0, express_validator_1.body)("nid.number").optional().trim().notEmpty(),
    (0, express_validator_1.body)("nid.photos").optional().isArray({ min: 2, max: 2 }),
    (0, express_validator_1.body)("nid.verified").optional().isBoolean(),
    // Driving License
    (0, express_validator_1.body)("drivingLicense.number").optional().trim().notEmpty(),
    (0, express_validator_1.body)("drivingLicense.photos").optional().isArray({ min: 2, max: 2 }),
    (0, express_validator_1.body)("drivingLicense.verified").optional().isBoolean(),
];
exports.updateDriverRules = updateDriverRules;
/* =====================================================
   PARAM VALIDATION
===================================================== */
const idParamRules = () => (0, express_validator_1.param)("id").isMongoId().withMessage("Valid id is required");
exports.idParamRules = idParamRules;
const userIdParamRules = () => (0, express_validator_1.param)("userId").isMongoId().withMessage("Valid userId is required");
exports.userIdParamRules = userIdParamRules;
const driverIdParamRules = () => (0, express_validator_1.param)("driverId").isMongoId().withMessage("Valid driverId is required");
exports.driverIdParamRules = driverIdParamRules;
const bookingIdParamRules = () => (0, express_validator_1.param)("bookingId").isMongoId().withMessage("Valid bookingId is required");
exports.bookingIdParamRules = bookingIdParamRules;
/* =====================================================
   VALIDATION RESULT HANDLER
===================================================== */
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const message = errors
        .array()
        .map((e) => e.msg)
        .join("; ");
    res.status(400).json({
        success: false,
        message,
        errors: errors.array(),
    });
};
exports.validate = validate;
//# sourceMappingURL=driver.validation.js.map