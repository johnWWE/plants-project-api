import { Router } from 'express';

import { createPlantCare, getAllPlantCare, updatePlantCare, deletePlantCare, getPlantCareById } from '../controllers/plantCare.controller';

const router: Router = Router();

router.get('/', getAllPlantCare);
router.get('/:id', getPlantCareById);
router.post('/', createPlantCare);
router.put('/:id', updatePlantCare);
router.delete('/:id', deletePlantCare);

export default router;
