import { Document, Types } from "mongoose";

export type UserRole = "rider" | "driver" | "admin";
export type UserStatus = "active" | "suspended" | "deleted";

export interface IUser {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDoc extends IUser, Document {
  _id: Types.ObjectId;
}

export interface IUserCreate {
  name: string;
  email: string;
  phone?: string;
  role?: UserRole;
  photoURL?: string;
}

export interface IUserUpdate {
  name?: string;
  phone?: string;
  photoURL?: string;
  status?: UserStatus;
}
