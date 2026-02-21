"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectDriver = exports.approveDriver = exports.listDrivers = exports.updateDriver = exports.findDriverByUserId = exports.findDriverById = exports.createDriver = void 0;
const driver_model_1 = require("./driver.model");
const ApiError_1 = require("../../utils/ApiError");
const createDriver = async (data) => {
    const existing = await driver_model_1.Driver.findOne({ userId: data.userId });
    if (existing)
        throw new ApiError_1.ApiError(400, 'Driver profile already exists for this user');
    const driver = await driver_model_1.Driver.create({
        ...data,
        status: 'pending',
        approvedByAdmin: false,
    });
    return driver;
};
exports.createDriver = createDriver;
const findDriverById = async (id) => {
    return driver_model_1.Driver.findById(id).populate('userId', 'name email');
};
exports.findDriverById = findDriverById;
const findDriverByUserId = async (userId) => {
    return driver_model_1.Driver.findOne({ userId }).populate('userId', 'name email');
};
exports.findDriverByUserId = findDriverByUserId;
const updateDriver = async (id, data) => {
    return driver_model_1.Driver.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('userId', 'name email');
};
exports.updateDriver = updateDriver;
const listDrivers = async (query) => {
    const filter = {};
    if (query.status)
        filter.status = query.status;
    return driver_model_1.Driver.find(filter).populate('userId', 'name email').sort({ createdAt: -1 });
};
exports.listDrivers = listDrivers;
const approveDriver = async (id) => {
    return driver_model_1.Driver.findByIdAndUpdate(id, { $set: { status: 'approved', approvedByAdmin: true } }, { new: true }).populate('userId', 'name email');
};
exports.approveDriver = approveDriver;
const rejectDriver = async (id) => {
    return driver_model_1.Driver.findByIdAndUpdate(id, { $set: { status: 'rejected' } }, { new: true }).populate('userId', 'name email');
};
exports.rejectDriver = rejectDriver;
//# sourceMappingURL=driver.service.js.map