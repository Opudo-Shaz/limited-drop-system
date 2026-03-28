# Deployment Guide

This project is a monorepo with a Node.js/Express backend and React frontend. Both are deployed together on a single server.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Environment variables configured (see `.env` section below)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/limited-drop"

# Node Environment
NODE_ENV=production

# Server
PORT=3004

# Frontend URL (for CORS in production)
FRONTEND_URL=https://yourdomain.com
```

## Build & Deploy Steps

### 1. Local Build Test
```bash
# Install dependencies
npm install
npm --prefix limited-drop-frontend install

# Build the project
npm run build

# This will:
# - Build React frontend to limited-drop-frontend/build/
# - Compile TypeScript backend to dist/
```

### 2. Database Setup
```bash
# Ensure PostgreSQL is running with your DATABASE_URL
# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

### 3. Start Server in Production
```bash
npm start
```

Access the app at `http://localhost:3004`

## Deployment Steps for pxxl.app

1. **Connect Repository**
   - Go to https://pxxl.app/dashboard/deploy
   - Select your GitHub repository (limited-drop-system)

2. **Configure Build Command**
   - Set build command to: `npm run build`
   - Set start command to: `npm start`

3. **Set Environment Variables**
   - Add all variables from `.env`:
     - `DATABASE_URL`
     - `NODE_ENV=production`
     - `PORT` (if different from 3004)
     - `FRONTEND_URL` (your deployment URL)

4. **Database**
   - Select or create PostgreSQL instance
   - pxxl.app will automatically set `DATABASE_URL`
   - Run migrations after first deploy: `npx prisma migrate deploy`

5. **Deploy**
   - Click Deploy
   - Backend will serve the React build automatically

## Deployment Architecture

```
User Request
    ↓
pxxl.app (Node.js App)
    ├── API Endpoints (/api/*)
    └── Static Frontend Files (index.html, JS, CSS)
    ↓
PostgreSQL Database
```

## Monitoring

- Check server health: `GET /health`
- View metrics: `GET /metrics`
- Logs: Check pxxl.app dashboard logs

## Troubleshooting

**CORS Errors:** Ensure `FRONTEND_URL` matches your deployment domain in production.

**Database Connection:** Verify `DATABASE_URL` is correct and database is accessible.

**Frontend Not Loading:** Check that `npm run build` completed successfully and `limited-drop-frontend/build/` exists.

**Migration Issues:** Run `npx prisma migrate deploy` in the deployment environment after first deploy.
