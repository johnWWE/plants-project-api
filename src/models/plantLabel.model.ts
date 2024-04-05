import mongoose from 'mongoose';

import { PlantLabelSchemaType } from '../ts/types';

const plantLabelSchema: PlantLabelSchemaType = new mongoose.Schema(
  {
    label: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

const PlantLabel = mongoose.model('PlantLabel', plantLabelSchema);

export default PlantLabel;
