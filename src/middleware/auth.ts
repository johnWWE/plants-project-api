import { Response, NextFunction, RequestHandler } from 'express';
import { Types } from 'mongoose';

import User from '../models/user.model';

import { BadRequestError, ForbiddenError } from '../utils/customErrors';
import { getToken, getUserIdFromToken } from '../helpers/auth';
import { AuthRequest, UserRole } from '../ts/interfaces';

export const authorize: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authToken: string = getToken(req);

    const userId: Types.ObjectId = getUserIdFromToken(authToken);

    if (!userId) throw BadRequestError('User ID not provided');

    const user = await User.findById(userId);

    if (!user) throw BadRequestError('User not found');

    if (user.role === UserRole.ADMIN) next();

    if (user.role === UserRole.BASIC) {
      if (req.path === `/${userId}` && req.method === 'PATCH') throw ForbiddenError('Unauthorized to update user role');

      next();
    }

    if (user.role === UserRole.NONE) throw ForbiddenError('Unauthorized');

    if (!(user.role in UserRole)) throw ForbiddenError('User Role is not valid');
  } catch (error) {
    next(error as Error);
  }
};
