/* eslint-disable no-unused-vars */
import { Types } from 'mongoose';
import { Request } from 'express';

export interface Payload {
  userId: string;
}

export enum UserRole {
  NONE = 'none',
  BASIC = 'basic',
  ADMIN = 'admin',
}

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserQuery {
  username?: { $regex: string; $options: string };
}

export interface AuthRequest extends Request {
  userId?: string;
}
