import { Types } from 'mongoose';
import { IDriverCreate, IDriverUpdate, IDriverDoc, DriverStatus } from './driver.interface';
export declare const createDriver: (data: IDriverCreate) => Promise<IDriverDoc>;
export declare const findDriverById: (id: Types.ObjectId) => Promise<IDriverDoc | null>;
export declare const findDriverByUserId: (userId: Types.ObjectId) => Promise<IDriverDoc | null>;
export declare const updateDriver: (id: Types.ObjectId, data: IDriverUpdate) => Promise<IDriverDoc | null>;
export declare const listDrivers: (query: {
    status?: DriverStatus;
}) => Promise<IDriverDoc[]>;
export declare const approveDriver: (id: Types.ObjectId) => Promise<IDriverDoc | null>;
export declare const rejectDriver: (id: Types.ObjectId) => Promise<IDriverDoc | null>;
//# sourceMappingURL=driver.service.d.ts.map