import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import Plant from '../models/plant.model';
import PlantLabel from '../models/plantLabel.model';

import { BadRequestError, NotFoundError } from '../utils/customErrors';
import { IPlant, IPlantLabel, RegexQuery } from '../ts/interfaces';

export const getPlant: RequestHandler = async (req, res, next) => {
  try {
    const id: string | undefined = req.params.id;

    if (!id) throw BadRequestError('Plant ID not provided');

    if (!Types.ObjectId.isValid(id)) throw NotFoundError('Plant ID is invalid');

    const plant: IPlant | null = await Plant.findById(id).populate('label').exec();

    if (!plant) throw NotFoundError('Plant not found');

    // const labels: string[] = plant.label.map((label: IPlantLabel) => label.label);

    // const newPlant = {
    //   _id: plant._id,
    //   name: plant.name,
    //   image: plant.image,
    //   phallemia: plant.phallemia,
    //   species: plant.species,
    //   scientific_name: plant.scientific_name,
    //   type: plant.type,
    //   label: labels,
    // };

    // const newPlant = {
    //   ...plant._doc,
    //   label: labels,
    // };

    res.status(200).json(plant);
  } catch (error) {
    next(error as Error);
  }
};

export const getPlants: RequestHandler = async (req, res, next) => {
  try {
    const query: RegexQuery = {};
    const { name } = req.query;
    if (name) query.name = { $regex: name.toString(), $options: 'i' };

    const plants: IPlant[] = await Plant.find(query).populate('label');

    if (!plants.length) throw NotFoundError('plant(s) not found');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataPlants: IPlant[] | any = plants.map((plant: IPlant) => {
      const labels: string[] = plant.label.map((label: IPlantLabel) => label.label);
      console.log(labels);

      return {
        ...plant._doc,
        label: labels,
      };
    });

    res.status(200).json(dataPlants);
  } catch (error) {
    next(error as Error);
  }
};

export const createPlant: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const { name, image, phallemia, species, scientific_name, label } = data;

    if (!name || !image || !phallemia || !species || !scientific_name) throw BadRequestError('Invalid');

    if (label) {
      let idLabels: Types.ObjectId[] = [];
      if (Array.isArray(label)) {
        idLabels = await Promise.all(
          label.map(async (x: string) => {
            const plantLabel: IPlantLabel | null = await PlantLabel.findOne({ label: x });
            if (!plantLabel) throw NotFoundError(`Could not find label ${x}`);
            return plantLabel.id;
          }),
        );
      }
      if (typeof label === 'string') {
        const plantLabel: IPlantLabel | null = await PlantLabel.findOne({ label });
        if (!plantLabel) throw NotFoundError('Label not found');
        idLabels.push(plantLabel.id);
      }

      data.label = idLabels;
    }

    const newPlant: IPlant = new Plant(data);

    const savedPlant = await newPlant.save();

    res.status(201).json(savedPlant);
  } catch (error) {
    next(error as Error);
  }
};
