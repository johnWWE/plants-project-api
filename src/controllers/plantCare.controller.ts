import { Schema, model } from 'mongoose';
import { PlantCareSchemaType } from '../ts/types';

const plantCareSchema: PlantCareSchemaType = new Schema({}, { timestamps: true });

const PlantCare = model('PlantCare', plantCareSchema);

export default PlantCare;
