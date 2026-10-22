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
exports.Driver = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const vehicleSchema = new mongoose_1.Schema({
    type: { type: String, required: true, enum: ["car", "cng", "hiace"] },
    model: { type: String },
    registrationNumber: {
        type: String,
        required: true,
    },
    capacity: { type: Number, default: 4, min: 1, max: 20 },
    mainPhoto: { type: String, required: true },
    photos: { type: [String], default: [] },
}, { _id: false });
const documentSchema = new mongoose_1.Schema({
    number: { type: String, required: true },
    photos: {
        type: [String],
        required: true,
        validate: [
            (val) => val.length === 2,
            "Must provide exactly 2 photos",
        ],
    },
    verified: { type: Boolean, default: false },
}, { _id: false });
const driverSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    photo: { type: String },
    status: {
        type: String,
        enum: [
            "pending",
            "available",
            "approved",
            "rejected",
            "suspended",
            "on-ride",
        ],
        default: "pending",
        required: true,
    },
    approvedByAdmin: { type: Boolean, default: false },
    vehicleDetails: { type: [vehicleSchema], required: true },
    nid: { type: documentSchema, required: true },
    drivingLicense: { type: documentSchema, required: true },
    totalEarnings: { type: Number, default: 0, min: 0 },
    extraDrivingLicense: { type: documentSchema },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
driverSchema.virtual("activeVehicle").get(function () {
    return this.vehicleDetails[0] || null;
});
driverSchema.virtual("activeVehiclePhoto").get(function () {
    return this.vehicleDetails[0]?.mainPhoto || null;
});
exports.Driver = mongoose_1.default.model("Driver", driverSchema);
//# sourceMappingURL=driver.model.js.map