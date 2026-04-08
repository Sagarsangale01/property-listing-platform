"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const propertyController_1 = require("../../controllers/propertyController");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', propertyController_1.getProperties);
// Protected agent routes
router.get('/my/properties', auth_1.authenticate, auth_1.agentOnly, propertyController_1.getAgentProperties);
router.get('/:id', propertyController_1.getPropertyById);
router.post('/', auth_1.authenticate, auth_1.agentOnly, propertyController_1.createProperty);
router.put('/:id', auth_1.authenticate, auth_1.agentOnly, propertyController_1.updateProperty);
router.delete('/:id', auth_1.authenticate, auth_1.agentOnly, propertyController_1.deleteProperty);
exports.default = router;
