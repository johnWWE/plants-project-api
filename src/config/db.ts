import mongoose from 'mongoose';

import { ConnectToMongoDB } from '../ts/types';

export const connectToMongoDB: ConnectToMongoDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('Successful connection to MongoDB');
  } catch (error) {
    console.error('Connection error to MongoDB:', (error as Error).message);
  }
};
