import { Document, Types } from 'mongoose';
export type DriverStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export interface IVehicleDetails {
    type: string;
    model?: string;
    registrationNumber?: string;
    capacity?: number;
}
export interface IDriver {
    userId: Types.ObjectId;
    name: string;
    phoneNumber: string;
    photo?: string;
    status: DriverStatus;
    approvedByAdmin: boolean;
    vehicleDetails: IVehicleDetails;
    createdAt: Date;
    updatedAt: Date;
}
export interface IDriverDoc extends IDriver, Document {
    _id: Types.ObjectId;
}
export interface IDriverCreate {
    userId: Types.ObjectId;
    name: string;
    phoneNumber: string;
    photo?: string;
    vehicleDetails: IVehicleDetails;
}
export interface IDriverUpdate {
    name?: string;
    phoneNumber?: string;
    photo?: string;
    status?: DriverStatus;
    approvedByAdmin?: boolean;
    vehicleDetails?: Partial<IVehicleDetails>;
}
//# sourceMappingURL=driver.interface.d.ts.map