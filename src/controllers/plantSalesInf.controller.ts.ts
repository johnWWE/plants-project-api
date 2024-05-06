import { RequestHandler } from 'express';

import PlantSalesInf from '../models/plantSalesInf.model';

import { IPlantSalesInf } from '../ts/interfaces';
import { Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '../utils/customErrors';

export const getPlantSalesInf: RequestHandler = async (req, res, next) => {
  try {
    const plantSalesInf: IPlantSalesInf[] = await PlantSalesInf.find();

    if (!plantSalesInf) throw NotFoundError('Plant sales information not found');

    res.status(200).send(plantSalesInf);
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

    const newPlantSalesInf: IPlantSalesInf = new PlantSalesInf({ id_plant, price, stock });

    await newPlantSalesInf.save();

    res.status(200).send(newPlantSalesInf);
  } catch (error) {
    next(error as Error);
  }
};

export const updatePlantSalesInf: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if (!Types.ObjectId.isValid(id)) throw BadRequestError('Invalid ID');

    if (data.price && typeof data.price !== 'number') throw BadRequestError('Price must be a number');

    if (data.stock && typeof data.stock !== 'number') throw BadRequestError('Stock must be a number');

    /* sales_inf: [{user_id: string, quantity: number, price: number}] */
    /* data.sales_inf: {user_id, quantity, price} */
    /* 1. user_id === data.sales_inf.user_id && current_data.sales_inf.price === price --> sum quantity */
    /* 2. user_id === data.sales_inf.user_id && current_data.sales_inf.price !== price --> add in another object */
    /* 3. user_id !== data.sales_inf.user_id  --> add in another object */

    const plantSalesInf: IPlantSalesInf | null = await PlantSalesInf.findByIdAndUpdate(id, data, { new: true });

    if (!plantSalesInf) throw NotFoundError('Plant sales information not found');

    res.status(200).send(plantSalesInf);
  } catch (error) {
    next(error as Error);
  }
};

export const deletePlantSalesInf: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!Types.ObjectId.isValid(id)) throw BadRequestError('Invalid ID');

    const plantSalesInf: IPlantSalesInf | null = await PlantSalesInf.findByIdAndDelete(id);

    if (!plantSalesInf) throw NotFoundError('Plant sales information not found');

    res.status(200).send({ message: 'deleted successfully' });
  } catch (error) {
    next(error as Error);
  }
};
