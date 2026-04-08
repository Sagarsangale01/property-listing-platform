import { Router } from 'express';
import { submitEnquiry, getAgentEnquiries } from '../../controllers/enquiryController';
import { authenticate, agentOnly, optionalAuthenticate } from '../../middleware/auth';

const router = Router();

// Seeker routes
router.post('/', optionalAuthenticate, submitEnquiry);

// Agent routes
router.get('/agent', authenticate, agentOnly, getAgentEnquiries);

export default router;
