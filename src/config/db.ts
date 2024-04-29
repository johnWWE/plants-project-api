import mongoose from 'mongoose';

import { ConnectToMongoDB } from '../ts/types';
// import Plant from '../models/plant.model';
// import plantData from '../db/plant.json';

export const connectToMongoDB: ConnectToMongoDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('Successful connection to MongoDB');

    // await Plant.insertMany(plantData);
    // console.log('Data inserted successfully');
  } catch (error) {
    console.error('Connection error to MongoDB:', (error as Error).message);
  }
};
