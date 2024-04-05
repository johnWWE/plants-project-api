import { Response, NextFunction, RequestHandler } from 'express';
import { Types } from 'mongoose';

import User from '../models/user.model';

import { BadRequestError, ForbiddenError } from '../utils/customErrors';
import { getToken, getUserIdFromToken } from '../helpers/auth';
import { AuthRequest, UserRole } from '../ts/interfaces';

const roleOrderMap: Record<UserRole, number> = {
  [UserRole.NONE]: 0,
  [UserRole.BASIC]: 1,
  [UserRole.ADMIN]: 2,
};

const getRoleOrder = (role: UserRole): number => {
  return roleOrderMap[role] || 0;
};

export const authorize = (requiredRole: UserRole): RequestHandler => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authToken: string = getToken(req);

      const userId: Types.ObjectId = getUserIdFromToken(authToken);

      if (!userId) throw BadRequestError('User ID not provided');

      const user = await User.findById(userId);

      if (!user) throw BadRequestError('User not found');
      if (!Object.values(UserRole).includes(user.role)) throw ForbiddenError('User Role is not valid');

      const userRoleOrder = getRoleOrder(user.role);
      const requiredRoleOrder = getRoleOrder(requiredRole);

      if (userRoleOrder < requiredRoleOrder) throw ForbiddenError('Unauthorized');
      next();
    } catch (error) {
      next(error as Error);
    }
  };
};
