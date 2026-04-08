import { Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating notification' });
  }
};
