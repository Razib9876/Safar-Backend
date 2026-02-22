import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as driverService from "./driver.service";
import { ApiError } from "../../utils/ApiError";
import { IDriverCreate, IDriverUpdate } from "./driver.interface";
import { Driver } from "./driver.model";
import { listSuspendedDrivers } from "./driver.service";
import { listOnRideDrivers } from "./driver.service";
import { listRejectedDrivers } from "./driver.service";
import { User } from "../user/user.model";

// Create driver
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body as IDriverCreate;
    const driver = await driverService.createDriver(data);
    res.status(201).json({ success: true, data: driver });
  } catch (e) {
    next(e);
  }
};

// Get driver by ID
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idParam = req.params.id;

    // Ensure id is a string
    if (!idParam || Array.isArray(idParam)) {
      throw new ApiError(400, "Invalid driver ID");
    }

    const id = new Types.ObjectId(idParam);
    const driver = await driverService.findDriverById(id);
    if (!driver) throw new ApiError(404, "Driver not found");

    res.status(200).json({ success: true, data: driver });
  } catch (e) {
    next(e);
  }
};

// Get driver by User ID
export const getByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userIdParam = req.params.userId;

    // Ensure userId is a single string
    if (!userIdParam || Array.isArray(userIdParam)) {
      throw new ApiError(400, "Invalid user ID");
    }

    const userId = new Types.ObjectId(userIdParam);
    const driver = await driverService.findDriverByUserId(userId);

    if (!driver) throw new ApiError(404, "Driver not found");

    res.status(200).json({ success: true, data: driver });
  } catch (e) {
    next(e);
  }
};
// List drivers with optional status filter
export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const drivers = await driverService.listDrivers({ status, page, limit });
    res.status(200).json({ success: true, data: drivers });
  } catch (e) {
    next(e);
  }
};

// get only pending drivers
export const getPendingDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const drivers = await driverService.listDrivers({
      status: "pending",
    });

    res.status(200).json({ success: true, data: drivers });
  } catch (e) {
    next(e);
  }
};

export const getOnRideDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const drivers = await listOnRideDrivers({ page, limit });
    res.status(200).json({ success: true, data: drivers });
  } catch (err) {
    next(err);
  }
};

// GET drivers by status "available"
export const getAvailableDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const drivers = await Driver.find({ status: "available" })
      .populate("userId", "email")
      .populate("activeVehicle");

    res.status(200).json({
      status: "success",
      results: drivers.length,
      data: drivers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const getSuspendedDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const drivers = await listSuspendedDrivers({ page, limit });
    res.status(200).json({ success: true, data: drivers });
  } catch (err) {
    next(err);
  }
};

// Suspend a driver (change status from "available" to "suspended")
export const suspendDriver = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const driverIdParam = req.params.id;

    // Ensure driverIdParam is a single string
    if (!driverIdParam || Array.isArray(driverIdParam)) {
      throw new ApiError(400, "Invalid driver ID");
    }

    const driverId = new Types.ObjectId(driverIdParam);
    const driver = await Driver.findById(driverId);

    if (!driver) throw new ApiError(404, "Driver not found");

    driver.status = "suspended";
    await driver.save();

    res.status(200).json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
};

export const getRejectedDrivers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const drivers = await listRejectedDrivers({ page, limit });
    res.status(200).json({ success: true, data: drivers });
  } catch (err) {
    next(err);
  }
};

// Update driver
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paramId = req.params.id;
    if (!paramId || Array.isArray(paramId)) {
      throw new ApiError(400, "Invalid driver ID");
    }

    const id = new Types.ObjectId(paramId);
    const data = req.body as IDriverUpdate;
    const driver = await driverService.updateDriver(id, data);
    res.status(200).json({ success: true, data: driver });
  } catch (e) {
    next(e);
  }
};

// Approve driver
export const approveDriver = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const paramId = req.params.id;
    if (!paramId || Array.isArray(paramId)) {
      throw new ApiError(400, "Invalid driver ID");
    }
    const id = new Types.ObjectId(paramId);

    const driver = await Driver.findById(id).populate("userId");
    if (!driver) throw new ApiError(404, "Driver not found");

    driver.status = "available";
    driver.approvedByAdmin = true;
    await driver.save();

    // Handle populated user
    let user: any;
    if (driver.userId && typeof driver.userId !== "string") {
      user = driver.userId; // populated document
    } else {
      user = await User.findById(driver.userId);
    }

    if (user && user.role === "rider") {
      user.role = "driver";
      await user.save();
    }

    // Populate for response
    type PopulatedDriver = typeof driver & {
      activeVehicle?: any;
      activeVehiclePhoto?: string | null;
    };

    const populatedDriver = (await Driver.findById(id)
      .populate("userId", "name email role phone photo")
      .lean()) as PopulatedDriver;

    if (populatedDriver?.vehicleDetails?.length > 0) {
      populatedDriver.activeVehicle = populatedDriver.vehicleDetails[0];
      populatedDriver.activeVehiclePhoto =
        populatedDriver.vehicleDetails[0].mainPhoto;
    } else {
      populatedDriver.activeVehicle = null;
      populatedDriver.activeVehiclePhoto = null;
    }

    res.status(200).json({
      success: true,
      data: populatedDriver,
    });
  } catch (error) {
    next(error);
  }
};
// Reject driver
export const reject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paramId = req.params.id;
    if (!paramId || Array.isArray(paramId)) {
      throw new ApiError(400, "Invalid driver ID");
    }

    const id = new Types.ObjectId(paramId);
    const driver = await driverService.rejectDriver(id);

    res.status(200).json({ success: true, data: driver });
  } catch (e) {
    next(e);
  }
};

/* ================== GET DRIVER BY USER EMAIL ================== */
export const getDriverByUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      throw new ApiError(400, "Valid email is required");
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const driver = await Driver.findOne({ userId: user._id })
      .populate("userId", "name email role status")
      .populate("vehicleDetails") // optional, depending on your schema
      .exec();

    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    return res.status(200).json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};
// Vehicle photo management
export const addVehiclePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paramId = req.params.id;
    if (!paramId || Array.isArray(paramId)) {
      throw new ApiError(400, "Invalid driver ID");
    }

    const driverId = new Types.ObjectId(paramId);
    const { vehicleIndex, photoUrl } = req.body;

    const driver = await driverService.addVehiclePhoto(
      driverId,
      vehicleIndex,
      photoUrl,
    );

    res.status(200).json({ success: true, data: driver });
  } catch (e) {
    next(e);
  }
};
export const updateVehicleMainPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paramId = req.params.id;
    if (!paramId || Array.isArray(paramId)) {
      throw new ApiError(400, "Invalid driver ID");
    }

    const driverId = new Types.ObjectId(paramId);
    const { vehicleIndex, mainPhoto } = req.body;

    const driver = await driverService.updateVehicleMainPhoto(
      driverId,
      vehicleIndex,
      mainPhoto,
    );

    res.status(200).json({ success: true, data: driver });
  } catch (e) {
    next(e);
  }
};
export const deleteVehiclePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paramId = req.params.id;
    if (!paramId || Array.isArray(paramId)) {
      throw new ApiError(400, "Invalid driver ID");
    }

    const driverId = new Types.ObjectId(paramId);
    const { vehicleIndex, photoIndex } = req.body;

    const driver = await driverService.deleteVehiclePhoto(
      driverId,
      vehicleIndex,
      photoIndex,
    );

    res.status(200).json({ success: true, data: driver });
  } catch (e) {
    next(e);
  }
};
