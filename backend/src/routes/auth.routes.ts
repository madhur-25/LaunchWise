// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { signUp } from '../controllers/auth.controller';

const router = Router();

// Define the route: POST /api/v1/auth/signup
router.post('/signup', signUp);

export default router;
