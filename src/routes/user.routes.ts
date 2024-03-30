import express, { Router } from 'express';
import { createUser, getUserById, getUsers } from '../controllers/user.controller';

const router: Router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);

export default router;
