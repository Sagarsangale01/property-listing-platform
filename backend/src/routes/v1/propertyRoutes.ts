import { Router } from 'express';
import { getProperties, getAgentProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from '../../controllers/propertyController';
import { authenticate, agentOnly } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProperties);

// Protected agent routes
router.get('/my/properties', authenticate, agentOnly, getAgentProperties);
router.get('/:id', getPropertyById);
router.post('/', authenticate, agentOnly, createProperty);
router.put('/:id', authenticate, agentOnly, updateProperty);
router.delete('/:id', authenticate, agentOnly, deleteProperty);

export default router;
