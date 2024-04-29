import mongoose from 'mongoose';

import { PlantLabelSchemaType } from '../ts/types';

const plantLabelSchema: PlantLabelSchemaType = new mongoose.Schema(
  {
    label: { type: Map, of: String },
  },
  {
    timestamps: true,
  },
);

const PlantLabel = mongoose.model('PlantLabel', plantLabelSchema);

export default PlantLabel;
