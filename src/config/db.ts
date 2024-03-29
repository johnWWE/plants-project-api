import mongoose from 'mongoose';

export const connectToMongoDB = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log('Successful connection to MongoDB');
  } catch (error) {
    console.error('Connection error to MongoDB:', (error as Error).message);
  }
};
