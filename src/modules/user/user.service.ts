import { Types } from 'mongoose';
import { User } from './user.model';
import { IUserCreate, IUserUpdate, IUserDoc, UserRole } from './user.interface';
import { ApiError } from '../../utils/ApiError';

export const createUser = async (data: IUserCreate): Promise<IUserDoc> => {
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    return existing as IUserDoc;
  }
  const user = await User.create({
    ...data,
    email: data.email.toLowerCase(),
    role: data.role || 'rider',
    status: 'active',
  });
  return user;
};

export const findUserById = async (id: Types.ObjectId): Promise<IUserDoc | null> => {
  return User.findById(id);
};

export const findUserByEmail = async (email: string): Promise<IUserDoc | null> => {
  return User.findOne({ email: email.toLowerCase() });
};

export const getOrCreateByEmail = async (data: IUserCreate): Promise<IUserDoc> => {
  const existing = await findUserByEmail(data.email);
  if (existing) return existing;
  return createUser(data);
};

export const updateUser = async (
  id: Types.ObjectId,
  data: IUserUpdate
): Promise<IUserDoc | null> => {
  const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true });
  return user;
};

export const listUsers = async (query: {
  role?: UserRole;
  status?: string;
}): Promise<IUserDoc[]> => {
  const filter: Record<string, string> = {};
  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  return User.find(filter).sort({ createdAt: -1 });
};
