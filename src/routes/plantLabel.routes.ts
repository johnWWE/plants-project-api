import { Router } from 'express';

import { createPlantLabel, deleteLabel, getPlantLabel, getPlantLabelById, updateLabel } from '../controllers/plantLabel.controller';

const router: Router = Router();

router.get('/', getPlantLabel);
router.get('/:id', getPlantLabelById);
router.post('/', createPlantLabel);
router.patch('/:id', updateLabel);
router.delete('/:id', deleteLabel);

export default router;
