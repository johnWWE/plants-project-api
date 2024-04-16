import { RequestHandler } from 'express';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/customErrors';
import { RegexQuery } from '../ts/interfaces';
import PlantCare from '../models/plantCare.model';
import Plant from '../models/plant.model';
import { IPlant, IPlantCare } from '../ts/interfaces';

export const getAllPlantCare: RequestHandler = async (req, res, next) => {
  try {
    const query: RegexQuery = {};
    const { id_plant } = req.query;
    if (id_plant) query.name = { $regex: id_plant.toString(), $options: 'i' };

    const plantsCare = await PlantCare.find(query).populate('id_plant');

    if (!plantsCare.length) throw NotFoundError('plant care not found');

    const dataPlantsCare = plantsCare.map((plantCare: IPlantCare) => {
      const id_plant: string = plantCare.id_plant.name;

      return {
        ...plantCare._doc,
        id_plant,
      };
    });

    res.status(200).json(dataPlantsCare);
  } catch (error) {
    next(error as Error);
  }
};

export const createPlantCare: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const { id_plant, light, irrigation, temperature, fertilization, substratum } = data;

    if (typeof temperature.min !== 'number' || typeof temperature.max !== 'number') throw BadRequestError('temperature min and max are number');

    if (!id_plant || !light || !irrigation || !fertilization || !substratum) throw BadRequestError('All fields are required');

    const uniqueId: IPlantCare | null = await PlantCare.findOne({ id_plant });
    if (uniqueId) throw ConflictError('id_plant already in use');

    const getPlant: IPlant | null = await Plant.findById(id_plant);
    if (!getPlant) throw NotFoundError('id_plant not found');

    const newPlantCare: IPlantCare = new PlantCare(data);

    const savedPlantCare = await newPlantCare.save();
    res.status(200).send(savedPlantCare);
  } catch (error) {
    next(error as Error);
  }
};

export const updatePlantCare: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.temperature && (typeof data.temperature.min !== 'number' || typeof data.temperature.max !== 'number'))
      throw BadRequestError('temperature min and max are number');

    const updatedPlantCare = await PlantCare.findByIdAndUpdate(id, data, { new: true });

    if (!updatedPlantCare) throw NotFoundError('plant care not found');

    res.status(200).send(updatedPlantCare);
  } catch (error) {
    next(error as Error);
  }
};

export const deletePlantCare: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPlantCare = await PlantCare.findByIdAndDelete(id);

    if (!deletedPlantCare) throw NotFoundError('plant care not found');

    res.status(200).send(deletedPlantCare);
  } catch (error) {
    next(error as Error);
  }
};
