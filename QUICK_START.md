# Quick Start Guide - Backend Setup

## ✅ Backend Status: COMPLETE & READY TO USE

Your backend is fully implemented with all features. Just follow these simple steps to get it running!

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
cd "Dashboard backend"
npm install
```

### Step 2: Configure Environment
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and add your MongoDB connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

### Step 3: Start the Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.mongodb.net
🚀 Server running in development mode on port 5000
```

---

## 🔑 Getting MongoDB Connection String

### Option 1: MongoDB Atlas (Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with your database name (e.g., `business_dashboard`)

Example:
```
mongodb+srv://username:password@cluster0.mongodb.net/business_dashboard?retryWrites=true&w=majority
```

### Option 2: Local MongoDB
If you have MongoDB installed locally:
```
mongodb://localhost:27017/business_dashboard
```

---

## 🧪 Test the Backend

### 1. Health Check
Open browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-27T10:00:00.000Z"
}
```

### 2. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@businesshub.com",
    "password": "admin123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@businesshub.com",
    "password": "admin123"
  }'
```

Save the token from the response!

---

## 📁 What's Included

### ✅ Complete Features
- **Authentication**: JWT-based login/signup with bcrypt password hashing
- **Client Management**: Full CRUD operations with search and filters
- **Payment Tracking**: Installment management with analytics
- **Team Management**: Complete team member management
- **Dashboard Analytics**: Real-time statistics and charts
- **Security**: Helmet, CORS, rate limiting, input validation
- **Error Handling**: Centralized error handling
- **Logging**: Morgan HTTP request logging

### ✅ All Models Created
- User (authentication)
- Client (client management)
- Payment (payment tracking with installments)
- TeamMember (team management)

### ✅ All Controllers Implemented
- authController.js (register, login, getMe, logout)
- clientController.js (CRUD + search + filters)
- paymentController.js (CRUD + installments + analytics)
- teamController.js (CRUD + search + filters)
- dashboardController.js (statistics + charts data)

### ✅ All Routes Configured
- /api/auth/* (authentication routes)
- /api/clients/* (client routes)
- /api/payments/* (payment routes)
- /api/team/* (team routes)
- /api/dashboard/* (dashboard routes)

### ✅ Security Middleware
- JWT authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation
- Error handling
- CORS configuration

---

## 📚 Documentation

- **README.md** - Complete setup and deployment guide
- **API_DOCUMENTATION.md** - Full API endpoint documentation
- **QUICK_START.md** - This file (quick setup guide)

---

## 🔗 Next Steps: Connect Frontend

Once your backend is running, update the frontend to use the API:

1. Install axios in frontend:
   ```bash
   cd "Dashboard frontend"
   npm install axios
   ```

2. Create `.env` file in frontend:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Follow the **BACKEND_INTEGRATION_GUIDE.md** in the frontend folder for detailed integration steps

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check your connection string is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user has correct permissions

### Port Already in Use
Change the PORT in `.env` file:
```env
PORT=5001
```

### Module Not Found
Run `npm install` again to ensure all dependencies are installed

---

## 📞 API Endpoints Summary

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Clients
- GET `/api/clients` - Get all clients
- POST `/api/clients` - Create client
- PUT `/api/clients/:id` - Update client
- DELETE `/api/clients/:id` - Delete client

### Payments
- GET `/api/payments` - Get all payments
- POST `/api/payments` - Create payment
- POST `/api/payments/:id/installments` - Record installment
- GET `/api/payments/analytics` - Get analytics

### Team
- GET `/api/team` - Get all team members
- POST `/api/team` - Add team member
- PUT `/api/team/:id` - Update team member
- DELETE `/api/team/:id` - Delete team member

### Dashboard
- GET `/api/dashboard/stats` - Get statistics
- GET `/api/dashboard/clients` - Get client data
- GET `/api/dashboard/projects` - Get project data

---

## ✨ You're All Set!

Your backend is production-ready with:
- ✅ Clean, professional code
- ✅ Proper error handling
- ✅ Security best practices
- ✅ Complete documentation
- ✅ All features implemented

Just add your MongoDB URI and start the server! 🚀
