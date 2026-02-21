import mongoose, { Schema } from 'mongoose';
import { IUserDoc } from './user.interface';

const userSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      required: true,
      enum: ['rider', 'driver', 'admin'],
      default: 'rider',
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
    photoURL: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

export const User = mongoose.model<IUserDoc>('User', userSchema);
