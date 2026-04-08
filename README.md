# 🏢 THE PROPERTIST | Executive Real Estate Portfolio Management

[![AWS Deployment](https://img.shields.io/badge/Deployed%20to-AWS%20EC2-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
[![Dockerized](https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-black?style=for-the-badge&logo=github-actions)](https://github.com/features/actions)

**The Propertist** is a premium, full-stack real estate intelligence platform engineered for modern property agents and discerning high-end buyers. Built with a focus on luxury aesthetics and high-performance lead conversion, it streamlines the complex journey from property discovery to successful acquisition.

---

## ✨ Premium Feature Ecosystem

### 🏛️ For Agents (The Executive Suite)
- **High-Performance Lead Hub**: A metric-driven dashboard to track active listings and potential leads in real-time.
- **Conversion Intelligence**: In-depth lead profiles including contact details, specific property interest markers, and automated enquiry tracking.
- **Listing Launchpad**: A professional-grade engine for managing advanced property specifications (Area, BHK, Construction Status, Furnishing, etc.).
- **Smart Notifications**: Real-time alerts for new enquiries and property interactions.

### 🔍 For Buyers (The Discovery Engine)
- **Intelligence-Driven Search**: Advanced filtering by budget (INR), BHK configuration, locality, and construction status with live-fetching capability.
- **Micro-Insight Property Pages**: Transparent specifications including valuation summaries, amenity breakdowns, and verified agent status badges.
- **Secure Callback System**: A friction-less, direct communication protocol with authorized property agents.

---

## 🛠️ Technical Architecture

### Frontend Layer
- **Core**: React 18 with Type-Safe Architecture (TypeScript)
- **Design System**: Custom-themed **Material UI (MUI v6)** with a high-gloss, premium aesthetic.
- **Build Tool**: Vite for ultra-fast development and optimized production bundles.
- **State & Auth**: React Context API for global session persistence and JWT token management.

### Backend Infrastructure
- **Runtime**: Node.js & Express.js (TS)
- **Database**: PostgreSQL (Relational) for high-integrity data association.
- **Security**: 24h JWT session persistence, Bcrypt password hashing, and CORS-restricted API access.
- **Service Layer**: Decoupled routes (v1) for Auth, Properties, Enquiries, and Notifications.

### 📊 Data Intelligence (PostgreSQL Schema)
The system operates on a relational blueprint ensuring 100% data integrity:
- **`Users`**: Centralized identity management (Agents vs Seekers).
- **`Properties`**: Rich-metadata storage including agent associations and ultra-fine property specs.
- **`Enquiries`**: Bridging seekers/guests with specific properties and agents.
- **`Notifications`**: Asynchronous status tracking for user engagement.

---

## 📦 Containerization & DevOps

The platform is fully containerized using **Docker**, ensuring consistency across development, staging, and production environments.

### Dockerized Services
1.  **PostgreSQL (v15)**: Persistent data storage with volume mapping.
2.  **API Backend**: Node.js environment with automated build stages.
3.  **Client Frontend**: Multistage build using **Nginx** for optimized static asset delivery.

### ☁️ AWS Cloud Infrastructure
The application is deployed on **AWS EC2** using a modern DevOps strategy:
- **Hosting**: Amazon Linux EC2 Instance.
- **Orchestration**: Docker Compose manages the micro-services mesh.
- **Security**: Security Groups configured for port 80 (HTTP), 443 (HTTPS), and 5000 (Protected API).

### 🔄 CI/CD Optimization
Automated deployment is handled via **GitHub Actions**:
- **Continuous Integration**: On every push to `main`, the code is validated.
- **Automated Deployment**: The `deploy.yml` workflow securely connects to the AWS EC2 instance via SSH, pulls the latest changes, and rebuilds the containers using `docker-compose up --build -d`.

---

## 🚀 Getting Started

### 📦 Option A: Docker Setup (Recommended)
Launch the entire stack with a single command:
```bash
docker-compose up --build -d
```
*Access the frontend at `http://localhost`, API at `http://localhost:5000`.*

### 🛠️ Option B: Local Development
**1. Prerequisites:**
- Node.js (v18+)
- PostgreSQL Instance running locally

**2. Backend Initialization:**
```bash
cd backend
npm install
npm run dev
```

**3. Frontend Launch:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Secure Configuration (.env)

### Backend Configuration (`/backend/.env`)
| Variable | Description | Sample Value |
| :--- | :--- | :--- |
| `DB_HOST` | Database host (use `db` for Docker) | `localhost` |
| `DB_USER` | PostgreSQL Username | `postgres` |
| `DB_PASSWORD` | PostgreSQL Password | `1234` |
| `DB_NAME` | Database Name | `property_db` |
| `JWT_SECRET` | Secret key for token signing | `[Required]` |

### Frontend Configuration (`/frontend/.env`)
| Variable | Description | Sample Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Endpoint for the API | `http://localhost:5000/api/v1` |
| `VITE_APP_NAME` | Application Brand Name | `The Propertist Platform` |

---
*Created for the professional real estate market. Engineered for excellence.*
