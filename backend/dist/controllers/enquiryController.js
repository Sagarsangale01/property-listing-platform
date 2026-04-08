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
exports.getAgentEnquiries = exports.submitEnquiry = void 0;
const db_1 = require("../config/db");
const submitEnquiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { property_id, message, guest_first_name, guest_last_name, guest_email, guest_phone } = req.body;
        const seekerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!property_id) {
            return res.status(400).json({ error: 'Property ID is required' });
        }
        const propertyRes = yield db_1.pool.query('SELECT * FROM properties WHERE id = $1', [property_id]);
        if (propertyRes.rows.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }
        const property = propertyRes.rows[0];
        const result = yield db_1.pool.query('INSERT INTO enquiries (property_id, seeker_id, guest_first_name, guest_last_name, guest_email, guest_phone, message) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [property_id, seekerId || null, guest_first_name || null, guest_last_name || null, guest_email || null, guest_phone || null, message]);
        // Notify Agent
        const senderName = seekerId ? 'A registered user' : `${guest_first_name} ${guest_last_name}`.trim() || 'A guest';
        yield db_1.pool.query('INSERT INTO notifications (user_id, message) VALUES ($1, $2)', [property.agent_id, `New enquiry received from ${senderName} for your property "${property.title}"`]);
        res.status(201).json({ message: 'Enquiry submitted successfully', enquiry: result.rows[0] });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error submitting enquiry' });
    }
});
exports.submitEnquiry = submitEnquiry;


const getAgentEnquiries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const agentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log('Fetching enquiries for agentId:', agentId);
        const query = `
      SELECT e.*, p.title as property_title, u.name as seeker_name, u.email as seeker_email, u.phone as seeker_phone
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      LEFT JOIN users u ON e.seeker_id = u.id
      WHERE p.agent_id = $1
      ORDER BY e.created_at DESC
    `;
        const result = yield db_1.pool.query(query, [agentId]);
        console.log(`Found ${result.rows.length} enquiries for agent ${agentId}`);
        res.json(result.rows);
    }
    catch (error) {
        console.error('getAgentEnquiries Error:', error);
        res.status(500).json({ error: 'Error fetching enquiries' });
    }
});
exports.getAgentEnquiries = getAgentEnquiries;
