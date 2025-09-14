// backend/src/routes/experiment.routes.ts
import { Router } from 'express';
import { 
    createExperiment, 
    getAllExperiments,
    updateExperiment,
    deleteExperiment 
} from '../controllers/experiment.controller';

const router = Router();

// Define the full CRUD routes for experiments
router.post('/experiments', createExperiment);      // Create
router.get('/experiments', getAllExperiments);      // Read (All)
router.patch('/experiments/:id', updateExperiment); // Update
router.delete('/experiments/:id', deleteExperiment);  // Delete

export default router;
