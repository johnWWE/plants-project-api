import { Router } from 'express';
import { createPlantSalesInf, deletePlantSalesInf, getPlantSalesInf } from '../controllers/plantSalesInf.controller.ts';

const router: Router = Router();

router.get('/', getPlantSalesInf);
router.post('/', createPlantSalesInf);
router.delete('/:id', deletePlantSalesInf);

export default router;
