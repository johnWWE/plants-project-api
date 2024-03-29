/* eslint-disable no-unused-vars */

import mongoose from 'mongoose';

interface ConnectToMongoDBFunction {
  (uri: string): Promise<void>;
}

export const connectToMongoDB: ConnectToMongoDBFunction = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('Successful connection to MongoDB');
  } catch (error) {
    console.error('Connection error to MongoDB:', (error as Error).message);
  }
};
