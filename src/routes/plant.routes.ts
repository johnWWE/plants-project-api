import { Router } from 'express';

import { createPlant, deletePlant, getPlant, getPlants } from '../controllers/plant.controller';
import Plant from '../models/plant.model';

const router: Router = Router();

router.get('/', getPlants);
router.get('/:id', getPlant);
router.post('/', createPlant);
// router.put('/:id', updatePlant);
router.delete('/:id', deletePlant);

router.put('/update-leaves', async (req, res, next) => {
  try {
    const result = await Plant.updateMany({ leaf: { $type: 'number' } }, { $set: { leaf: [] } });

    res.json({ message: 'Leaf fields updated successfully', result });
  } catch (error) {
    next(error as Error);
  }
});

export default router;
