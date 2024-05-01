import { Schema, model } from 'mongoose';

import { PlantCareSchemaType } from '../ts/types';

const plantCareSchema: PlantCareSchemaType = new Schema(
  {
    id_plant: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
    light: { type: Map, of: String, required: true },
    irrigation: { type: Map, of: String, required: true },
    fertilization: { type: Map, of: String, required: true },
    substratum: { type: Map, of: String, required: true },
  },
  { timestamps: true },
);

const PlantCare = model('PlantCare', plantCareSchema);

export default PlantCare;
