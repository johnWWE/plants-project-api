import { ObjectId } from 'mongoose';

/* eslint-disable no-unused-vars */
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
