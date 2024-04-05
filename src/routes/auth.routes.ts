import { Router } from 'express';

import { authLogin, authLogout, authRegister } from '../controllers/auth.controller';

const router: Router = Router();

router.post('/register', authRegister);
router.post('/login', authLogin);
router.post('/logout', authLogout);

export default router;
