import { RequestHandler } from 'express';

import PlantSalesInf from '../models/plantSalesInf.model';

import { IPlantSalesInf } from '../ts/interfaces';

export const getPlantSalesInf: RequestHandler = async (req, res, next) => {
  try {
    const plantSalesInf: IPlantSalesInf[] = await PlantSalesInf.find();

    res.status(200).json(plantSalesInf);
  } catch (error) {
    next(error as Error);
  }
};

export const createPlantSalesInf: RequestHandler = async (req, res, next) => {
  const { plant_id, price, quantity } = req.body;
  try {
    if (!plant_id || !price || !quantity) {
      throw new Error('Plant id, price and quantity must be provided');
    }

    const newPlantSalesInf: IPlantSalesInf = new PlantSalesInf({ plant_id, price, quantity });

    await newPlantSalesInf.save();

    res.status(200).json(newPlantSalesInf);
  } catch (error) {
    next(error as Error);
  }
};
