# Restaurant Ordering & Table Reservation System (MERN Stack)

A full-stack web application that lets customers browse restaurants, reserve tables,
order food online, pay, and track their order in real time — with a complete admin
dashboard for restaurant, menu, table, reservation, order, customer, offer, and
report management.

## Tech Stack

- **Frontend:** React 18 (Vite), React Router, Axios, Context API (Auth + Cart)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JSON Web Tokens (JWT), bcrypt password hashing
- **Payments:** Simulated payment-gateway module (swap for Razorpay/Stripe in production)

## Project Structure

```
restaurant-system/
├── server/                 # Express + MongoDB backend
│   ├── config/db.js
│   ├── models/              # Mongoose schemas (User, Restaurant, Table, Reservation,
│   │                          Category, MenuItem, Order, Payment, Review, Notification)
│   ├── middleware/          # JWT auth, admin-only guard, error handler
│   ├── controllers/         # Route handler logic
│   ├── routes/               # Express routers
│   ├── utils/generateToken.js
│   ├── seed/seed.js         # Sample data seeder
│   ├── server.js            # App entry point
│   └── .env.example
│
└── client/                 # React (Vite) frontend
    ├── src/
    │   ├── api/axios.js      # Configured Axios instance (adds JWT header)
    │   ├── context/          # AuthContext, CartContext
    │   ├── components/       # Navbar, Footer, cards, ProtectedRoute, etc.
    │   ├── pages/            # Customer pages
    │   ├── pages/admin/      # Admin dashboard pages
    │   └── styles/index.css
    └── .env.example
```

## Getting Started

### Prerequisites
- Node.js v18+ and npm
- A MongoDB instance (local `mongod` or a free MongoDB Atlas cluster)

### 1. Backend Setup

```bash
cd server
npm installn
cp .env.example .env
# edit .env and set MONGO_URI, JWT_SECRET, etc.
npm run seed     # populates sample restaurant, menu, tables, and demo users
npm run dev      # starts the API on http://localhost:5000
```

Demo accounts created by the seed script:
- **Admin:** admin@restaurant.com / admin123
- **Customer:** customer@example.com / customer123

### 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# ensure VITE_API_URL points to your backend, e.g. http://localhost:5000/api
npm run dev      # starts the app on http://localhost:5173
```

### 3. Using the App
- Visit `http://localhost:5173`
- Browse restaurants → view menu → reserve a table or add items to cart
- Log in as a customer to reserve tables, place orders, and track them
- Log in as `admin@restaurant.com` to access `/admin` and manage the whole system

## Key API Endpoints

| Method | Endpoint                          | Description                       |
|--------|------------------------------------|------------------------------------|
| POST   | /api/auth/register                | Register a new customer            |
| POST   | /api/auth/login                   | Login and receive a JWT            |
| GET    | /api/restaurants                  | List/search restaurants            |
| GET    | /api/menu?restaurantId=            | Get menu items for a restaurant    |
| POST   | /api/reservations                 | Book a table                       |
| POST   | /api/orders                       | Place an order                     |
| POST   | /api/payments                     | Pay for an order                   |
| GET    | /api/orders/:id                   | Track an order                     |
| GET    | /api/admin/dashboard              | Admin dashboard statistics         |
| GET    | /api/admin/reports/sales          | Sales report                       |

Full route list is in `server/routes/`.

## Notes for Production Use
- Replace the simulated payment logic in `paymentController.js` with a real gateway
  (Razorpay, Stripe, etc.) and verify transactions via signed webhooks.
- Set a strong, random `JWT_SECRET` and appropriate `JWT_EXPIRES_IN`.
- Add rate limiting, request validation (e.g. `express-validator` or `zod`), and
  centralized logging before deploying publicly.
- Configure MongoDB Atlas network access rules and use environment-specific `.env` files.
