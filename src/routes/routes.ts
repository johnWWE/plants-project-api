import express from 'express';

import { Router } from 'express';

import authRouter from './auth.routes';
import plantRouter from './plant.routes';
import plantCareRouter from './plantCare.routes';
import plantLabelRouter from './plantLabel.routes';
import userRouter from './user.routes';
import salesInfRouter from './salesInf.routes';

import { errorHandler } from '../middleware/errorHandler';
import { authorize } from '../middleware/auth';
import { UserRole } from '../ts/interfaces';

const router: Router = express.Router();

router.use('/auth', authRouter);
router.use('/plantlabel', plantLabelRouter);
router.use('/plant', plantRouter);
router.use('/users', authorize(UserRole.BASIC), userRouter);
router.use('/plantcare', plantCareRouter);
router.use('/salesInf', salesInfRouter);

router.use(errorHandler);

export default router;
