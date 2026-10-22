"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehiclePhoto = exports.updateVehicleMainPhoto = exports.listOnRideDrivers = exports.listRejectedDrivers = exports.addVehiclePhoto = exports.listSuspendedDrivers = exports.rejectDriver = exports.startRide = exports.approveDriver = exports.updateDriver = exports.listDrivers = exports.findDriverByUserId = exports.findDriverById = exports.createDriver = void 0;
const driver_model_1 = require("./driver.model");
const ApiError_1 = require("../../utils/ApiError");
const booking_model_1 = require("../booking/booking.model");
const userFields = "name email phone role photo";
const createDriver = async (data) => {
    const driver = await driver_model_1.Driver.create(data);
    return (0, exports.findDriverById)(driver._id);
};
exports.createDriver = createDriver;
const findDriverById = async (id) => {
    return driver_model_1.Driver.findById(id)
        .populate("userId", userFields)
        .populate("updatedBy", userFields);
};
exports.findDriverById = findDriverById;
const findDriverByUserId = async (userId) => {
    return driver_model_1.Driver.findOne({ userId })
        .populate("userId", userFields)
        .populate("updatedBy", userFields);
};
exports.findDriverByUserId = findDriverByUserId;
const listDrivers = async (query) => {
    const filter = {};
    if (query.status)
        filter.status = query.status;
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;
    const drivers = await driver_model_1.Driver.find(filter)
        .populate("userId", userFields)
        .populate("updatedBy", userFields)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return drivers;
};
exports.listDrivers = listDrivers;
const updateDriver = async (id, data) => {
    const driver = await driver_model_1.Driver.findByIdAndUpdate(id, { $set: data }, { new: true })
        .populate("userId", userFields)
        .populate("updatedBy", userFields);
    if (!driver)
        throw new ApiError_1.ApiError(404, "Driver not found");
    return driver;
};
exports.updateDriver = updateDriver;
// Status management
const approveDriver = async (id) => {
    const driver = await driver_model_1.Driver.findById(id);
    if (!driver)
        throw new ApiError_1.ApiError(404, "Driver not found");
    // Ensure status is a string before using includes
    const currentStatus = driver.status || ""; // fallback to empty string
    if (["pending", "rejected", "suspended"].includes(currentStatus)) {
        driver.status = "available";
        await driver.save();
    }
    else {
        throw new ApiError_1.ApiError(400, `Cannot approve driver from status ${currentStatus}`);
    }
    return (0, exports.findDriverById)(id);
};
exports.approveDriver = approveDriver;
/**
 * Driver starts the ride for a booking
 */
const startRide = async (driverId, bookingId) => {
    const booking = await booking_model_1.Booking.findById(bookingId);
    if (!booking)
        throw new ApiError_1.ApiError(404, "Booking not found");
    if (!booking.driverId || !booking.driverId.equals(driverId)) {
        throw new ApiError_1.ApiError(403, "This booking is not assigned to this driver");
    }
    if (booking.status === "on_trip")
        throw new ApiError_1.ApiError(400, "Ride already started");
    booking.pickStatus = "picked";
    booking.status = "on_trip";
    booking.pickupTime = new Date();
    await booking.save();
    const driver = await driver_model_1.Driver.findById(driverId);
    if (!driver)
        throw new ApiError_1.ApiError(404, "Driver not found");
    driver.status = "on-ride";
    await driver.save();
    return { booking, driver };
};
exports.startRide = startRide;
const rejectDriver = async (id) => {
    const driver = await driver_model_1.Driver.findById(id);
    if (!driver)
        throw new ApiError_1.ApiError(404, "Driver not found");
    const currentStatus = driver.status || ""; // fallback to empty string
    if (["available", "suspended", "pending"].includes(currentStatus)) {
        driver.status = "rejected";
        await driver.save();
    }
    else {
        throw new ApiError_1.ApiError(400, `Cannot reject driver from status ${currentStatus}`);
    }
    return (0, exports.findDriverById)(id);
};
exports.rejectDriver = rejectDriver;
const listSuspendedDrivers = async (query) => {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;
    const drivers = await driver_model_1.Driver.find({ status: "suspended" })
        .populate("userId", "name email phone role photo")
        .populate("updatedBy", "name email phone role photo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return drivers;
};
exports.listSuspendedDrivers = listSuspendedDrivers;
const addVehiclePhoto = async (driverId, vehicleIndex, photoUrl) => {
    const driver = await driver_model_1.Driver.findById(driverId);
    if (!driver)
        throw new ApiError_1.ApiError(404, "Driver not found");
    const vehicle = driver.vehicleDetails[vehicleIndex];
    if (!vehicle)
        throw new ApiError_1.ApiError(400, "Vehicle not found");
    // Make sure photos array exists
    if (!vehicle.photos)
        vehicle.photos = [];
    vehicle.photos.push(photoUrl);
    await driver.save();
    return (0, exports.findDriverById)(driverId);
};
exports.addVehiclePhoto = addVehiclePhoto;
// List drivers with status "rejected"
const listRejectedDrivers = async (query) => {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;
    const drivers = await driver_model_1.Driver.find({ status: "rejected" })
        .populate("userId", "name email phone role photo")
        .populate("updatedBy", "name email phone role photo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return drivers;
};
exports.listRejectedDrivers = listRejectedDrivers;
// List drivers with status "on-ride"
const listOnRideDrivers = async (query) => {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;
    const drivers = await driver_model_1.Driver.find({ status: "on-ride" })
        .populate("userId", "name email phone role photo")
        .populate("updatedBy", "name email phone role photo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return drivers;
};
exports.listOnRideDrivers = listOnRideDrivers;
const updateVehicleMainPhoto = async (driverId, vehicleIndex, photoUrl) => {
    const driver = await driver_model_1.Driver.findById(driverId);
    if (!driver)
        throw new ApiError_1.ApiError(404, "Driver not found");
    if (!driver.vehicleDetails[vehicleIndex])
        throw new ApiError_1.ApiError(400, "Vehicle not found");
    driver.vehicleDetails[vehicleIndex].mainPhoto = photoUrl;
    await driver.save();
    return (0, exports.findDriverById)(driverId);
};
exports.updateVehicleMainPhoto = updateVehicleMainPhoto;
const deleteVehiclePhoto = async (driverId, vehicleIndex, photoIndex) => {
    const driver = await driver_model_1.Driver.findById(driverId);
    if (!driver)
        throw new ApiError_1.ApiError(404, "Driver not found");
    const vehicle = driver.vehicleDetails[vehicleIndex];
    if (!vehicle)
        throw new ApiError_1.ApiError(400, "Vehicle not found");
    // Ensure photos array exists
    if (!vehicle.photos || vehicle.photos.length <= photoIndex) {
        throw new ApiError_1.ApiError(400, "Photo not found");
    }
    // Remove the photo
    vehicle.photos.splice(photoIndex, 1);
    await driver.save();
    return (0, exports.findDriverById)(driverId);
};
exports.deleteVehiclePhoto = deleteVehiclePhoto;
//# sourceMappingURL=driver.service.js.map