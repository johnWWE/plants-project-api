import { Router } from 'express';

import { createPlant, getPlant, getPlants } from '../controllers/plant.controller';

const router: Router = Router();

router.get('/', getPlants);
router.get('/:id', getPlant);
router.post('/', createPlant);

export default router;
