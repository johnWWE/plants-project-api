import { Schema, model } from 'mongoose';
import { PlantSalesInfType } from '../ts/types';

const plantSalesInfSchema: PlantSalesInfType = new Schema(
  {
    id_plant: { type: Schema.Types.ObjectId, ref: 'Plant', required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    sales_inf: [
      {
        user_id: { type: String },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const PlantSalesInf = model('PlantSalesInf', plantSalesInfSchema);

export default PlantSalesInf;
