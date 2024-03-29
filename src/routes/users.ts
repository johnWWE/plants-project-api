import express, {Router } from 'express';
import {fn_get_all_users} from '../controller/users'

const userRouter: Router = express.Router();

userRouter.get(`/`, fn_get_all_users);

export default userRouter;
