import { RequestHandler } from 'express';

import { BadRequestError } from '../utils/customErrors';

// --header 'Authorization: Bearer <token>
export const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const authToken = req.header('Authorization');

    if (!authToken) throw BadRequestError('Token not provided');

    const token = authToken.split(' ')[1];

    if (!token) throw BadRequestError('Token not provided');

    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    next(error as Error);
  }
};

// authorization
