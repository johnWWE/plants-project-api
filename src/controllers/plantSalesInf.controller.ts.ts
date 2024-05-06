import { RequestHandler } from 'express';

import PlantSalesInf from '../models/plantSalesInf.model';

import { IPlantSalesInf } from '../ts/interfaces';
import { Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '../utils/customErrors';

export const getPlantSalesInf: RequestHandler = async (req, res, next) => {
  try {
    const plantSalesInf: IPlantSalesInf[] = await PlantSalesInf.find();

    if (!plantSalesInf) throw NotFoundError('Plant sales information not found');

    res.status(200).json(plantSalesInf);
  } catch (error) {
    next(error as Error);
  }
};

export const createPlantSalesInf: RequestHandler = async (req, res, next) => {
  const data = req.body;
  const { id_plant, price, stock } = data;
  try {
    if (!id_plant || !price || !stock) throw NotFoundError('Plant ID, price and stock are required');
    if (!Types.ObjectId.isValid(id_plant)) throw BadRequestError('Plant ID is invalid');
    if (typeof price !== 'number' || typeof stock !== 'number') throw BadRequestError('Price and stock must be numbers');

    const sales_inf: [] = [];
    const newPlantSalesInf: IPlantSalesInf = new PlantSalesInf({ id_plant, price, stock, sales_inf });

    await newPlantSalesInf.save();

    res.status(200).json(newPlantSalesInf);
  } catch (error) {
    next(error as Error);
  }
};
