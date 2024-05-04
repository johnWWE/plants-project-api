/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { TokenIndexer } from 'morgan';

import { IPlantCareSchema, IPlantLabelSchema, IPlantSalesInfSchema, IPlantSchema } from './interfaces';

export type ConnectToMongoDB = (uri: string) => Promise<void>;

export type MorganConfigFunction = (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => string;

export type PlantLabelSchemaType = Schema<IPlantLabelSchema>;

export type PlantSchemaType = Schema<IPlantSchema>;

export type PlantCareSchemaType = Schema<IPlantCareSchema>;

export type PlantSalesInfType = Schema<IPlantSalesInfSchema>;
