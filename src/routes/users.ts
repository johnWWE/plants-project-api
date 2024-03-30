import express, { Router } from 'express';
import { fn_get_all_users, fn_get_user_by_id, create_user } from '../controller/users';

const userRouter: Router = express.Router();

userRouter.get(`/`, fn_get_all_users);
userRouter.get(`/:id`, fn_get_user_by_id);
userRouter.post(`/`, create_user);

export default userRouter;
