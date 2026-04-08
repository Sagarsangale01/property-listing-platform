import { Router } from 'express';
import { getNotifications, markAsRead } from '../../controllers/notificationController';
import { authenticate, agentOnly } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, agentOnly, getNotifications);
router.put('/:id', authenticate, agentOnly, markAsRead);

export default router;
