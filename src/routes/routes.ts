import express, { Router } from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import { errorHandler } from '../middleware/errorHandler';

const router: Router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

router.use(errorHandler);

export default router;
