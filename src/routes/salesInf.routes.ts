import { Router } from 'express';

import { getSalesInf, createSalesInf, deleteSalesInf } from '../controllers/salesInf.controller';

const router: Router = Router();

router.get('/', getSalesInf);
router.post('/', createSalesInf);
router.delete('/:id', deleteSalesInf);

export default router;
