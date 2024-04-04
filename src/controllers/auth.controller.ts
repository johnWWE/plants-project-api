import { RequestHandler } from 'express';
import { BadRequestError, NotFoundError } from '../utils/customErrors';
import { IUser } from '../ts/interfaces';
import User from '../models/user.model';
import { generateToken, isMatchPassword } from '../helpers/auth';

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
    const authToken = req.header('Authorization');

    if (!authToken) throw BadRequestError('Token not provided');

    res.removeHeader('Authorization');
    res.status(200).json({ message: 'Cerrar sesión exitoso' });
  } catch (error) {
    next(error as Error);
  }
};
