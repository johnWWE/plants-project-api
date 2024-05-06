import { Router } from 'express';

import { createPlant, deletePlant, getPlants, updatePlant } from '../controllers/plant.controller';

const router: Router = Router();

router.get('/', getPlants);
router.post('/', createPlant);
router.put('/:id', updatePlant);
router.delete('/:id', deletePlant);

// router.put('/update-leaves', async (req, res, next) => {
//   try {
//     const result = await Plant.updateMany({ leaf: { $type: 'number' } }, { $set: { leaf: [] } });

//     res.json({ message: 'Leaf fields updated successfully', result });
//   } catch (error) {
//     next(error as Error);
//   }
// });

export default router;
