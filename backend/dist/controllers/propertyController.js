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
exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getPropertyById = exports.getAgentProperties = exports.getProperties = void 0;
const db_1 = require("../config/db");
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location, bhk, minPrice, maxPrice, construction_status, property_type, listing_type } = req.query;
        let query = 'SELECT * FROM properties WHERE 1=1';
        let values = [];
        let valueCount = 1;
        if (location) {
            query += ` AND location ILIKE $${valueCount}`;
            values.push(`%${location}%`);
            valueCount++;
        }
        if (bhk) {
            query += ` AND bhk = $${valueCount}`;
            values.push(parseInt(bhk));
            valueCount++;
        }
        if (minPrice) {
            query += ` AND price >= $${valueCount}`;
            values.push(parseFloat(minPrice));
            valueCount++;
        }
        if (maxPrice) {
            query += ` AND price <= $${valueCount}`;
            values.push(parseFloat(maxPrice));
            valueCount++;
        }
        if (construction_status) {
            query += ` AND construction_status = $${valueCount}`;
            values.push(construction_status);
            valueCount++;
        }
        if (property_type) {
            query += ` AND property_type = $${valueCount}`;
            values.push(property_type);
            valueCount++;
        }
        if (listing_type) {
            query += ` AND listing_type = $${valueCount}`;
            values.push(listing_type);
            valueCount++;
        }
        query += ' ORDER BY created_at DESC';
        const result = yield db_1.pool.query(query, values);
        console.log(`Public fetch: found ${result.rows.length} properties.`);
        if (result.rows.length > 0) {
            console.log('Sample agent_ids in DB:', result.rows.map(r => r.agent_id));
        }
        res.json(result.rows);
    }
    catch (error) {
        console.error('getProperties Error:', error);
        res.status(500).json({ error: 'Error fetching properties' });
    }
});
exports.getProperties = getProperties;
const getAgentProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const agentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log('Fetching properties for agentId:', agentId);
        const result = yield db_1.pool.query('SELECT * FROM properties WHERE agent_id = $1 ORDER BY created_at DESC', [agentId]);
        console.log(`Found ${result.rows.length} properties for agent ${agentId}`);
        res.json(result.rows);
    }
    catch (error) {
        console.error('getAgentProperties Error:', error);
        res.status(500).json({ error: 'Error fetching agent properties' });
    }
});
exports.getAgentProperties = getAgentProperties;
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield db_1.pool.query(`SELECT p.*, u.name as agent_name, u.email as agent_email 
       FROM properties p 
       JOIN users u ON p.agent_id = u.id 
       WHERE p.id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching property' });
    }
});
exports.getPropertyById = getPropertyById;
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, location, bhk, price, image_url, property_type, listing_type, construction_status, bathrooms, furnishing, area_sqft } = req.body;
        const agentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log('Creating property for agentId:', agentId);
        if (!title || !location || !bhk || !price) {
            return res.status(400).json({ error: 'Title, location, bhk, and price are required' });
        }
        const result = yield db_1.pool.query(`INSERT INTO properties 
       (title, description, location, bhk, price, image_url, agent_id, property_type, listing_type, construction_status, bathrooms, furnishing, area_sqft) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`, [
            title, description, location, bhk, price, image_url, agentId,
            property_type || 'Apartment',
            listing_type || 'Resale',
            construction_status || 'Ready To Move In',
            bathrooms || 2,
            furnishing || 'Semi Furnished',
            area_sqft || 1200
        ]);
        console.log('Property created successfully with ID:', result.rows[0].id, 'assigned to agent:', result.rows[0].agent_id);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating property' });
    }
});
exports.createProperty = createProperty;
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { title, description, location, bhk, price, image_url, property_type, listing_type, construction_status, bathrooms, furnishing, area_sqft } = req.body;
        const agentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const property = yield db_1.pool.query('SELECT * FROM properties WHERE id = $1', [id]);
        if (property.rows.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }
        if (property.rows[0].agent_id !== agentId) {
            return res.status(403).json({ error: 'You can only edit your own properties' });
        }
        const result = yield db_1.pool.query(`UPDATE properties SET 
       title = $1, description = $2, location = $3, bhk = $4, price = $5, image_url = $6,
       property_type = $7, listing_type = $8, construction_status = $9, bathrooms = $10, furnishing = $11, area_sqft = $12
       WHERE id = $13 RETURNING *`, [
            title || property.rows[0].title,
            description || property.rows[0].description,
            location || property.rows[0].location,
            bhk || property.rows[0].bhk,
            price || property.rows[0].price,
            image_url || property.rows[0].image_url,
            property_type || property.rows[0].property_type,
            listing_type || property.rows[0].listing_type,
            construction_status || property.rows[0].construction_status,
            bathrooms || property.rows[0].bathrooms,
            furnishing || property.rows[0].furnishing,
            area_sqft || property.rows[0].area_sqft,
            id
        ]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating property' });
    }
});
exports.updateProperty = updateProperty;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const agentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const property = yield db_1.pool.query('SELECT * FROM properties WHERE id = $1', [id]);
        if (property.rows.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }
        if (property.rows[0].agent_id !== agentId) {
            return res.status(403).json({ error: 'You can only delete your own properties' });
        }
        yield db_1.pool.query('DELETE FROM properties WHERE id = $1', [id]);
        res.json({ message: 'Property deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting property' });
    }
});
exports.deleteProperty = deleteProperty;
