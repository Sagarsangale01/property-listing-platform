import { Request, Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { location, bhk, minPrice, maxPrice, construction_status, property_type, listing_type } = req.query;
    
    let query = 'SELECT * FROM properties WHERE 1=1';
    let values: any[] = [];
    let valueCount = 1;

    if (location) {
      query += ` AND location ILIKE $${valueCount}`;
      values.push(`%${location}%`);
      valueCount++;
    }
    if (bhk) {
      query += ` AND bhk = $${valueCount}`;
      values.push(parseInt(bhk as string));
      valueCount++;
    }
    if (minPrice) {
      query += ` AND price >= $${valueCount}`;
      values.push(parseFloat(minPrice as string));
      valueCount++;
    }
    if (maxPrice) {
      query += ` AND price <= $${valueCount}`;
      values.push(parseFloat(maxPrice as string));
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

    const result = await pool.query(query, values);
    console.log(`Public fetch: found ${result.rows.length} properties.`);
    if (result.rows.length > 0) {
      console.log('Sample agent_ids in DB:', result.rows.map(r => r.agent_id));
    }
    res.json(result.rows);
  } catch (error) {
    console.error('getProperties Error:', error);
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

export const getAgentProperties = async (req: AuthRequest, res: Response) => {
  try {
    const agentId = req.user?.id;
    console.log('Fetching properties for agentId:', agentId);
    
    const result = await pool.query(
      'SELECT * FROM properties WHERE agent_id = $1 ORDER BY created_at DESC',
      [agentId]
    );
    
    console.log(`Found ${result.rows.length} properties for agent ${agentId}`);
    res.json(result.rows);
  } catch (error) {
    console.error('getAgentProperties Error:', error);
    res.status(500).json({ error: 'Error fetching agent properties' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, u.name as agent_name, u.email as agent_email 
       FROM properties p 
       JOIN users u ON p.agent_id = u.id 
       WHERE p.id = $1`, 
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching property' });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, location, bhk, price, image_url, property_type, listing_type, construction_status, bathrooms, furnishing, area_sqft } = req.body;
    const agentId = req.user?.id;
    console.log('Creating property for agentId:', agentId);

    if (!title || !location || !bhk || !price) {
      return res.status(400).json({ error: 'Title, location, bhk, and price are required' });
    }

    const result = await pool.query(
      `INSERT INTO properties 
       (title, description, location, bhk, price, image_url, agent_id, property_type, listing_type, construction_status, bathrooms, furnishing, area_sqft) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        title, description, location, bhk, price, image_url, agentId, 
        property_type || 'Apartment', 
        listing_type || 'Resale', 
        construction_status || 'Ready To Move In', 
        bathrooms || 2, 
        furnishing || 'Semi Furnished', 
        area_sqft || 1200
      ]
    );

    console.log('Property created successfully with ID:', result.rows[0].id, 'assigned to agent:', result.rows[0].agent_id);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating property' });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, location, bhk, price, image_url, property_type, listing_type, construction_status, bathrooms, furnishing, area_sqft } = req.body;
    const agentId = req.user?.id;

    const property = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    if (property.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.rows[0].agent_id !== agentId) {
      return res.status(403).json({ error: 'You can only edit your own properties' });
    }

    const result = await pool.query(
      `UPDATE properties SET 
       title = $1, description = $2, location = $3, bhk = $4, price = $5, image_url = $6,
       property_type = $7, listing_type = $8, construction_status = $9, bathrooms = $10, furnishing = $11, area_sqft = $12
       WHERE id = $13 RETURNING *`,
      [
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
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating property' });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const agentId = req.user?.id;

    const property = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    if (property.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.rows[0].agent_id !== agentId) {
      return res.status(403).json({ error: 'You can only delete your own properties' });
    }

    await pool.query('DELETE FROM properties WHERE id = $1', [id]);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting property' });
  }
};
