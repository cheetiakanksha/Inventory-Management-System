# Secure Inventory Management System

Production-oriented inventory management application with secure REST APIs, PostgreSQL + Prisma, JWT auth, and a lightweight frontend dashboard.

## Tech Stack
- Node.js + Express
- PostgreSQL (Railway compatible)
- Prisma ORM
- Vanilla HTML/CSS/JavaScript frontend
- JWT auth + bcrypt password hashing

## Features
- Authentication: register + login
- Product CRUD with secure REST design
- SKU uniqueness enforcement
- Input validation and sanitization
- Centralized error handling with consistent response format
- Rate limiting + Helmet + CORS hardening
- Environment-based configuration
- Frontend integration with loading/error states and form validation

## Project Structure
```txt
inventory-backend/
├── docs/
│   └── SYSTEM_DESIGN.md
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── common.js
│   ├── login.js
│   ├── register.js
│   ├── dashboard.js
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── index.html
│   └── styles.css
└── src/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── routes/
    ├── services/
    ├── utils/
    ├── validators/
    ├── app.js
    └── server.js
```

## System Design Document
Detailed architecture and system design notes are in:
- `docs/SYSTEM_DESIGN.md`

## Live Deployment
- GitHub Repo: `https://github.com/cheetiakanksha/Inventory-Management-System`
- Live URL: `https://inventory-management-system-production-1cdc.up.railway.app`
- Health check: `https://inventory-management-system-production-1cdc.up.railway.app/api/health`

## Setup
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your Railway PostgreSQL `DATABASE_URL` and a strong `JWT_SECRET`.

4. Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:deploy
```

5. Start the app:
```bash
npm run dev
```

6. Open:
- Login: `http://localhost:<PORT>/login`
- Register: `http://localhost:<PORT>/register`
- Dashboard: `http://localhost:<PORT>/dashboard`
- Health endpoint: `http://localhost:<PORT>/api/health`

## Railway Deployment
1. Set service variables:
- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `JWT_SECRET=<strong-random-secret>`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://inventory-management-system-production-1cdc.up.railway.app`
2. Build command:
```bash
npm install
```
3. Start command:
```bash
npx prisma migrate deploy && node src/server.js
```
4. Health check path:
- `/api/health`

## DNS Note (Local Machine)
If your local DNS resolver cannot resolve Railway `*.up.railway.app` temporarily, a local hosts override can be used:
```bash
echo "151.101.66.15 inventory-management-system-production-1cdc.up.railway.app" | sudo tee -a /etc/hosts
```

## Environment Variables
- `NODE_ENV`: `development` | `production`
- `PORT`: server port
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: signing key for JWT tokens
- `JWT_EXPIRES_IN`: token duration (example: `1h`)
- `CORS_ORIGIN`: allowed origin(s), comma separated
- `RATE_LIMIT_WINDOW_MS`: rate-limit window in milliseconds
- `RATE_LIMIT_MAX`: max requests per window per IP

## API Documentation
### Response Format
Success:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "...",
  "details": []
}
```

### Auth Endpoints
#### `POST /api/auth/register`
Request:
```json
{
  "email": "owner@example.com",
  "password": "StrongPass123",
  "name": "Owner"
}
```
Responses:
- `201` user created
- `400` validation error / duplicate email

#### `POST /api/auth/login`
Request:
```json
{
  "email": "owner@example.com",
  "password": "StrongPass123"
}
```
Responses:
- `200` returns JWT token
- `401` invalid credentials

### Product Endpoints (Bearer Token Required)
Add header:
```txt
Authorization: Bearer <token>
```

#### `GET /api/products`
- `200` list all products

#### `GET /api/products/:id`
- `200` product fetched
- `404` product not found

#### `POST /api/products`
Request:
```json
{
  "name": "Wireless Mouse",
  "sku": "MOUSE-001",
  "price": 29.99,
  "quantity": 120,
  "description": "2.4GHz ergonomic wireless mouse"
}
```
Responses:
- `201` created
- `400` validation/duplicate SKU error

#### `PATCH /api/products/:id`
Request (partial allowed):
```json
{
  "price": 24.99,
  "quantity": 110
}
```
Responses:
- `200` updated
- `400` validation/duplicate SKU error
- `404` product not found

#### `DELETE /api/products/:id`
- `200` deleted
- `404` product not found

### Health Endpoint
#### `GET /api/health`
- `200` service status and uptime

## Database Schema
### `Product`
- `id`: UUID (PK)
- `name`: string
- `sku`: unique string + index
- `price`: decimal(10,2), non-negative (validated + DB check constraint)
- `quantity`: integer, non-negative (validated + DB check constraint)
- `description`: optional string
- `createdAt`, `updatedAt`: timestamps

### `User`
- `id`: UUID (PK)
- `email`: unique string + index
- `passwordHash`: bcrypt hash
- `name`: optional string
- `createdAt`, `updatedAt`: timestamps

## Security Considerations Implemented
- Backend input validation on every write endpoint (`express-validator`)
- Payload sanitization (`trim`, `escape`, format checks)
- JWT token-based authentication for product APIs
- Password hashing with bcrypt
- Rate limiting (`express-rate-limit`)
- Secure headers via Helmet
- CORS policy via environment configuration
- JSON body size limit to reduce abuse
- Consistent errors without stack trace leakage
- No hardcoded secrets (all sensitive data in `.env`)

## Assumptions
- Single-tenant business context (one organization)
- All authenticated users can manage inventory products
- Frontend served by same backend process for simplicity
- Railway PostgreSQL is the deployment database

## Suggested Production Next Steps
- Add role-based authorization
- Add refresh tokens and token revocation strategy
- Add automated tests (unit + integration)
- Add audit logs for inventory changes
- Add pagination/filtering/search on product list
