import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_12345';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.user = decoded;
    console.log('Authenticated Request:', { id: decoded.id, role: decoded.role });
    next();
  } catch (ex) {
    console.error('Invalid Token:', (ex as Error).message);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.user = decoded;
  } catch (ex) {}
  next();
};

export const agentOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'agent') {
    return res.status(403).json({ error: 'Access denied. Only agents can perform this action.' });
  }
  next();
};
