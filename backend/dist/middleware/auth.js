"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentOnly = exports.optionalAuthenticate = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_12345';
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log('Authenticated Request:', { id: decoded.id, role: decoded.role });
        next();
    }
    catch (ex) {
        console.error('Invalid Token:', ex.message);
        res.status(400).json({ error: 'Invalid token.' });
    }
};
exports.authenticate = authenticate;

const optionalAuthenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token)
        return next();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
    }
    catch (ex) { }
    next();
};
exports.optionalAuthenticate = optionalAuthenticate;
const agentOnly = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'agent') {
        return res.status(403).json({ error: 'Access denied. Only agents can perform this action.' });
    }
    next();
};
exports.agentOnly = agentOnly;
