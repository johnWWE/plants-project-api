import express, { Router } from 'express';
import userRouter from './user.routes';

import userRouter from './users';

const router: Router = express.Router();

router.use('/users', userRouter);

router.use(`/users`, userRouter);

export default router;
