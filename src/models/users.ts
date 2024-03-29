import mongoose from 'mongoose';

import {UserDocument, UserModel} from '../ts/interfaces'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['none', 'basic', 'pro'] },
});

const User: UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;

