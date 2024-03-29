import { Document, Model } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: 'none' | 'basic' | 'pro';
}

export interface UserModel extends Model<UserDocument> {} 
