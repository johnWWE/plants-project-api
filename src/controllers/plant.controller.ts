import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import Plant from '../models/plant.model';
import PlantLabel from '../models/plantLabel.model';
import User from '../models/user.model';

import { BadRequestError, NotFoundError } from '../utils/customErrors';
import { isValidPlantType } from '../helpers/plant';

import { IPlant, IPlantLabel, IUser, OrCondition, PlantTypeEn, PlantTypeEs, Query } from '../ts/interfaces';

export const getPlants: RequestHandler = async (req, res, next) => {
  try {
    const query: Query = {};
    const { name, type, label } = req.query;

    const orConditions: OrCondition[] = [];

    name &&
      orConditions.push({
        $or: [{ 'name.en': { $regex: name.toString(), $options: 'i' } }, { 'name.es': { $regex: name.toString(), $options: 'i' } }],
      });

    type &&
      orConditions.push({
        $or: [{ 'type.en': { $regex: type.toString(), $options: 'i' } }, { 'type.es': { $regex: type.toString(), $options: 'i' } }],
      });

    if (label) {
      const labels = label.toString().split(',');
      const labelIds: string[][] = await Promise.all(
        labels.map(async (labelItem) => {
          const label_id: string[] = await PlantLabel.find({
            $or: [{ 'label.en': { $regex: labelItem.trim(), $options: 'i' } }, { 'label.es': { $regex: labelItem.trim(), $options: 'i' } }],
          }).distinct('_id');
          return label_id;
        }),
      );

      orConditions.push({ label: { $in: labelIds.flat() } });
    }

    if (orConditions.length > 0) query.$and = orConditions;

    const plants: IPlant[] = await Plant.find(query).populate('label');

    if (!plants.length) throw NotFoundError('plant(s) not found');

    const dataPlants = plants.map((plant: IPlant) => {
      const labels: { [key: string]: string }[] = plant.label.map((label: IPlantLabel) => label.label);
      return {
        ...plant._doc,
        label: labels,
      };
    });

    res.status(200).json(dataPlants as IPlant[]);
  } catch (error) {
    next(error as Error);
  }
};

export const createPlant: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const { name, image, species, scientific_name, type, label } = data;

    if (!name || !image || !species || !scientific_name) throw BadRequestError('Invalid');

    if (label) {
      let idLabels: Types.ObjectId[] = [];
      if (Array.isArray(label)) {
        idLabels = await Promise.all(
          label.map(async (x: string) => {
            const plantLabel: IPlantLabel | null = await PlantLabel.findOne({ $or: [{ 'label.en': x }, { 'label.es': x }] });
            if (!plantLabel) throw NotFoundError(`Could not find label ${x}`);
            return plantLabel.id;
          }),
        );
      }
      if (typeof label === 'string') {
        const plantLabel: IPlantLabel | null = await PlantLabel.findOne({ $or: [{ 'label.en': label }, { 'label.es': label }] });
        if (!plantLabel) throw NotFoundError('Label not found');
        idLabels.push(plantLabel.id);
      }

      data.label = idLabels;
    }

    const plantType: { en?: string; es?: string } = {};

    if (isValidPlantType(type)) {
      if (Object.values(PlantTypeEn).includes(type as PlantTypeEn)) {
        plantType.en = type;
        const key = Object.keys(PlantTypeEn).find((key) => PlantTypeEn[key as keyof typeof PlantTypeEn] === type);
        plantType.es = key ? PlantTypeEs[key as keyof typeof PlantTypeEs] : undefined;
      } else if (Object.values(PlantTypeEs).includes(type as PlantTypeEs)) {
        plantType.es = type;
        const key = Object.keys(PlantTypeEs).find((key) => PlantTypeEs[key as keyof typeof PlantTypeEs] === type);
        plantType.en = key ? PlantTypeEn[key as keyof typeof PlantTypeEn] : undefined;
      }

      data.type = plantType;
    } else {
      throw BadRequestError('Invalid plant type');
    }

    const newPlant: IPlant = new Plant(data);

    const savedPlant = await newPlant.save();

    res.status(201).json(savedPlant);
  } catch (error) {
    next(error as Error);
  }
};

