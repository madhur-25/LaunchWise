import { Router } from 'express';
import { 
  createExperiment, 
  getAllExperiments, 
  updateExperiment, 
  deleteExperiment 
} from '../controllers/experiment.controller';
import { validate } from '../middleware/validate';
import { createExperimentSchema, updateExperimentSchema } from '../schemas/experiment.schema';
import { protect } from '../middleware/auth.middleware';

const router = Router();


router.get('/experiments', protect, getAllExperiments);

router.post('/experiments', protect, validate(createExperimentSchema), createExperiment);
router.patch('/experiments/:id', protect, validate(updateExperimentSchema), updateExperiment);
router.delete('/experiments/:id', protect, deleteExperiment);

export default router;

