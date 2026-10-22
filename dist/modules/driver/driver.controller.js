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
exports.deleteVehiclePhoto = exports.rideStart = exports.updateVehicleMainPhoto = exports.addVehiclePhoto = exports.getDriverByUserEmail = exports.reject = exports.approveDriver = exports.update = exports.getRejectedDrivers = exports.suspendDriver = exports.getSuspendedDrivers = exports.getAvailableDrivers = exports.getOnRideDrivers = exports.getPendingDrivers = exports.list = exports.getByUserId = exports.getById = exports.create = void 0;
const mongoose_1 = require("mongoose");
const driverService = __importStar(require("./driver.service"));
const ApiError_1 = require("../../utils/ApiError");
const driver_model_1 = require("./driver.model");
const driver_service_1 = require("./driver.service");
const driver_service_2 = require("./driver.service");
const driver_service_3 = require("./driver.service");
const user_model_1 = require("../user/user.model");
const booking_model_1 = require("../booking/booking.model");
// Create driver
const create = async (req, res, next) => {
    try {
        const data = req.body;
        const driver = await driverService.createDriver(data);
        res.status(201).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.create = create;
// Get driver by ID
const getById = async (req, res, next) => {
    try {
        const idParam = req.params.id;
        // Ensure id is a string
        if (!idParam || Array.isArray(idParam)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const id = new mongoose_1.Types.ObjectId(idParam);
        const driver = await driverService.findDriverById(id);
        if (!driver)
            throw new ApiError_1.ApiError(404, "Driver not found");
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.getById = getById;
// Get driver by User ID
const getByUserId = async (req, res, next) => {
    try {
        const userIdParam = req.params.userId;
        // Ensure userId is a single string
        if (!userIdParam || Array.isArray(userIdParam)) {
            throw new ApiError_1.ApiError(400, "Invalid user ID");
        }
        const userId = new mongoose_1.Types.ObjectId(userIdParam);
        const driver = await driverService.findDriverByUserId(userId);
        if (!driver)
            throw new ApiError_1.ApiError(404, "Driver not found");
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.getByUserId = getByUserId;
// List drivers with optional status filter
const list = async (req, res, next) => {
    try {
        const status = req.query.status;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const drivers = await driverService.listDrivers({ status, page, limit });
        res.status(200).json({ success: true, data: drivers });
    }
    catch (e) {
        next(e);
    }
};
exports.list = list;
// get only pending drivers
const getPendingDrivers = async (req, res, next) => {
    try {
        const drivers = await driverService.listDrivers({
            status: "pending",
        });
        res.status(200).json({ success: true, data: drivers });
    }
    catch (e) {
        next(e);
    }
};
exports.getPendingDrivers = getPendingDrivers;
const getOnRideDrivers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const drivers = await (0, driver_service_2.listOnRideDrivers)({ page, limit });
        res.status(200).json({ success: true, data: drivers });
    }
    catch (err) {
        next(err);
    }
};
exports.getOnRideDrivers = getOnRideDrivers;
// GET drivers by status "available"
const getAvailableDrivers = async (req, res, next) => {
    try {
        const drivers = await driver_model_1.Driver.find({ status: "available" })
            .populate("userId", "email")
            .populate("activeVehicle");
        res.status(200).json({
            status: "success",
            results: drivers.length,
            data: drivers,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};
exports.getAvailableDrivers = getAvailableDrivers;
const getSuspendedDrivers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const drivers = await (0, driver_service_1.listSuspendedDrivers)({ page, limit });
        res.status(200).json({ success: true, data: drivers });
    }
    catch (err) {
        next(err);
    }
};
exports.getSuspendedDrivers = getSuspendedDrivers;
// Suspend a driver (change status from "available" to "suspended")
const suspendDriver = async (req, res, next) => {
    try {
        const driverIdParam = req.params.id;
        // Ensure driverIdParam is a single string
        if (!driverIdParam || Array.isArray(driverIdParam)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const driverId = new mongoose_1.Types.ObjectId(driverIdParam);
        const driver = await driver_model_1.Driver.findById(driverId);
        if (!driver)
            throw new ApiError_1.ApiError(404, "Driver not found");
        driver.status = "suspended";
        await driver.save();
        res.status(200).json({ success: true, data: driver });
    }
    catch (err) {
        next(err);
    }
};
exports.suspendDriver = suspendDriver;
const getRejectedDrivers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const drivers = await (0, driver_service_3.listRejectedDrivers)({ page, limit });
        res.status(200).json({ success: true, data: drivers });
    }
    catch (err) {
        next(err);
    }
};
exports.getRejectedDrivers = getRejectedDrivers;
// Update driver
const update = async (req, res, next) => {
    try {
        const paramId = req.params.id;
        if (!paramId || Array.isArray(paramId)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const id = new mongoose_1.Types.ObjectId(paramId);
        const data = req.body;
        const driver = await driverService.updateDriver(id, data);
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.update = update;
// Approve driver
const approveDriver = async (req, res, next) => {
    try {
        const paramId = req.params.id;
        if (!paramId || Array.isArray(paramId)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const id = new mongoose_1.Types.ObjectId(paramId);
        const driver = await driver_model_1.Driver.findById(id).populate("userId");
        if (!driver)
            throw new ApiError_1.ApiError(404, "Driver not found");
        driver.status = "available";
        driver.approvedByAdmin = true;
        await driver.save();
        // Handle populated user
        let user;
        if (driver.userId && typeof driver.userId !== "string") {
            user = driver.userId; // populated document
        }
        else {
            user = await user_model_1.User.findById(driver.userId);
        }
        if (user && user.role === "rider") {
            user.role = "driver";
            await user.save();
        }
        const populatedDriver = (await driver_model_1.Driver.findById(id)
            .populate("userId", "name email role phone photo")
            .lean());
        if (populatedDriver?.vehicleDetails?.length > 0) {
            populatedDriver.activeVehicle = populatedDriver.vehicleDetails[0];
            populatedDriver.activeVehiclePhoto =
                populatedDriver.vehicleDetails[0].mainPhoto;
        }
        else {
            populatedDriver.activeVehicle = null;
            populatedDriver.activeVehiclePhoto = null;
        }
        res.status(200).json({
            success: true,
            data: populatedDriver,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.approveDriver = approveDriver;
// Reject driver
const reject = async (req, res, next) => {
    try {
        const paramId = req.params.id;
        if (!paramId || Array.isArray(paramId)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const id = new mongoose_1.Types.ObjectId(paramId);
        const driver = await driverService.rejectDriver(id);
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.reject = reject;
/* ================== GET DRIVER BY USER EMAIL ================== */
const getDriverByUserEmail = async (req, res, next) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string") {
            throw new ApiError_1.ApiError(400, "Valid email is required");
        }
        const user = await user_model_1.User.findOne({ email: email.trim() });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        const driver = await driver_model_1.Driver.findOne({ userId: user._id })
            .populate("userId", "name email role status")
            .populate("vehicleDetails") // optional, depending on your schema
            .exec();
        if (!driver) {
            return res
                .status(404)
                .json({ success: false, message: "Driver not found" });
        }
        return res.status(200).json({ success: true, data: driver });
    }
    catch (error) {
        next(error);
    }
};
exports.getDriverByUserEmail = getDriverByUserEmail;
// Vehicle photo management
const addVehiclePhoto = async (req, res, next) => {
    try {
        const paramId = req.params.id;
        if (!paramId || Array.isArray(paramId)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const driverId = new mongoose_1.Types.ObjectId(paramId);
        const { vehicleIndex, photoUrl } = req.body;
        const driver = await driverService.addVehiclePhoto(driverId, vehicleIndex, photoUrl);
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.addVehiclePhoto = addVehiclePhoto;
const updateVehicleMainPhoto = async (req, res, next) => {
    try {
        const paramId = req.params.id;
        if (!paramId || Array.isArray(paramId)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const driverId = new mongoose_1.Types.ObjectId(paramId);
        const { vehicleIndex, mainPhoto } = req.body;
        const driver = await driverService.updateVehicleMainPhoto(driverId, vehicleIndex, mainPhoto);
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.updateVehicleMainPhoto = updateVehicleMainPhoto;
// export const rideStart = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const driverId = new Types.ObjectId(req.body.driverId); // from frontend
//     const bookingId = new Types.ObjectId(req.params.bookingId);
//     const data = await driverService.startRide(driverId, bookingId);
//     res.json({
//       success: true,
//       message: "Ride started successfully",
//       data,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// PATCH /drivers/:driverId/ride-start/:bookingId
const rideStart = async (req, res, next) => {
    console.log("🚀 rideStart route hit!", req.params);
    try {
        let { driverId, bookingId } = req.params;
        console.log("driverId:", driverId, "bookingId:", bookingId);
        // Narrow type: ensure string
        if (Array.isArray(driverId))
            driverId = driverId[0];
        if (Array.isArray(bookingId))
            bookingId = bookingId[0];
        // Validate ObjectId
        if (!mongoose_1.Types.ObjectId.isValid(driverId))
            throw new ApiError_1.ApiError(400, "Invalid driverId");
        if (!mongoose_1.Types.ObjectId.isValid(bookingId))
            throw new ApiError_1.ApiError(400, "Invalid bookingId");
        const booking = await booking_model_1.Booking.findById(bookingId);
        if (!booking)
            return res
                .status(404)
                .json({ success: false, message: "Booking not found" });
        const driver = await driver_model_1.Driver.findById(driverId);
        if (!driver)
            return res
                .status(404)
                .json({ success: false, message: "Driver not found" });
        if (!booking.driverId || !booking.driverId.equals(driver._id)) {
            return res.status(403).json({
                success: false,
                message: "This booking is not assigned to this driver",
            });
        }
        if (booking.status === "on_trip") {
            return res
                .status(400)
                .json({ success: false, message: "Ride already started" });
        }
        booking.pickStatus = "picked";
        booking.status = "on_trip";
        booking.pickupTime = new Date();
        await booking.save();
        driver.status = "on-ride";
        await driver.save();
        return res.status(200).json({
            success: true,
            message: "Ride started successfully",
            data: {
                bookingId: booking._id,
                driverId: driver._id,
                pickStatus: booking.pickStatus,
                bookingStatus: booking.status,
                pickupTime: booking.pickupTime,
                driverStatus: driver.status,
            },
        });
    }
    catch (error) {
        console.error("RIDE START ERROR:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error hahahahahahahahha",
        });
    }
};
exports.rideStart = rideStart;
const deleteVehiclePhoto = async (req, res, next) => {
    try {
        const paramId = req.params.id;
        if (!paramId || Array.isArray(paramId)) {
            throw new ApiError_1.ApiError(400, "Invalid driver ID");
        }
        const driverId = new mongoose_1.Types.ObjectId(paramId);
        const { vehicleIndex, photoIndex } = req.body;
        const driver = await driverService.deleteVehiclePhoto(driverId, vehicleIndex, photoIndex);
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteVehiclePhoto = deleteVehiclePhoto;
//# sourceMappingURL=driver.controller.js.map