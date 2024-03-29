/* eslint-disable no-unused-vars */
import { Document, Model } from 'mongoose';

export enum UserRole {
  None = 'none',
  Basic = 'basic',
  Pro = 'pro',
}

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserModel extends Model<UserDocument> {}

export interface QueryFilters {
  username?: { $regex: RegExp };
}
