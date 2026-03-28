# Limited Drop System

A full-stack e-commerce application for managing time-limited product releases with real-time reservations, automatic expiry, and checkout functionality.

## Overview

**Limited Drop System** is a complete solution for managing limited-edition product drops. Customers can reserve products for a fixed duration (5 minutes), and if they don't checkout within that window, the reservation expires and stock is restored automatically.

### Key Features

- **Product Management**: Browse and manage limited-edition products
- **Real-Time Reservations**: Reserve products with automatic 5-minute countdown
- **Automatic Expiry**: Background job that expires stale reservations and restores stock
- **Checkout Flow**: Convert active reservations to orders
- **Stock Management**: Accurate inventory tracking with transaction safety
- **Rate Limiting**: Protect API from abuse (60 requests/minute per IP)
- **CORS Support**: Secure cross-origin requests
- **Database Transactions**: Ensure data consistency during reservation and checkout
- **Production Ready**: Environment-based configuration and static file serving

---

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Language**: TypeScript 6.x
- **Database**: PostgreSQL 12+
- **ORM**: Prisma 7.x with `@prisma/adapter-pg`
- **Validation**: Zod
- **Dev Tools**: ts-node-dev

### Frontend
- **Framework**: React 19.x
- **Language**: TypeScript 4.9.x
- **Build Tool**: Webpack (via react-scripts)
- **HTTP Client**: Axios
- **Styling**: CSS with CSS variables and responsive grid

### DevOps
- **Package Manager**: npm
- **Version Control**: Git
- **Testing**: Jest (configured, examples included)

---

## Project Structure

```
limited-drop-system/
├── src/                           # Backend TypeScript source
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Entry point
│   ├── controllers/              # Request handlers
│   │   ├── checkout.controller.ts
│   │   ├── product.controller.ts
│   │   ├── reservation.controller.ts
│   │   └── user.controller.ts
│   ├── services/                 # Business logic
│   │   ├── checkout.service.ts
│   │   ├── expiration.service.ts
│   │   ├── product.service.ts
│   │   └── reservation.service.ts
│   ├── routes/                   # API route definitions
│   │   ├── checkout.routes.ts
│   │   ├── product.routes.ts
│   │   ├── reservations.routes.ts
│   │   ├── user.routes.ts
│   │   └── products.routes.ts
│   ├── middleware/               # Express middleware
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── validators/               # Input validation schemas (Zod)
│   │   └── reservation.validator.ts
│   ├── lib/
│   │   └── prisma.ts            # Prisma client singleton
│   └── jobs/                     # Background jobs
├── limited-drop-frontend/        # React TypeScript frontend
│   ├── src/
│   │   ├── App.tsx              # Main app component
│   │   ├── App.css              # Global styles (blue/white theme)
│   │   ├── index.tsx            # React entry point
│   │   ├── index.css            # Base styles & typography
│   │   ├── api/                 # API client modules
│   │   │   ├── index.ts         # Axios instance
│   │   │   ├── checkout.ts      # Checkout endpoints
│   │   │   ├── products.ts      # Products endpoints
│   │   │   ├── reservations.ts  # Reservations endpoints
│   │   │   └── users.ts         # Users endpoints
│   │   ├── components/          # Reusable React components
│   │   │   ├── ProductCard.tsx  # Product card with reserve/checkout
│   │   │   └── ReservationTimer.tsx  # Countdown timer
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useProducts.ts   # Products fetching hook
│   │   └── pages/
│   │       └── LimitedDropPage.tsx # Main drop page
│   └── public/                  # Static assets
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── package.json                 # Root dependencies & scripts
├── tsconfig.json                # TypeScript backend config
├── prisma.config.ts             # Prisma configuration
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Example env template
├── DEPLOYMENT.md                # Cloud deployment guide
└── README.md                    # This file
```

---

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- **PostgreSQL** 12 or higher
- **Git** (for version control)

Verify versions:
```bash
node --version  # v18.0.0 or higher
npm --version   # 9.0.0 or higher
psql --version  # PostgreSQL 12 or higher
```

---

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/Opudo-Shaz/limited-drop-system.git
cd limited-drop-system
```

### 2. Install Root & Frontend Dependencies
```bash
npm install
npm --prefix limited-drop-frontend install
```

### 3. Configure Environment Variables
Copy the example and fill in your PostgreSQL details:
```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=3004
FRONTEND_URL=http://localhost:3000
```

### 4. Set Up Database
```bash
# Create database (if not exists)
createdb limited-drop-db

# Run migrations
npx prisma migrate deploy

