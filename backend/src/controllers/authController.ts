import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_12345';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role',
      [name, email, hashedPassword, phone || null, role || 'seeker']
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};
