import { Types } from 'mongoose';
import { IUserCreate, IUserUpdate, IUserDoc, UserRole } from './user.interface';
export declare const createUser: (data: IUserCreate) => Promise<IUserDoc>;
export declare const findUserById: (id: Types.ObjectId) => Promise<IUserDoc | null>;
export declare const findUserByEmail: (email: string) => Promise<IUserDoc | null>;
export declare const getOrCreateByEmail: (data: IUserCreate) => Promise<IUserDoc>;
export declare const updateUser: (id: Types.ObjectId, data: IUserUpdate) => Promise<IUserDoc | null>;
export declare const listUsers: (query: {
    role?: UserRole;
    status?: string;
}) => Promise<IUserDoc[]>;
//# sourceMappingURL=user.service.d.ts.map