export const updatePlant: RequestHandler = async (req, res, next) => {
  try {
    const id: string | undefined = req.params.id;
    const dataUpdate = req.body;
    if (!id) throw BadRequestError('Plant id is required');

    if (!Types.ObjectId.isValid(id)) throw NotFoundError('Plant id is invalid');

    if (dataUpdate.type && !isValidPlantType(dataUpdate.type)) throw BadRequestError('Invalid plant type');

    const currentPlant: IPlant | null = await Plant.findById(id);
    if (!currentPlant) throw NotFoundError('Plant not found');

    if (dataUpdate.label) {
      let idLabels: Types.ObjectId[] = [];
      if (Array.isArray(dataUpdate.label)) {
        idLabels = await Promise.all(
          dataUpdate.label.map(async (x: string) => {
            const plantLabel: IPlantLabel | null = await PlantLabel.findOne({ $or: [{ 'label.en': x }, { 'label.es': x }] });
            if (!plantLabel) throw NotFoundError(`Could not find label ${x}`);
            return plantLabel.id;
          }),
        );
      }
      if (typeof dataUpdate.label === 'string') {
        const plantLabel: IPlantLabel | null = await PlantLabel.findOne({
          $or: [{ 'label.en': dataUpdate.label }, { 'label.es': dataUpdate.label }],
        });
        if (!plantLabel) throw NotFoundError(`Could not find label ${dataUpdate.label}`);
        idLabels.push(plantLabel.id);
      }

      dataUpdate.label = idLabels;
    }

    const plantType: { en?: string; es?: string } = {};

    if (dataUpdate.type) {
      if (isValidPlantType(dataUpdate.type)) {
        if (Object.values(PlantTypeEn).includes(dataUpdate.type as PlantTypeEn)) {
          plantType.en = dataUpdate.type;
          const key = Object.keys(PlantTypeEn).find((key) => PlantTypeEn[key as keyof typeof PlantTypeEn] === dataUpdate.type);
          plantType.es = key ? PlantTypeEs[key as keyof typeof PlantTypeEs] : undefined;
        } else if (Object.values(PlantTypeEs).includes(dataUpdate.type as PlantTypeEs)) {
          plantType.es = dataUpdate.type;
          const key = Object.keys(PlantTypeEs).find((key) => PlantTypeEs[key as keyof typeof PlantTypeEs] === dataUpdate.type);
          plantType.en = key ? PlantTypeEn[key as keyof typeof PlantTypeEn] : undefined;
        }

        dataUpdate.type = plantType;
      } else {
        throw BadRequestError('Invalid plant type');
      }
    }

    if (dataUpdate.leaf) {
      if (!Types.ObjectId.isValid(dataUpdate.leaf)) throw BadRequestError('User id is invalid');
      const user: IUser | null = await User.findById(dataUpdate.leaf);
      if (!user) throw NotFoundError('User not found');

      const leafs: Types.ObjectId[] = currentPlant.leaf;

      dataUpdate.leaf = leafs.map((leaf) => leaf.toString()).includes(dataUpdate.leaf.toString())
        ? leafs.filter((leaf) => leaf.toString() !== dataUpdate.leaf.toString())
        : [...leafs, dataUpdate.leaf];
    }

    const plantUpdate: IPlant | null = await Plant.findByIdAndUpdate(id, dataUpdate, { new: true });
    if (!plantUpdate) throw NotFoundError('Plant not found');

    res.status(200).send({ message: 'Update successfully', data: plantUpdate });
  } catch (error) {
    next(error as Error);
  }
};

export const deletePlant: RequestHandler = async (req, res, next) => {
  try {
    const id: string | undefined = req.params.id;
    if (!id) throw BadRequestError('Plant id is required');
    if (!Types.ObjectId.isValid(id)) throw NotFoundError('Plant id is invalid');

    const currentPlant: IPlant | null = await Plant.findById(id);
    if (!currentPlant) throw NotFoundError('Plant not found');

    await Plant.findByIdAndDelete(id);

    res.status(200).send({ message: 'plant deleted successfully' });
  } catch (error) {
    next(error as Error);
  }
};
