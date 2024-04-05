import express from 'express';

import { Router } from 'express';

import { authorize } from '../middleware/auth';
import { createUser, getUserById, getUsers, updateUser, roleUpdateUser, deleteUser } from '../controllers/user.controller';
import { UserRole } from '../ts/interfaces';

const router: Router = express.Router();

router.get('/', authorize(UserRole.ADMIN), getUsers);
router.get('/:id', getUserById);
router.post('/', authorize(UserRole.ADMIN), createUser);
router.put('/:userId', updateUser);
router.patch('/:userId', authorize(UserRole.ADMIN), roleUpdateUser);
router.delete('/:userId', deleteUser);

export default router;
