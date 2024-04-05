import { Request, Response, NextFunction, RequestHandler } from 'express';
import { BadRequestError, ForbiddenError } from '../utils/customErrors';
import User from '../models/user.model';
import { getToken, getUserIdFromToken } from '../helpers/auth';

interface AuthRequest extends Request {
  userId?: string;
}

export const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const authToken = req.header('Authorization');

    if (!authToken) throw BadRequestError('Token not provided');

    const token = authToken.split(' ')[1];

    if (!token) throw BadRequestError('Invalid token');

    next();
  } catch (error) {
    next(error as Error);
  }
};

export const authorize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authToken: string | Error = getToken(req);
    if (authToken instanceof Error) throw authToken;

    const userId = getUserIdFromToken(authToken);

    if (!userId) throw BadRequestError('User ID not provided');

    const user = await User.findById(userId);

    if (!user) throw BadRequestError('User not found');

    if (user.role === 'admin') next();

    if (user.role === 'basic') {
      if (req.path === `/${userId}` && req.method === 'PATCH') throw ForbiddenError('Unauthorized to update user role');

      next();
    }

    if (user.role === 'none') throw ForbiddenError('Unauthorized');
  } catch (error) {
    next(error as Error);
  }
};
