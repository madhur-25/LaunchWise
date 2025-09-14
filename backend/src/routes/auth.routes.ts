// backend/src/routes/experiment.routes.ts
import { Router } from 'express';
import { getAllExperiments } from '../controllers/experiment.controller'; // <-- Check this import

const router = Router();

// CRITICAL LINE: Make sure this is correct
router.get('/experiments', getAllExperiments);

export default router; // <-- Make sure it's exporting