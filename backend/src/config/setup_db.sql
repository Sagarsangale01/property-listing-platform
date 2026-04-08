-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE property_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'property_db')\gexec
