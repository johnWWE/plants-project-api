import express, { Router } from 'express';
import { createUser, getUserById, getUsers, updateUser, roleUpdateUser, deleteUser } from '../controllers/user.controller';

const router: Router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:userId', updateUser);
router.patch('/:userId', roleUpdateUser);
router.delete('/:userId', deleteUser);

export default router;
