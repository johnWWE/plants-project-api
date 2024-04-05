import { RequestHandler } from 'express';

import PlantLabel from '../models/plantLabel.model';

import { BadRequestError, ConflictError, NotFoundError } from '../utils/customErrors';
import { IPlantLabel, LabelQuery } from '../ts/interfaces';
import { Types } from 'mongoose';

export const getPlantLabel: RequestHandler = async (req, res, next) => {
  try {
    const query: LabelQuery = {};
    const { label } = req.query;
    if (label) query.label = { $regex: label.toString(), $options: 'i' };

    const plantLabels: IPlantLabel[] = await PlantLabel.find(query);

    if (!plantLabels.length) throw NotFoundError('No plant(s) labels found');

    res.status(200).json(plantLabels);
  } catch (error) {
    next(error as Error);
  }
};

export const getPlantLabelById: RequestHandler = async (req, res, next) => {
  try {
    const id: string | undefined = req.params.id;
    if (!id) throw BadRequestError('Plant label id not provided');
    if (!Types.ObjectId.isValid(id)) throw NotFoundError('id is invalid');

    const currentLabel: IPlantLabel | null = await PlantLabel.findById(id);
    if (!currentLabel) throw NotFoundError('Plant label not found');

    res.status(200).json(currentLabel);
  } catch (error) {
    next(error as Error);
  }
};

export const createPlantLabel: RequestHandler = async (req, res, next) => {
  const { label } = req.body;
  try {
    if (!label) throw BadRequestError('Label must be provided');

    const existingLabel: IPlantLabel | null = await PlantLabel.findOne({ label });
    if (existingLabel) throw ConflictError('Label already exists');

    const newLabel: IPlantLabel = new PlantLabel({ label });

    await newLabel.save();

    res.status(200).json(newLabel);
  } catch (error) {
    next(error as Error);
  }
};

export const updateLabel: RequestHandler = async (req, res, next) => {
  try {
    const id: string | undefined = req.params.id;
    const label: string | undefined = req.body.label;

    if (!id) throw BadRequestError('id not provided');
    if (!label) throw BadRequestError('label is required');

    if (!Types.ObjectId.isValid(id)) throw NotFoundError('id is invalid');

    const currentLabel: IPlantLabel | null = await PlantLabel.findById(id);

    if (!currentLabel) throw NotFoundError('label not found');

    if (label === currentLabel.label) throw BadRequestError('Not be same as label');

    currentLabel.label = label;
    await currentLabel.save();

    res.status(200).json({ message: 'Label saved successfully' });
  } catch (error) {
    next(error as Error);
  }
};

export const deleteLabel: RequestHandler = async (req, res, next) => {
  try {
    const id: string | undefined = req.params.id;

    if (!id) throw BadRequestError('id not provided');

    if (!Types.ObjectId.isValid(id)) throw NotFoundError('id is invalid');

    const currentLabel: IPlantLabel | null = await PlantLabel.findById(id);

    if (!currentLabel) throw NotFoundError('label not found');

    await PlantLabel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Label deleted successfully' });
  } catch (error) {
    next(error as Error);
  }
};
