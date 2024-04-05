import express from 'express';

import { Router } from 'express';

import authRouter from './auth.routes';
import userRouter from './user.routes';

import { errorHandler } from '../middleware/errorHandler';
import { authorize } from '../middleware/auth';

const router: Router = express.Router();

router.use('/users', authorize, userRouter);
router.use('/auth', authRouter);

router.use(errorHandler);

export default router;
