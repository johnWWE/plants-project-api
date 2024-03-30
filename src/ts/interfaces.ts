/* eslint-disable no-unused-vars */
export enum UserRole {
  NONE = 'none',
  BASIC = 'basic',
  ADMIN = 'admin',
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  role: UserRole;
}

export interface UserQuery {
  username?: { $regex: string; $options: string };
}
