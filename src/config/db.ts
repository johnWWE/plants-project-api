import mongoose from 'mongoose';

import { ConnectToMongoDB } from '../ts/types';
/* import Plant from '../models/plant.model';
import plantData from '../db/plant.json';
import plantCareData from '../db/plantCare.json';
import PlantCare from '../models/plantCare.model'; */

/* async function uploadData() {
  try {
    await PlantCare.insertMany(plantCareData);
    // await Plant.insertMany(plantData);
  } catch (error) {
    console.error('Error uploading data:', (error as Error).message);
  }
} */

export const connectToMongoDB: ConnectToMongoDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('Successful connection to MongoDB');

    /*  await uploadData();
    console.log('Data inserted successfully'); */
  } catch (error) {
    console.error('Connection error to MongoDB:', (error as Error).message);
  }
};
