import { Router } from 'express';
import { authLogin, authLogout } from '../controllers/auth.controller';

const router: Router = Router();

router.post('/login', authLogin);
router.post('/logout', authLogout);

export default router;
