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
exports.initDb = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
exports.pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield exports.pool.connect();
    try {
        // Create Users first
        yield client.query(`
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
        yield client.query(`
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
        yield client.query(`
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
        yield client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
        // Migrations for Properties table (ensure new fields exist)
        yield client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type VARCHAR(50) DEFAULT 'Apartment'`);
        yield client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS listing_type VARCHAR(20) DEFAULT 'Resale'`);
        yield client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS construction_status VARCHAR(50) DEFAULT 'Ready To Move In'`);
        yield client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 2`);
        yield client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS furnishing VARCHAR(50) DEFAULT 'Semi Furnished'`);
        yield client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_sqft NUMERIC(15, 2) DEFAULT 1200`);
        yield client.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)`);
        yield client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`);
        // Migrations for Enquiries table
        yield client.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS guest_first_name VARCHAR(100)`);
        yield client.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS guest_last_name VARCHAR(100)`);
        yield client.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS guest_email VARCHAR(100)`);
        yield client.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS guest_phone VARCHAR(20)`);
        console.log("Database initialized successfully");
    }
    catch (err) {
        console.error("Failed to initialize database", err);
    }
    finally {
        client.release();
    }
});
exports.initDb = initDb;
