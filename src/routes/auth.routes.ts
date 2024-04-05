import { Router } from 'express';

import { authLogin, authLogout } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth';

const router: Router = Router();

router.post('/login', authLogin);
router.post('/logout', verifyToken, authLogout);

export default router;
