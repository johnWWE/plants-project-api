import { Router } from 'express';

import { createPlant, deletePlant, getPlant, getPlants, updatePlant } from '../controllers/plant.controller';

const router: Router = Router();

router.get('/', getPlants);
router.get('/:id', getPlant);
router.post('/', createPlant);
router.put('/:id', updatePlant);
router.delete('/:id', deletePlant);

export default router;
