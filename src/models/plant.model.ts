import { Schema, model } from 'mongoose';
import { PlantSchemaType } from '../ts/types';

const plantSchema: PlantSchemaType = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    phallemia: { type: String, required: true },
    species: { type: String, required: true },
    scientific_name: { type: String, required: true },
    type: { type: String },
    label: [{ type: Schema.Types.ObjectId, ref: 'PlantLabel' }],
  },
  { timestamps: true },
);

const Plant = model('Plant', plantSchema);

export default Plant;
