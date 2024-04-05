import { Router } from 'express';
import { createPlantLabel, getPlantLabel, getPlantLabelById, updateLabel, deleteLabel } from '../controllers/plant.controller';

const router: Router = Router();

router.get('/label', getPlantLabel);
router.get('/label/:id', getPlantLabelById);
router.post('/label', createPlantLabel);
router.patch('/label/:id', updateLabel);
router.delete('/label/:id', deleteLabel);

export default router;
