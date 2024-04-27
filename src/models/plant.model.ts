import { Schema, model } from 'mongoose';

import { PlantSchemaType } from '../ts/types';
import { PlantType } from '../ts/interfaces';

const plantSchema: PlantSchemaType = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    phallemia: { type: String, required: true },
    species: { type: String, required: true },
    scientific_name: { type: String, required: true },
    type: { type: String, enum: Object.values(PlantType) },
    label: [{ type: Schema.Types.ObjectId, ref: 'PlantLabel' }],
    leaf: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const Plant = model('Plant', plantSchema);

export default Plant;
