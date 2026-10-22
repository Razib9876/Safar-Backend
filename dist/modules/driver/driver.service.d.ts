import { Types } from "mongoose";
import { IDriverCreate, IDriverUpdate } from "./driver.interface";
export declare const createDriver: (data: IDriverCreate) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const findDriverById: (id: Types.ObjectId) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const findDriverByUserId: (userId: Types.ObjectId) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const listDrivers: (query: {
    status?: string;
    page?: number;
    limit?: number;
}) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const updateDriver: (id: Types.ObjectId, data: IDriverUpdate) => Promise<import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const approveDriver: (id: Types.ObjectId) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
/**
 * Driver starts the ride for a booking
 */
export declare const startRide: (driverId: Types.ObjectId, bookingId: Types.ObjectId) => Promise<{
    booking: import("mongoose").Document<unknown, {}, import("../booking/booking.interface").IBookingDoc, {}, {}> & import("../booking/booking.interface").IBookingDoc & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    };
    driver: import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    };
}>;
export declare const rejectDriver: (id: Types.ObjectId) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const listSuspendedDrivers: (query: {
    page?: number;
    limit?: number;
}) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const addVehiclePhoto: (driverId: Types.ObjectId, vehicleIndex: number, photoUrl: string) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const listRejectedDrivers: (query: {
    page?: number;
    limit?: number;
}) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const listOnRideDrivers: (query: {
    page?: number;
    limit?: number;
}) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const updateVehicleMainPhoto: (driverId: Types.ObjectId, vehicleIndex: number, photoUrl: string) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
export declare const deleteVehiclePhoto: (driverId: Types.ObjectId, vehicleIndex: number, photoIndex: number) => Promise<(import("mongoose").Document<unknown, {}, import("./driver.interface").IDriverDoc, {}, {}> & import("./driver.interface").IDriverDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}) | null>;
//# sourceMappingURL=driver.service.d.ts.map