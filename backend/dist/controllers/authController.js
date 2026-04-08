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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_12345';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const result = yield db_1.pool.query('INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role', [name, email, hashedPassword, phone || null, role || 'seeker']);
        const user = result.rows[0];
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ message: 'User registered successfully', token, user });
    }
    catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const result = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});
exports.login = login;
