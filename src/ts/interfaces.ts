/* eslint-disable no-unused-vars */
import { Document, Types } from 'mongoose';
import { Request } from 'express';

export interface Payload {
  userId: string;
}

export interface RegexQuery {
  [key: string]: { $regex: RegExp | string; $options: string };
}

export enum UserRole {
  NONE = 'none',
  BASIC = 'basic',
  ADMIN = 'admin',
}

export enum PlantTypeEn {
  TREE = 'tree',
  SHURB = 'shurb',
  PALM = 'palm',
  FLOWER = 'flower',
  ORCHID = 'orchid',
  BROMELIAD = 'bromeliad',
  SUCCULENT = 'suculent',
  CARNIVOROUS = 'carnivorous',
  FOLIARE = 'foliare',
  WATER_PLANT = 'water plant',
  AROMATIC = 'aromatic',
  FRUIT = 'fruit',
}

export enum PlantTypeEs {
  TREE = 'árbol',
  SHURB = 'arbusto',
  PALM = 'palmera',
  FLOWER = 'flor',
  ORCHID = 'orquídea',
  BROMELIAD = 'bromelia',
  SUCCULENT = 'suculenta',
  CARNIVOROUS = 'carnívora',
  FOLIARE = 'foliar',
  WATER_PLANT = 'planta acuática',
  AROMATIC = 'aromática',
  FRUIT = 'fruta',
}

export interface PlantType {
  en: PlantTypeEn;
  es: PlantTypeEs;
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
  label: { [key: string]: string };
}

export interface IPlantLabelSchema extends IPlantLabel {
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlant extends Document {
  name: { [key: string]: string };
  image: string;
  species: { [key: string]: string };
  scientific_name: { [key: string]: string };
  type: PlantType;
  label: Array<IPlantLabel['id']>;
  leaf: number;
  _doc?: IPlant;
}

export interface IPlantSchema extends IPlant {
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlantCare extends Document {
  id_plant: IPlant['id'];
  light: { [key: string]: string };
  irrigation: { [key: string]: string };
  temperature: { min: number; max: number };
  fertilization: { [key: string]: string };
  substratum: { [key: string]: string };
  _doc?: IPlantCare;
}

export interface IPlantCareSchema extends IPlantCare {
  createdAt: Date;
  updatedAt: Date;
}
