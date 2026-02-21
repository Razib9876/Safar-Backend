import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/ApiError";

export const createDriverRules = () => [
  body("userId").isMongoId().withMessage("Valid userId is required"),
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
  body("photo").optional().trim(),

  body("vehicleDetails")
    .isArray({ min: 1 })
    .withMessage("vehicleDetails must be an array with at least 1 vehicle"),
  body("vehicleDetails.*.type")
    .trim()
    .notEmpty()
    .withMessage("Vehicle type is required")
    .isIn(["car", "cng", "hiace"])
    .withMessage("Vehicle type must be one of car, cng, hiace"),
  body("vehicleDetails.*.model").optional().trim(),
  body("vehicleDetails.*.registrationNumber")
    .trim()
    .notEmpty()
    .withMessage("Registration number is required"),
  body("vehicleDetails.*.capacity")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Capacity must be between 1 and 20"),
  body("vehicleDetails.*.mainPhoto")
    .trim()
    .notEmpty()
    .withMessage("Vehicle main photo is required"),

  // NID
  body("nid").notEmpty().withMessage("NID document is required"),
  body("nid.number").trim().notEmpty().withMessage("NID number is required"),
  body("nid.photos")
    .isArray({ min: 2, max: 2 })
    .withMessage("NID must have exactly 2 photos"),
  body("nid.verified").optional().isBoolean(),

  // Driving License
  body("drivingLicense").notEmpty().withMessage("Driving license is required"),
  body("drivingLicense.number")
    .trim()
    .notEmpty()
    .withMessage("Driving license number is required"),
  body("drivingLicense.photos")
    .isArray({ min: 2, max: 2 })
    .withMessage("Driving license must have exactly 2 photos"),
  body("drivingLicense.verified").optional().isBoolean(),

  // Optional extraDrivingLicense
  body("extraDrivingLicense").optional(),
  body("extraDrivingLicense.number")
    .if(body("extraDrivingLicense").exists())
    .trim()
    .notEmpty()
    .withMessage("Extra driving license number is required"),
  body("extraDrivingLicense.photos")
    .if(body("extraDrivingLicense").exists())
    .isArray({ min: 2, max: 2 })
    .withMessage("Extra driving license must have exactly 2 photos"),
  body("extraDrivingLicense.verified").optional().isBoolean(),
];

export const updateDriverRules = () => [
  body("name").optional().trim().notEmpty(),
  body("phoneNumber").optional().trim().notEmpty(),
  body("photo").optional().trim(),
  body("status")
    .optional()
    .isIn(["pending", "approved", "rejected", "suspended", "on-ride"])
    .withMessage("Invalid status"),
  body("approvedByAdmin").optional().isBoolean(),

  // vehicleDetails array
  body("vehicleDetails").optional().isArray(),
  body("vehicleDetails.*.type")
    .optional()
    .trim()
    .notEmpty()
    .isIn(["car", "cng", "hiace"])
    .withMessage("Vehicle type must be one of car, cng, hiace"),
  body("vehicleDetails.*.model").optional().trim(),
  body("vehicleDetails.*.registrationNumber").optional().trim(),
  body("vehicleDetails.*.capacity").optional().isInt({ min: 1, max: 20 }),
  body("vehicleDetails.*.mainPhoto").optional().trim(),

  // NID & Licenses
  body("nid.number").optional().trim().notEmpty(),
  body("nid.photos").optional().isArray({ min: 2, max: 2 }),
  body("nid.verified").optional().isBoolean(),

  body("drivingLicense.number").optional().trim().notEmpty(),
  body("drivingLicense.photos").optional().isArray({ min: 2, max: 2 }),
  body("drivingLicense.verified").optional().isBoolean(),
];

export const idParamRules = () =>
  param("id").isMongoId().withMessage("Valid id is required");
export const userIdParamRules = () =>
  param("userId").isMongoId().withMessage("Valid userId is required");

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
