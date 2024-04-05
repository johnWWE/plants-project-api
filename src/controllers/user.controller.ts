import mongoose from 'mongoose';

import { RequestHandler } from 'express';

import User from '../models/user.model';

import { BadRequestError, ConflictError, NotFoundError } from '../utils/customErrors';
import { hashPassword, isMatchPassword } from '../helpers/auth';
import { IUser, UserQuery, UserRole } from '../ts/interfaces';

export const getUsers: RequestHandler = async (req, res, next) => {
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

export const getUserById: RequestHandler = async (req, res, next) => {
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

export const createUser: RequestHandler = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) throw BadRequestError('Fields required: username, email and password');
    if (username === email) throw ConflictError('Duplicate key error');

    const existingUser = await User.findOne({ email });

    if (existingUser) throw ConflictError('Email is already in use');

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ username, email, password: hashedPassword, role: UserRole.BASIC });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error as Error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const { username, email, password }: Partial<IUser> = req.body;
  const { userId } = req.params;

  try {
    if (!userId) throw BadRequestError('User ID not provided');

    if (!mongoose.Types.ObjectId.isValid(userId)) throw NotFoundError('User ID is invalid');

    const existingUser: IUser | null = await User.findById(userId);

    if (!existingUser) throw NotFoundError('User not found');

    const updateQuery: Partial<IUser> = {};

    if (username && username !== existingUser.username) updateQuery.username = username;

    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) throw ConflictError('Email already exists');
      updateQuery.email = email;
    }

    if (password) {
      const isSamePassword = await isMatchPassword(password, existingUser.password);
      if (isSamePassword) throw BadRequestError('New password must be different from the current one');

      updateQuery.password = await hashPassword(password);
    }

    if (Object.keys(updateQuery).length === 0) throw BadRequestError('No fields provided to update');

    const updatedUser: IUser | null = await User.findOneAndUpdate({ _id: userId }, { $set: updateQuery }, { new: true });

    if (!updatedUser) throw NotFoundError('User not found after update');

    res.status(200).json({ message: 'User updated correctly', user: updatedUser });
  } catch (error) {
    next(error as Error);
  }
};

export const roleUpdateUser: RequestHandler = async (req, res, next) => {
  const { role } = req.body;
  const { userId } = req.params;

  try {
    if (!userId) throw BadRequestError('User ID not provided');

    if (!mongoose.Types.ObjectId.isValid(userId)) throw NotFoundError('User ID is invalid');

    const existingUser = await User.findById(userId);

    if (!existingUser) throw NotFoundError('User not found');

    if (!Object.values(UserRole).includes(role)) throw BadRequestError('Role is not valid');

    if (existingUser.role === role) throw BadRequestError('The new role must be different from the current role');

    existingUser.role = role;
    await existingUser.save();

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    next(error as Error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userId) throw BadRequestError('User ID not provided');

    if (!mongoose.Types.ObjectId.isValid(userId)) throw NotFoundError('User ID is invalid');

    const existingUser = await User.findById(userId);

    if (!existingUser) throw NotFoundError('User not found');

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User deleted correctly' });
  } catch (error) {
    next(error as Error);
  }
};
