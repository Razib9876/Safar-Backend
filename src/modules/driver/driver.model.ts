import mongoose, { Schema } from "mongoose";
import { IDriverDoc, IVehicleDetails, IDocument } from "./driver.interface";

const vehicleSchema = new Schema<IVehicleDetails>(
  {
    type: { type: String, required: true, enum: ["car", "cng", "hiace"] },
    model: { type: String },
    registrationNumber: {
      type: String,
      required: true,
    },
    capacity: { type: Number, default: 4, min: 1, max: 20 },
    mainPhoto: { type: String, required: true },
    photos: { type: [String], default: [] },
  },
  { _id: false },
);

const documentSchema = new Schema<IDocument>(
  {
    number: { type: String, required: true },
    photos: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length === 2,
        "Must provide exactly 2 photos",
      ],
    },
    verified: { type: Boolean, default: false },
  },
  { _id: false },
);

const driverSchema = new Schema<IDriverDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    photo: { type: String },
    status: {
      type: String,
      enum: ["pending", "available", "rejected", "suspended", "on-ride"],
      default: "pending",
      required: true,
    },
    approvedByAdmin: { type: Boolean, default: false },
    vehicleDetails: { type: [vehicleSchema], required: true },
    nid: { type: documentSchema, required: true },
    drivingLicense: { type: documentSchema, required: true },
    extraDrivingLicense: { type: documentSchema },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

driverSchema.virtual("activeVehicle").get(function () {
  return this.vehicleDetails[0] || null;
});

driverSchema.virtual("activeVehiclePhoto").get(function () {
  return this.vehicleDetails[0]?.mainPhoto || null;
});

export const Driver = mongoose.model<IDriverDoc>("Driver", driverSchema);
