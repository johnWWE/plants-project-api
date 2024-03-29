import express, { Request, Response, Router } from 'express';

import userRouter from './users';

const router: Router = express.Router();

router.get(`/`, (req: Request, res: Response) => {
  res.send(`Welcome to plants project api`);
});

router.use(`/users`, userRouter);

export default router;
