import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import PlantSalesInf from '../models/plantSalesInf.model';
import SalesInf from '../models/salesInf.model';

import { IPlantSalesInf, ISalesInf } from '../ts/interfaces';
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

    const currentSalesInf: IPlantSalesInf | null = await PlantSalesInf.findById(id);
    if (!currentSalesInf) throw NotFoundError('Plant sales information not found');

    if (data.price && typeof data.price !== 'number') throw BadRequestError('Price must be a number');
    if (data.stock && typeof data.stock !== 'number') throw BadRequestError('Stock must be a number');

    if (data.sales_inf) {
      if (data.sales_inf.type !== 'add' && data.sales_inf.type !== 'remove') throw BadRequestError('Invalid sales_inf type');

      if (!Types.ObjectId.isValid(data.sales_inf.id)) throw BadRequestError('Invalid Sales Inf ID');
      const salesInf: ISalesInf | null = await SalesInf.findById(data.sales_inf.id);
      if (!salesInf) throw NotFoundError('Sales information not found');

      if (data.sales_inf.type === 'add') {
        if (currentSalesInf.sales_inf.includes(data.sales_inf.id)) throw BadRequestError('Sales information already added');
        currentSalesInf.sales_inf.push(data.sales_inf.id);
      } else if (data.sales_inf.type === 'remove')
        currentSalesInf.sales_inf = currentSalesInf.sales_inf.filter((saleInfId) => saleInfId.toString() !== data.sales_inf.id);

      await currentSalesInf.save();
      delete data.sales_inf;
    }
    console.log(data);

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