# (Optional) View database schema in Prisma Studio
npx prisma studio
```

---

## Local Development

### Start Backend (Terminal 1)
```bash
npm run dev
```

Runs on `http://localhost:3004`

- API endpoints: `http://localhost:3004/api/*`
- Health check: `http://localhost:3004/health`
- Metrics: `http://localhost:3004/metrics`

### Start Frontend (Terminal 2)
```bash
cd limited-drop-frontend
npm start
```

Runs on `http://localhost:3000`

Now:
1. Open `http://localhost:3000` in browser
2. Browse products
3. Click "Reserve" to test reservation (5-min countdown starts)
4. Click "Checkout" to convert to order
5. Watch timer expire and stock restore

---

## API Endpoints

### Base URL
```
http://localhost:3004/api
```

### Products
- **List Products**: `GET /products`
  ```json
  Response: {
    "success": true,
    "data": [
      { "id": "uuid", "name": "Product", "stock": 10, "createdAt": "ISO-8601" }
    ]
  }
  ```

- **Create Product**: `POST /products`
  ```json
  Body: { "name": "Limited Shirt", "stock": 50 }
  ```

### Reservations
- **Create Reservation**: `POST /reserve`
  ```json
  Body: {
    "userId": "uuid (valid)",
    "productId": "uuid",
    "quantity": 1
  }
  Response: {
    "success": true,
    "data": {
      "id": "uuid",
      "status": "ACTIVE",
      "expiresAt": "ISO-8601 (5 min from now)"
    }
  }
  ```

### Checkout
- **Checkout Reservation**: `POST /checkout`
  ```json
  Body: { "reservationId": "uuid" }
  Response: {
    "success": true,
    "data": {
      "id": "order-uuid",
      "userId": "uuid",
      "productId": "uuid",
      "quantity": 1
    }
  }
  ```

### Users
- **Create User**: `POST /users`
  ```json
  Body: { "email": "user@example.com" }
  Response: {
    "success": true,
    "data": { "id": "uuid", "email": "user@example.com" }
  }
  ```

### Health & Monitoring
- **Health Check**: `GET /health` → `{ "status": "ok" }`
- **Metrics**: `GET /metrics` → uptime, active reservations, total orders

---

## Frontend Features

### LimitedDropPage
- **Hero Header**: Displays drop title, subtitle, and eye-catching blue gradient
- **Product Grid**: Responsive grid (auto-fit columns based on screen size)
- **Loading State**: Shows "Preparing your drop session..." while fetching data

### ProductCard
- **Product Info**: Name, current stock quantity
- **Reserve Button**: 
  - Primary blue gradient button
  - Disabled if stock ≤ 0
  - Shows "Reserving..." while processing
- **Reservation State**:
  - Blue pill badge with "Reserved" status
  - Live countdown timer (MM:SS format)
  - "Checkout" button to convert to order
- **Error Display**: Red error text if reservation/checkout fails
- **Success Display**: Green success message after checkout

### ReservationTimer
- Counts down from 5 minutes in MM:SS format
- Calls `onExpire()` callback when time reaches zero
- Updates every 1 second

