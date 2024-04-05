/* eslint-disable no-unused-vars */
import { ObjectId } from 'mongoose';

export interface Payload {
  userId: string;
}

export enum UserRole {
  NONE = 'none',
  BASIC = 'basic',
  ADMIN = 'admin',
}

export interface IUser {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserQuery {
  username?: { $regex: string; $options: string };
}
