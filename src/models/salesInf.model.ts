import { Schema, model } from 'mongoose';

import { SalesInfType } from '../ts/types';

const salesInfSchema: SalesInfType = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  completed: { type: Boolean, required: true, default: false },
});

const SalesInf = model('SalesInf', salesInfSchema);

export default SalesInf;
