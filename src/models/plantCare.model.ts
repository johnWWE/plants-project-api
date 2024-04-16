import { Schema, model } from 'mongoose';

import { PlantCareSchemaType } from '../ts/types';

const plantCareSchema: PlantCareSchemaType = new Schema(
  {
    id_plant: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
    light: { type: String, required: true },
    irrigation: { type: String, required: true },
    temperature: { min: Number, max: Number },
    fertilization: { type: String, required: true },
    substratum: { type: String, required: true },
  },
  { timestamps: true },
);

const PlantCare = model('PlantCare', plantCareSchema);

export default PlantCare;
