import express from 'express';

import { Router } from 'express';

import authRouter from './auth.routes';
import userRouter from './user.routes';

import { errorHandler } from '../middleware/errorHandler';
import { authorize } from '../middleware/auth';
import { UserRole } from '../ts/interfaces';

const router: Router = express.Router();

router.use('/users', authorize(UserRole.BASIC), userRouter);
router.use('/auth', authRouter);

router.use(errorHandler);

export default router;
