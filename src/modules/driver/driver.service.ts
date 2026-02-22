import { Types } from "mongoose";
import { Driver } from "./driver.model";
import { IDriverCreate, IDriverUpdate } from "./driver.interface";
import { ApiError } from "../../utils/ApiError";

const userFields = "name email phone role photo";

export const createDriver = async (data: IDriverCreate) => {
  const driver = await Driver.create(data);
  return findDriverById(driver._id);
};

export const findDriverById = async (id: Types.ObjectId) => {
  return Driver.findById(id)
    .populate("userId", userFields)
    .populate("updatedBy", userFields);
};

export const findDriverByUserId = async (userId: Types.ObjectId) => {
  return Driver.findOne({ userId })
    .populate("userId", userFields)
    .populate("updatedBy", userFields);
};

export const listDrivers = async (query: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const filter: any = {};
  if (query.status) filter.status = query.status;

  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 20;
  const skip = (page - 1) * limit;

  const drivers = await Driver.find(filter)
    .populate("userId", userFields)
    .populate("updatedBy", userFields)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return drivers;
};

export const updateDriver = async (id: Types.ObjectId, data: IDriverUpdate) => {
  const driver = await Driver.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true },
  )
    .populate("userId", userFields)
    .populate("updatedBy", userFields);
  if (!driver) throw new ApiError(404, "Driver not found");
  return driver;
};

// Status management
export const approveDriver = async (id: Types.ObjectId) => {
  const driver = await Driver.findById(id);
  if (!driver) throw new ApiError(404, "Driver not found");

  // Ensure status is a string before using includes
  const currentStatus = driver.status || ""; // fallback to empty string

  if (["pending", "rejected", "suspended"].includes(currentStatus)) {
    driver.status = "available";
    await driver.save();
  } else {
    throw new ApiError(
      400,
      `Cannot approve driver from status ${currentStatus}`,
    );
  }

  return findDriverById(id);
};
export const rejectDriver = async (id: Types.ObjectId) => {
  const driver = await Driver.findById(id);
  if (!driver) throw new ApiError(404, "Driver not found");

  const currentStatus = driver.status || ""; // fallback to empty string

  if (["available", "suspended", "pending"].includes(currentStatus)) {
    driver.status = "rejected";
    await driver.save();
  } else {
    throw new ApiError(
      400,
      `Cannot reject driver from status ${currentStatus}`,
    );
  }

  return findDriverById(id);
};

export const listSuspendedDrivers = async (query: {
  page?: number;
  limit?: number;
}) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 20;
  const skip = (page - 1) * limit;

  const drivers = await Driver.find({ status: "suspended" })
    .populate("userId", "name email phone role photo")
    .populate("updatedBy", "name email phone role photo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return drivers;
};

export const addVehiclePhoto = async (
  driverId: Types.ObjectId,
  vehicleIndex: number,
  photoUrl: string,
) => {
  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(404, "Driver not found");

  const vehicle = driver.vehicleDetails[vehicleIndex];
  if (!vehicle) throw new ApiError(400, "Vehicle not found");

  // Make sure photos array exists
  if (!vehicle.photos) vehicle.photos = [];

  vehicle.photos.push(photoUrl);
  await driver.save();

  return findDriverById(driverId);
};

// List drivers with status "rejected"
export const listRejectedDrivers = async (query: {
  page?: number;
  limit?: number;
}) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 20;
  const skip = (page - 1) * limit;

  const drivers = await Driver.find({ status: "rejected" })
    .populate("userId", "name email phone role photo")
    .populate("updatedBy", "name email phone role photo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return drivers;
};

// List drivers with status "on-ride"
export const listOnRideDrivers = async (query: {
  page?: number;
  limit?: number;
}) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 20;
  const skip = (page - 1) * limit;

  const drivers = await Driver.find({ status: "on-ride" })
    .populate("userId", "name email phone role photo")
    .populate("updatedBy", "name email phone role photo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return drivers;
};

export const updateVehicleMainPhoto = async (
  driverId: Types.ObjectId,
  vehicleIndex: number,
  photoUrl: string,
) => {
  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(404, "Driver not found");
  if (!driver.vehicleDetails[vehicleIndex])
    throw new ApiError(400, "Vehicle not found");

  driver.vehicleDetails[vehicleIndex].mainPhoto = photoUrl;
  await driver.save();
  return findDriverById(driverId);
};

export const deleteVehiclePhoto = async (
  driverId: Types.ObjectId,
  vehicleIndex: number,
  photoIndex: number,
) => {
  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(404, "Driver not found");

  const vehicle = driver.vehicleDetails[vehicleIndex];
  if (!vehicle) throw new ApiError(400, "Vehicle not found");

  // Ensure photos array exists
  if (!vehicle.photos || vehicle.photos.length <= photoIndex) {
    throw new ApiError(400, "Photo not found");
  }

  // Remove the photo
  vehicle.photos.splice(photoIndex, 1);

  await driver.save();
  return findDriverById(driverId);
};
