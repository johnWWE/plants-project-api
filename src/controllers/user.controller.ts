import mongoose from 'mongoose';
import User from '../models/user.model';
import { IUser, UserQuery, UserRole } from '../ts/interfaces';
import { FnControllers } from '../ts/types';
import { BadRequestError, NotFoundError } from '../utils/customErrors';

export const getUsers: FnControllers = async (req, res) => {
  try {
    const query: UserQuery = {};
    const { username } = req.query;

    if (username) {
      query.username = { $regex: username.toString(), $options: 'i' };
    }

    const users: IUser[] = await User.find(query);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error getting users: ', error: (error as Error).message });
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
    next(error);
  }
};

export const createUser: FnControllers = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) return res.status(400).json({ message: 'Fields required: username, email and password' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email is already in use' });

    const newUser = new User({ username, email, password, role: UserRole.BASIC });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user: ', error: (error as Error).message });
  }
};
