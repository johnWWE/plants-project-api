import { Router } from 'express';
import { createPlantSalesInf, getPlantSalesInf } from '../controllers/plantSalesInf.controller.ts';

const router: Router = Router();

router.get('/', getPlantSalesInf);
router.post('/', createPlantSalesInf);

export default router;
