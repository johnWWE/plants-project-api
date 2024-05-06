import { RequestHandler } from 'express';
import SalesInf from '../models/salesInf.model';
import { ISalesInf, IUser } from '../ts/interfaces';
import { Types } from 'mongoose';
import User from '../models/user.model';
import { BadRequestError, NotFoundError } from '../utils/customErrors';

export const getSalesInf: RequestHandler = async (req, res, next) => {
  try {
    const salesInf: ISalesInf[] = await SalesInf.find();
    res.status(200).send(salesInf);
  } catch (error) {
    next(error as Error);
  }
};

export const createSalesInf: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const { user_id, quantity, price } = data;

    if (!Types.ObjectId.isValid(user_id)) throw BadRequestError('Invalid user ID');
    const user: IUser | null = await User.findById(user_id);
    if (!user) throw NotFoundError('User not found');

    if (typeof quantity !== 'number' || typeof price !== 'number') throw BadRequestError('Quantity and price must be numbers');

    const newSalesInf: ISalesInf = new SalesInf(data);
    await newSalesInf.save();

    res.status(201).send(newSalesInf);
  } catch (error) {
    next(error as Error);
  }
};

export const deleteSalesInf: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) throw BadRequestError('Invalid ID');

    const salesInf: ISalesInf | null = await SalesInf.findById(id);
    if (!salesInf) throw NotFoundError('Sales information not found');

    await SalesInf.findByIdAndDelete(id);

    res.status(200).send({ message: 'deleted successfully' });
  } catch (error) {
    next(error as Error);
  }
};
