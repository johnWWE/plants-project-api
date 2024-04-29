import { Schema, model } from 'mongoose';

const salesInfSchema = new Schema();

const SalesInf = model('SalesInf', salesInfSchema);

export default SalesInf;
