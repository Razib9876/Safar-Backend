import { Router } from "express";
import * as driverController from "./driver.controller";
import {
  createDriverRules,
  updateDriverRules,
  idParamRules,
  userIdParamRules,
  validate,
} from "./driver.validation";

const router = Router();

// Create driver
router.post("/create", createDriverRules(), validate, driverController.create);

router.get("/pending", driverController.getPendingDrivers);
router.get("/available", driverController.getAvailableDrivers);

router.get("/suspended", driverController.getSuspendedDrivers);

router.get("/rejected", driverController.getRejectedDrivers);

router.get("/on-ride", driverController.getOnRideDrivers);

router.get("/by-email", driverController.getDriverByUserEmail);

router.get(
  "/user/:userId",
  userIdParamRules(),
  validate,
  driverController.getByUserId,
);

router.get("/", driverController.list);

router.patch(
  "/:id",
  idParamRules(),
  updateDriverRules(),
  validate,
  driverController.update,
);

router.patch("/:id/approve", driverController.approveDriver);
router.patch("/:id/reject", idParamRules(), validate, driverController.reject);

router.patch(
  "/:id/suspend",
  idParamRules(),
  validate,
  driverController.suspendDriver,
);

router.post(
  "/:id/vehicle/photo/add",
  idParamRules(),
  validate,
  driverController.addVehiclePhoto,
);
router.patch(
  "/:id/vehicle/photo/main",
  idParamRules(),
  validate,
  driverController.updateVehicleMainPhoto,
);
router.delete(
  "/:id/vehicle/photo",
  idParamRules(),
  validate,
  driverController.deleteVehiclePhoto,
);

router.get("/:id", idParamRules(), validate, driverController.getById);

export default router;
