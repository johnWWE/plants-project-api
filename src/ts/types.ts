/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { TokenIndexer } from 'morgan';
import { IPlantLabelSchema } from './interfaces';
import { Schema } from 'mongoose';

export type ConnectToMongoDB = (uri: string) => Promise<void>;

export type MorganConfigFunction = (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => string;

export type PlantLabelSchemaType = Schema<IPlantLabelSchema>;
