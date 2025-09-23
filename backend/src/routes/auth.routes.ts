import { Router } from 'express';

import { signUp, login } from '../controllers/auth.controller';

const router = Router();

// This defines the POST endpoint at /signup
router.post('/signup', signUp);

// This defines the POST endpoint at /login
router.post('/login', login);

// This makes the router available to be imported by your main index.ts file
export default router;

