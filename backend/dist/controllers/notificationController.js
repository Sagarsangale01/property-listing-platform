"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = void 0;
const db_1 = require("../config/db");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const result = yield db_1.pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20', [userId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});
exports.getNotifications = getNotifications;
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        yield db_1.pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [id, userId]);
        res.json({ message: 'Notification marked as read' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating notification' });
    }
});
exports.markAsRead = markAsRead;
