import { Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const submitEnquiry = async (req: AuthRequest, res: Response) => {
  try {
    const { property_id, message, guest_first_name, guest_last_name, guest_email, guest_phone } = req.body;
    const seekerId = req.user?.id;

    if (!property_id) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    const propertyRes = await pool.query('SELECT * FROM properties WHERE id = $1', [property_id]);
    if (propertyRes.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    const property = propertyRes.rows[0];

    const result = await pool.query(
      'INSERT INTO enquiries (property_id, seeker_id, guest_first_name, guest_last_name, guest_email, guest_phone, message) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [property_id, seekerId || null, guest_first_name || null, guest_last_name || null, guest_email || null, guest_phone || null, message]
    );

    // Notify Agent
    const senderName = seekerId ? 'A registered user' : `${guest_first_name} ${guest_last_name}`.trim() || 'A guest';
    await pool.query(
      'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
      [property.agent_id, `New enquiry received from ${senderName} for your property "${property.title}"`]
    );

    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting enquiry' });
  }
};

export const getAgentEnquiries = async (req: AuthRequest, res: Response) => {
  try {
    const agentId = req.user?.id;
    console.log('Fetching enquiries for agentId:', agentId);

    const query = `
      SELECT e.*, p.title as property_title, u.name as seeker_name, u.email as seeker_email, u.phone as seeker_phone
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      LEFT JOIN users u ON e.seeker_id = u.id
      WHERE p.agent_id = $1
      ORDER BY e.created_at DESC
    `;

    const result = await pool.query(query, [agentId]);
    console.log(`Found ${result.rows.length} enquiries for agent ${agentId}`);
    res.json(result.rows);
  } catch (error) {
    console.error('getAgentEnquiries Error:', error);
    res.status(500).json({ error: 'Error fetching enquiries' });
  }
};
