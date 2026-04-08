# THE PROPERTIST | Executive Real Estate Portfolio Management

The Propertist is a high-end, full-stack real estate platform designed for modern property agents and discerning buyers. It combines luxury aesthetics with powerful lead intelligence to streamline the property discovery and acquisition experience.

## ✨ Premium Features

### 🏛️ For Agents (The Executive Suite)
- **High-Performance Dashboard**: Track your active listings and potential leads in a centralized, metric-driven interface.
- **Conversion Intelligence**: Receive detailed leads with guest contact details, message history, and property-specific interest markers.
- **Listing Launchpad**: A professional categorization engine for capturing advanced property specs (BHK, Area, Construction Status, Furnishing, etc.).

### 🔍 For Buyers (The Discovery Engine)
- **Intelligence-Driven Search**: Refine searches by budget (INR), BHK config, construction status, and locality with real-time live-fetching.
- **Micro-Insight Property Pages**: Transparent specifications including valuation summaries, amenity breakdowns, and verified agent badges.
- **Secure Callback System**: Direct, friction-less communication channel to authorized property agents.

## 🛠️ Technical Manifest

### Frontend Architecture
- **Framework**: React 18 with TypeScript 
- **Design System**: High-gloss custom Material UI (MUI v6)
- **State Management**: React Context API for Global Auth & Token Session persistence
- **Responsive Geometry**: Fluid layouts optimized for both ultra-wide desktops and mobile devices

### Backend Architecture
- **Environment**: Node.js & Express.js
- **Database Architecture**: PostgreSQL (Relational) for complex property-lead associations
- **Security Protocols**: JWT (JSON Web Tokens) with 24h session persistence and Bcrypt password hashing
- **Data Integrity**: Enforced foreign key relationships between Agents, Properties, and Enquiries

## 🚀 Deployment & Local Setup

### Prerequisites
- Node.js (v16+)
- PostgreSQL Instance

### Phase 1: Backend Initialization
1. Navigate to `/backend`
2. Configure `.env` (JWT Secret, DB Credentials)
3. Run `npm install`
4. Run `npm run dev` (Tables are auto-initialized on first launch)

### Phase 2: Frontend Launch
1. Navigate to `/frontend`
2. Run `npm install`
3. Run `npm run dev`
4. Access the platform at `http://localhost:5173`

---
*Created for the professional real estate market.*

