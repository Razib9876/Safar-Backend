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
exports.reject = exports.approve = exports.update = exports.list = exports.getByUserId = exports.getById = exports.create = void 0;
const mongoose_1 = require("mongoose");
const driverService = __importStar(require("./driver.service"));
const ApiError_1 = require("../../utils/ApiError");
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
const getById = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const driver = await driverService.findDriverById(id);
        if (!driver)
            throw new ApiError_1.ApiError(404, 'Driver not found');
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.getById = getById;
const getByUserId = async (req, res, next) => {
    try {
        const userId = new mongoose_1.Types.ObjectId(req.params.userId);
        const driver = await driverService.findDriverByUserId(userId);
        if (!driver)
            throw new ApiError_1.ApiError(404, 'Driver not found');
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.getByUserId = getByUserId;
const list = async (req, res, next) => {
    try {
        const status = req.query.status;
        const drivers = await driverService.listDrivers({ status });
        res.status(200).json({ success: true, data: drivers });
    }
    catch (e) {
        next(e);
    }
};
exports.list = list;
const update = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const data = req.body;
        const driver = await driverService.updateDriver(id, data);
        if (!driver)
            throw new ApiError_1.ApiError(404, 'Driver not found');
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.update = update;
const approve = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const driver = await driverService.approveDriver(id);
        if (!driver)
            throw new ApiError_1.ApiError(404, 'Driver not found');
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.approve = approve;
const reject = async (req, res, next) => {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        const driver = await driverService.rejectDriver(id);
        if (!driver)
            throw new ApiError_1.ApiError(404, 'Driver not found');
        res.status(200).json({ success: true, data: driver });
    }
    catch (e) {
        next(e);
    }
};
exports.reject = reject;
//# sourceMappingURL=driver.controller.js.map