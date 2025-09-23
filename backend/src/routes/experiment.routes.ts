import { Router } from 'express';
import { 
  createExperiment, 
  getAllExperiments, 
  updateExperiment, 
  deleteExperiment 
} from '../controllers/experiment.controller';
import { validate } from '../middleware/validate';
import { createExperimentSchema, updateExperimentSchema } from '../schemas/experiment.schema';

import { protect } from '../middleware/auth.middleware'; // 1. Import the bouncer

const router = Router();

//  main dashboard can load.
router.get('/experiments', getAllExperiments);

// 2. Apply the 'protect' middleware to all routes that modify data.
//  `protect` -> `validate` -> `controller`.
router.post('/experiments', protect, validate(createExperimentSchema), createExperiment);
router.patch('/experiments/:id', protect, validate(updateExperimentSchema), updateExperiment);
router.delete('/experiments/:id', protect, deleteExperiment);

export default router;

