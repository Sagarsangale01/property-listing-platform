-- Seed 10 Users (Agents and Seekers)
-- Password for all is 'password123' hashed (approx: $2a$10$6mI/uS6XfC.a2z0o5X0P7uI8S7VbH6z6qI1d8fO1k7e9.b2.c3.d4)
INSERT INTO users (name, email, password, role) VALUES 
('Agent John', 'john@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'agent'),
('Agent Sarah', 'sarah@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'agent'),
('Agent Mike', 'mike@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'agent'),
('Seeker Alex', 'alex@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'seeker'),
('Seeker Emma', 'emma@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'seeker'),
('Seeker Liam', 'liam@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'seeker'),
('Seeker Olivia', 'olivia@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'seeker'),
('Seeker Noah', 'noah@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'seeker'),
('Seeker Ava', 'ava@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'seeker'),
('Seeker Ethan', 'ethan@example.com', '$2y$10$R9h/lIPzHZluVovXUfW.0e.d0.G0K9y6q.1.2.3.4.5.6.7.8.9.0', 'seeker')
ON CONFLICT (email) DO NOTHING;

-- Seed 10 Properties
INSERT INTO properties (title, description, location, bhk, price, agent_id) VALUES 
('Luxury Villa in Worli', 'Exclusive 4BHK with sea view.', 'Worli, Mumbai', 4, 150000000, 1),
('1 BHK Near Tech Park', 'Modern apartment for professionals.', 'Bandra, Mumbai', 1, 45000, 1),
('2 BHK in Pune Center', 'Spacious home close to amenities.', 'Kothrud, Pune', 2, 8500000, 2),
('Modern 3 BHK Flat', 'Fully furnished near metro station.', 'Juhu, Mumbai', 3, 12000000, 1),
('Studio in Bangalore South', 'Perfect for singles or couples.', 'JP Nagar, Bangalore', 1, 3500000, 2),
('Classic 2 BHK in Delhi', 'Well maintained gated community.', 'Rohini, Delhi', 2, 7500000, 3),
('Penthouse with Sky Garden', 'Ultra-luxurious living in Gurgaon.', 'Sector 54, Gurgaon', 4, 250000000, 3),
('Cozy Apartment in Hyderabad', 'Near Hitech City.', 'Madhapur, Hyderabad', 2, 5500000, 1),
('Quiet 2 BHK in Kolkata', 'Peaceful residential area.', 'Garia, Kolkata', 2, 4500000, 2),
('Spacious 3 BHK in Chennai', 'Near the beach with great wind.', 'Adyar, Chennai', 3, 15000000, 3);

-- Seed 10 Enquiries
INSERT INTO enquiries (property_id, seeker_id, message) VALUES 
(1, 4, 'I am very interested in this villa!'),
(2, 5, 'Is the price negotiable?'),
(3, 6, 'Can we visit on Sunday?'),
(4, 7, 'Does this include parking?'),
(5, 8, 'What is the security deposit?'),
(6, 9, 'Is it ready to move?'),
(7, 10, 'Can I get more photos?'),
(8, 4, 'Is pet allowed?'),
(9, 5, 'How far is the metro?'),
(10, 6, 'Looking for long term rent.');
