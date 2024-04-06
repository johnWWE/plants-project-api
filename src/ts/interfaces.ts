/* eslint-disable no-unused-vars */
import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface Payload {
  userId: string;
}

export interface RegexQuery {
  [key: string]: { $regex: string; $options: string };
}

export enum UserRole {
  NONE = 'none',
  BASIC = 'basic',
  ADMIN = 'admin',
}

export enum PlantType {
  TREE = 'arbol',
  SHURB = 'arbusto',
  PALM = 'palmera',
  FLOWER = 'flor',
  ORCHID = 'orquidea',
  BROMELIAD = 'bromelia',
  SUCCULENT = 'suculenta',
  CARNIVOROUS = 'carnivora',
  LEAF = 'foliare',
  WATER_PLANT = 'planta de agua',
  VINE = 'vide',
}

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export interface IPlantLabel extends Document {
  label: string;
}

export interface IPlantLabelSchema extends IPlantLabel {
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlant extends Document {
  name: string;
  image: string;
  phallemia: string;
  species: string;
  scientific_name: string;
  type: PlantType;
  label: Array<IPlantLabel['id']>;
  _doc?: IPlant;
}

export interface IPlantSchema extends IPlant {
  createdAt: Date;
  updatedAt: Date;
}
