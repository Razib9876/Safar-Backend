import { Types } from "mongoose";

export interface IVehicleDetails {
  type: "car" | "cng" | "hiace";
  model?: string;
  registrationNumber: string;
  capacity: number;
  mainPhoto: string;
  photos?: string[];
}

export interface IDocument {
  number: string;
  photos: string[];
  verified?: boolean;
}

export interface IDriverCreate {
  userId: Types.ObjectId | string;
  name: string;
  phoneNumber: string;
  photo?: string;
  status?: "pending" | "available" | "approved" | "rejected" | "suspended";
  approvedByAdmin?: boolean;
  vehicleDetails: IVehicleDetails[];
  nid: IDocument;
  drivingLicense: IDocument;
  extraDrivingLicense?: IDocument;
  updatedBy?: Types.ObjectId | string;
}

export interface IDriverUpdate {
  name?: string;
  phoneNumber?: string;
  photo?: string;
  status?: "pending" | "approved" | "rejected" | "suspended";
  approvedByAdmin?: boolean;
  vehicleDetails?: IVehicleDetails[];
  nid?: IDocument;
  drivingLicense?: IDocument;
  extraDrivingLicense?: IDocument;
  updatedBy?: Types.ObjectId | string;
}

export interface IDriverDoc extends IDriverCreate {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  vehicleDetails: IVehicleDetails[];
  nid: IDocument;
  drivingLicense: IDocument;
  extraDrivingLicense?: IDocument;
}
