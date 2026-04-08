"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiryController_1 = require("../../controllers/enquiryController");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
// Seeker routes
router.post('/', auth_1.optionalAuthenticate, enquiryController_1.submitEnquiry);
// Agent routes
router.get('/agent', auth_1.authenticate, auth_1.agentOnly, enquiryController_1.getAgentEnquiries);
exports.default = router;
