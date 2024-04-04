import mongoose from 'mongoose';
import { UserRole } from '../ts/interfaces';
import { hashPassword } from '../helpers/auth';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.NONE },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    this.password = await hashPassword(this.password);

    next();
  } catch (error) {
    next(error as Error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
