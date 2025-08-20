# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the `backend` folder with the following variables:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Stripe API Key (for payment processing)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

## Database Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string and replace `MONGO_URI` in `.env`
4. Make sure to whitelist your IP address in MongoDB Atlas

## Quick Start

### Option 1: Use the batch file (Windows)
```bash
# Simply double-click start-dev.bat or run:
./start-dev.bat
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run server

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Terminal 3 - Admin Panel
cd admin
npm install
npm run dev -- --port 5174
```

## API Endpoints

- Backend API: http://localhost:4000
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5174

## Testing API Connection

1. Backend Health Check: http://localhost:4000/
2. Food List: http://localhost:4000/api/food/list
3. User Registration: POST http://localhost:4000/api/user/register
4. User Login: POST http://localhost:4000/api/user/login

## Troubleshooting

### CORS Issues
- Backend is configured to accept requests from localhost:5173 and localhost:5174
- Ensure your frontend/admin URLs match exactly

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify MONGO_URI format: `mongodb+srv://username:password@cluster.mongodb.net/database_name`
- Check network connectivity

### Port Already in Use
- Backend: Change port in backend/server.js (line 12)
- Frontend: Change in frontend/vite.config.js
- Admin: Run with `npm run dev -- --port YOUR_PORT`