### UI Theme
- **Colors**: Blue (#1768d6, #0e4a95) and white palette
- **Typography**: Manrope (sans-serif) for body, Sora for headings
- **Spacing**: Consistent 1rem grid
- **Responsive**: Works on mobile (320px), tablet, desktop
- **Animations**: Smooth reveal animations on page load

---

## Database Schema

### User
```prisma
id          String   @id @default(uuid())
email       String   @unique
createdAt   DateTime @default(now())
```

### Product
```prisma
id          String   @id @default(uuid())
name        String
stock       Int
createdAt   DateTime @default(now())
```

### Reservation
```prisma
id          String   @id @default(uuid())
userId      String   → User
productId   String   → Product
quantity    Int
status      ReservationStatus (ACTIVE, EXPIRED, COMPLETED)
expiresAt   DateTime (= now + 5 minutes)
createdAt   DateTime @default(now())
```

### Order
```prisma
id          String   @id @default(uuid())
userId      String   → User
productId   String   → Product
quantity    Int
createdAt   DateTime @default(now())
```

### InventoryLog
```prisma
id          String   @id @default(uuid())
productId   String
change      Int      (quantity change, positive or negative)
reason      String   (RESERVATION, RESERVATION_EXPIRED, CHECKOUT)
createdAt   DateTime @default(now())
```

---

## How It Works

### Reservation Flow
1. User clicks "Reserve" on a product
2. Frontend creates a guest user if needed (stored in localStorage)
3. **Backend**:
   - Starts transaction
   - Checks product exists and has stock
   - Checks user doesn't already have ACTIVE reservation for same product
   - Creates reservation with `expiresAt = now + 5 minutes`
   - Decrements product stock
   - Logs inventory change
   - Commits transaction
4. Frontend displays countdown timer
5. User can either:
   - Click "Checkout" before timer ends → converts reservation to order
   - Wait for timer to expire → reservation expires automatically

### Expiration Job
- Runs every 30 seconds (configurable in `src/server.ts`)
- Finds all ACTIVE reservations with `expiresAt <= now`
- For each:
  - Increments product stock back
  - Marks reservation as EXPIRED
  - Logs inventory restoration

### Checkout Flow
1. User clicks "Checkout" while reservation active
2. **Backend**:
   - Starts transaction
   - Finds reservation
   - Validates it's ACTIVE and not expired
   - Creates order record
   - Marks reservation as COMPLETED
   - Logs inventory change (reason: CHECKOUT)
   - Commits transaction
3. Frontend shows success message and clears reservation pill

---

## Key Features Explained

### Rate Limiting
- 60 requests per minute per IP
- Configurable in `src/app.ts`
- Returns 429 if limit exceeded

### CORS
- Allows requests from configured origin (default: `http://localhost:3000`)
- In production, set `FRONTEND_URL` environment variable
- Credentials enabled for cookies (if implemented)

### Error Handling
- Centralized middleware in `src/middleware/errorHandler.ts`
- All errors return JSON with `success: false` and `message`
- Status codes: 400 (validation), 404 (not found), 500 (server error)

### Request Logging
- Morgan logs all HTTP requests
- Custom middleware logs request details

### Database Transactions
- All critical operations use Prisma transactions
- Ensures consistency even if one step fails
- Automatic rollback on error

---

## Testing

### Manual API Testing
Use `curl` or Postman:

```bash
# Create user
curl -X POST http://localhost:3004/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# List products
curl http://localhost:3004/api/products

# Reserve product
curl -X POST http://localhost:3004/api/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"e2696d79-2b35-4f85-866e-d64dad413efc",
    "productId":"<product-uuid>",
    "quantity":1
  }'

# Checkout
curl -X POST http://localhost:3004/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"reservationId":"<reservation-uuid>"}'
```

### Test Reservation Expiry
1. Reserve a product
2. Wait 5 minutes (or check server logs for expiry job)
3. Try to checkout → should get "Reservation has expired" error

### Test Stock Restoration
1. Reserve product (stock decreases)
2. Wait for expiry
3. Wait ~30 seconds for expiry job to run
4. Refresh products list → stock should be restored

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed cloud deployment instructions.

### Quick Summary
1. Build: `npm run build`
2. Set environment variables
3. Start: `npm start`
4. Access at your deployment URL

For pxxl.app:
- Upload repository
- Build command: `npm run build`
- Start command: `npm start`
- Set environment variables in dashboard
- Deploy

---

## Performance Considerations

- **Database Indexes**: Reservation table has index on `(productId, status)` for fast lookups
- **Polling**: Frontend polls products every 5 seconds (configurable in `useProducts` hook)
- **Expiry Job**: Runs every 30 seconds (configurable in `src/server.ts`)
- **Rate Limiting**: 60 requests/min per IP to prevent abuse
- **Caching**: None currently; can add Redis for faster lookups if needed

---

## Future Enhancements

- [ ] User authentication (JWT/OAuth)
- [ ] Order history and tracking
- [ ] Payment integration (Stripe, PayPal)
- [ ] Admin dashboard for product management
- [ ] Email notifications on reservation/expiry
- [ ] WebSocket real-time stock updates
- [ ] Inventory forecasting
- [ ] Waitlist for sold-out products
- [ ] Bulk product import/export
- [ ] Analytics and reporting

---

## Troubleshooting

### PostgreSQL Connection Error
**Error**: `error ECONNREFUSED 127.0.0.1:5432`

**Fix**: Ensure PostgreSQL is running
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\data" start
```

### Port Already in Use
**Error**: `address already in use :::3004`

**Fix**: Change PORT in `.env` or kill process using port 3004

### UUID Validation Error on Reserve
**Error**: `Invalid UUID` for userId

**Fix**: Ensure you're using a real user UUID from `/api/users` endpoint

### Reservation Expired Error on Checkout
**Error**: `Reservation has expired`

**Fix**: Reservation expires after 5 minutes. Create a new one.

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

---

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Support

For issues, questions, or feature requests, please open an issue on GitHub or contact the development team.

---

## Authors

- Created by Charlotte Sharon
- Built with TypeScript, React, Express, and PostgreSQL

---

**Last Updated**: March 28, 2026
