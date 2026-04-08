import { Pool } from 'pg';
import { config } from './index';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const initDb = async () => {
  const client = await pool.connect();
  try {
    // Create Users first
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'seeker',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

    // Create Properties (depends on Users)
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(100) NOT NULL,
        bhk INTEGER NOT NULL,
        price NUMERIC(15, 2) NOT NULL,
        image_url VARCHAR(255),
        property_type VARCHAR(50) DEFAULT 'Apartment',
        listing_type VARCHAR(20) DEFAULT 'Resale',
        construction_status VARCHAR(50) DEFAULT 'Ready To Move In',
        bathrooms INTEGER DEFAULT 2,
        furnishing VARCHAR(50) DEFAULT 'Semi Furnished',
        area_sqft NUMERIC(15, 2) DEFAULT 1200,
        agent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

    // Create Enquiries (depends on Users and Properties)
    await client.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        seeker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        guest_first_name VARCHAR(100),
        guest_last_name VARCHAR(100),
        guest_email VARCHAR(100),
        guest_phone VARCHAR(20),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

    // Create Notifications (depends on Users)
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    // Migrations for Properties table (ensure new fields exist)
    await client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type VARCHAR(50) DEFAULT 'Apartment'`);
    await client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS listing_type VARCHAR(20) DEFAULT 'Resale'`);
    await client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS construction_status VARCHAR(50) DEFAULT 'Ready To Move In'`);
    await client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 2`);
    await client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS furnishing VARCHAR(50) DEFAULT 'Semi Furnished'`);
    await client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_sqft NUMERIC(15, 2) DEFAULT 1200`);
    await client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`);

    // Migrations for Enquiries table
    await client.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS guest_first_name VARCHAR(100)`);
    await client.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS guest_last_name VARCHAR(100)`);
    await client.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS guest_email VARCHAR(100)`);
    await client.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS guest_phone VARCHAR(20)`);

    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Failed to initialize database", err);
  } finally {
    client.release();
  }
};
