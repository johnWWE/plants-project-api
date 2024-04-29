import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import Plant from '../models/plant.model';
import PlantLabel from '../models/plantLabel.model';

import { BadRequestError, NotFoundError } from '../utils/customErrors';
import { IPlant, IPlantLabel, PlantTypeEn, PlantTypeEs, RegexQuery } from '../ts/interfaces';
import { isValidPlantType } from '../helpers/plant';

export const getPlants: RequestHandler = async (req, res, next) => {
  try {
    const query: RegexQuery = {};
    const { name, type } = req.query;

    if (name) query.name = { $regex: name.toString(), $options: 'i' };
    if (type) query.type = { $regex: type.toString(), $options: 'i' };

    let plants: IPlant[] = await Plant.find(query).populate('label');

    if (!plants.length) throw NotFoundError('plant(s) not found');

    plants = await Plant.find(query).populate('label');

    const dataPlants = plants.map((plant: IPlant) => {
      const labels: { [key: string]: string }[] = plant.label.map((label: IPlantLabel) => label.label); // Cambiar el tipo de labels
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

export const getPlant: RequestHandler = async (req, res, next) => {
  try {
    const id: string | undefined = req.params.id;

    if (!id) throw BadRequestError('Plant ID not provided');

    if (!Types.ObjectId.isValid(id)) throw NotFoundError('Plant ID is invalid');

    const plant: IPlant | null = await Plant.findById(id).populate('label').exec();

    if (!plant) throw NotFoundError('Plant not found');

    res.status(200).json(plant);
  } catch (error) {
    next(error as Error);
  }
};

export const createPlant: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const { name, image, species, scientific_name, type, label, leaf } = data;

    if (leaf && typeof leaf !== 'number') throw BadRequestError('Leaf must be a number');

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
