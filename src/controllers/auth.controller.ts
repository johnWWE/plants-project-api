import { RequestHandler } from 'express';

import User from '../models/user.model';

import { BadRequestError, ConflictError, NotFoundError } from '../utils/customErrors';
import { IUser, UserRole } from '../ts/interfaces';
import { addToRevokedTokens, generateToken, getToken, hashPassword, isMatchPassword } from '../helpers/auth';

export const authLogin: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user) throw NotFoundError('User not found');

    const isMatch: boolean = await isMatchPassword(password, user.password);

    if (!isMatch) throw BadRequestError('Incorrect credentials');

    const token: string = generateToken(user._id.toString());

    res.setHeader('Authorization', token).status(200).json({ token });
  } catch (error) {
    next(error as Error);
  }
};

export const authLogout: RequestHandler = (req, res, next) => {
  try {
    const token: string = getToken(req);

    addToRevokedTokens(token);

    res.removeHeader('Authorization');
    res.status(200).json({ message: 'Session closed successfully' });
  } catch (error) {
    next(error as Error);
  }
};

export const authRegister: RequestHandler = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) throw BadRequestError('Fields required: username, email and password');
    if (username === email) throw ConflictError('Duplicate key error');

    const existingUser = await User.findOne({ email });

    if (existingUser) throw ConflictError('Email is already in use');

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ username, email, password: hashedPassword, role: UserRole.BASIC });

    const savedUser = await newUser.save();

    const token: string = generateToken(newUser._id.toString());

    res.setHeader('Authorization', token).status(201).json({ savedUser, token });
  } catch (error) {
    next(error as Error);
  }
};
