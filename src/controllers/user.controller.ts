import mongoose from 'mongoose';
import User from '../models/user.model';
import { IUser, UserQuery, UserRole } from '../ts/interfaces';
import { FnControllers } from '../ts/types';
import { BadRequestError, ConflictError, NotFoundError } from '../utils/customErrors';

export const getUsers: FnControllers = async (req, res, next) => {
  try {
    const query: UserQuery = {};
    const { username } = req.query;

    if (username) query.username = { $regex: username.toString(), $options: 'i' };

    const users: IUser[] = await User.find(query);

    res.status(200).json(users);
  } catch (error) {
    next(error as Error);
  }
};

export const getUserById: FnControllers = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) throw BadRequestError('User ID not provided');

    if (!mongoose.Types.ObjectId.isValid(id)) throw NotFoundError('User ID is invalid');

    const user = await User.findById(id);

    if (!user) throw NotFoundError('User not found');

    res.status(200).json(user);
  } catch (error) {
    next(error as Error);
  }
};

export const createUser: FnControllers = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) throw BadRequestError('Fields required: username, email and password');
    if (username === email) throw ConflictError('Duplicate key error');

    const existingUser = await User.findOne({ email });

    if (existingUser) throw ConflictError('Email is already in use');

    const newUser = new User({ username, email, password, role: UserRole.BASIC });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error as Error);
  }
};
