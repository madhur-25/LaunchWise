import { Router } from 'express';
import { 
  createExperiment, 
  getAllExperiments, 
  updateExperiment, 
  deleteExperiment 
} from '../controllers/experiment.controller';

import { validate } from '../middleware/validate'; 
import { createExperimentSchema, updateExperimentSchema } from '../schemas/experiment.schema'; 

const router = Router();

// This route for getting data doesn't need validation
router.get('/experiments', getAllExperiments);


router.post('/experiments', validate(createExperimentSchema), createExperiment);


router.patch('/experiments/:id', validate(updateExperimentSchema), updateExperiment);


router.delete('/experiments/:id', deleteExperiment);

export default router;

