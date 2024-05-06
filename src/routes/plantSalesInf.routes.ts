import { Router } from 'express';
import { createPlantSalesInf, deletePlantSalesInf, getPlantSalesInf, updatePlantSalesInf } from '../controllers/plantSalesInf.controller.ts';

const router: Router = Router();

router.get('/', getPlantSalesInf);
router.post('/', createPlantSalesInf);
router.put('/:id', updatePlantSalesInf);
router.delete('/:id', deletePlantSalesInf);

export default router;
