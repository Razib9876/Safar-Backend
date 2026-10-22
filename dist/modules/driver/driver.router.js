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
const express_1 = require("express");
const driverController = __importStar(require("./driver.controller"));
const driver_validation_1 = require("./driver.validation");
const driver_validation_2 = require("./driver.validation");
const booking_validation_1 = require("../booking/booking.validation");
const router = (0, express_1.Router)();
router.patch("/:driverId/ride-start/:bookingId", (0, booking_validation_1.driverIdParamRules)(), (0, driver_validation_2.bookingIdParamRules)(), driver_validation_1.validate, driverController.rideStart);
// Create driver
router.post("/create", (0, driver_validation_1.createDriverRules)(), driver_validation_1.validate, driverController.create);
router.get("/pending", driverController.getPendingDrivers);
router.get("/available", driverController.getAvailableDrivers);
router.get("/suspended", driverController.getSuspendedDrivers);
router.get("/rejected", driverController.getRejectedDrivers);
router.get("/on-ride", driverController.getOnRideDrivers);
router.get("/by-email", driverController.getDriverByUserEmail);
router.get("/user/:userId", (0, driver_validation_1.userIdParamRules)(), driver_validation_1.validate, driverController.getByUserId);
router.get("/", driverController.list);
router.patch("/:id", (0, driver_validation_1.idParamRules)(), (0, driver_validation_1.updateDriverRules)(), driver_validation_1.validate, driverController.update);
router.patch("/:id/approve", driverController.approveDriver);
router.patch("/:id/reject", (0, driver_validation_1.idParamRules)(), driver_validation_1.validate, driverController.reject);
router.patch("/:id/suspend", (0, driver_validation_1.idParamRules)(), driver_validation_1.validate, driverController.suspendDriver);
router.post("/:id/vehicle/photo/add", (0, driver_validation_1.idParamRules)(), driver_validation_1.validate, driverController.addVehiclePhoto);
router.patch("/:id/vehicle/photo/main", (0, driver_validation_1.idParamRules)(), driver_validation_1.validate, driverController.updateVehicleMainPhoto);
router.delete("/:id/vehicle/photo", (0, driver_validation_1.idParamRules)(), driver_validation_1.validate, driverController.deleteVehiclePhoto);
// ...
router.get("/:id", (0, driver_validation_1.idParamRules)(), driver_validation_1.validate, driverController.getById);
exports.default = router;
//# sourceMappingURL=driver.router.js.map