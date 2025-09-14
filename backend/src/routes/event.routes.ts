// backend/src/routes/event.routes.ts
import { Router } from 'express';
import { trackEvent } from '../controllers/event.controller';

const router = Router();

router.post('/events', trackEvent);

export default router;
