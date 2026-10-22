import { Types } from "mongoose";
import { IUserCreate, IUserUpdate, IUserDoc } from "./user.interface";
export declare const createUser: (data: IUserCreate) => Promise<IUserDoc>;
export declare const listUsers: (query: {
    role?: string;
    status?: string;
}) => Promise<(import("mongoose").Document<unknown, {}, IUserDoc, {}, {}> & IUserDoc & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
})[]>;
export declare const findUserById: (id: Types.ObjectId) => Promise<IUserDoc | null>;
export declare const findUserByEmail: (email: string) => Promise<IUserDoc | null>;
export declare const getOrCreateByEmail: (data: IUserCreate) => Promise<IUserDoc>;
export declare const updateUser: (id: Types.ObjectId, data: IUserUpdate) => Promise<IUserDoc | null>;
//# sourceMappingURL=user.service.d.ts.map