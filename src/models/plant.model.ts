import { Schema, model } from 'mongoose';

import { PlantSchemaType } from '../ts/types';
import { PlantTypeEn, PlantTypeEs } from '../ts/interfaces';

const plantSchema: PlantSchemaType = new Schema(
  {
    name: { type: Map, of: String, required: true },
    image: { type: String, required: true },
    species: { type: Map, of: String, required: true },
    scientific_name: { type: Map, of: String, required: true },
    type: {
      en: { type: String, enum: Object.values(PlantTypeEn), required: true },
      es: { type: String, enum: Object.values(PlantTypeEs), required: true },
    },
    label: [{ type: Schema.Types.ObjectId, ref: 'PlantLabel' }],
    leaf: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const Plant = model('Plant', plantSchema);

export default Plant;
