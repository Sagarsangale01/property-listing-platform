"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../../controllers/notificationController");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, auth_1.agentOnly, notificationController_1.getNotifications);
router.put('/:id', auth_1.authenticate, auth_1.agentOnly, notificationController_1.markAsRead);
exports.default = router;
