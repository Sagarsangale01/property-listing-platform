import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './config/db';
import authRoutes from './routes/v1/authRoutes';
import propertyRoutes from './routes/v1/propertyRoutes';
import enquiryRoutes from './routes/v1/enquiryRoutes';
import notificationRoutes from './routes/v1/notificationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Root route
app.get('/', (req, res) => {
  res.json({ message: 'Property API is running...' });
});

// APIs Versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/enquiries', enquiryRoutes);
app.use('/api/v1/notifications', notificationRoutes);

const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
