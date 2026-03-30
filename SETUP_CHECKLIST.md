# Backend Setup Checklist

Use this checklist to get your backend up and running quickly!

---

## ✅ Pre-Setup Checklist

### 1. Prerequisites Installed
- [ ] Node.js (v14 or higher) installed
  - Check: `node --version`
- [ ] npm installed
  - Check: `npm --version`
- [ ] MongoDB account created (MongoDB Atlas) OR local MongoDB installed

---

## 🚀 Setup Steps

### Step 1: Install Dependencies
```bash
cd "Dashboard backend"
npm install
```

**Expected Output:**
```
added 150+ packages
```

**Checklist:**
- [ ] All packages installed successfully
- [ ] No error messages
- [ ] `node_modules` folder created

---

### Step 2: Get MongoDB Connection String

#### Option A: MongoDB Atlas (Recommended - Free)
1. [ ] Go to https://www.mongodb.com/cloud/atlas
2. [ ] Sign up for free account
3. [ ] Create new cluster (free tier M0)
4. [ ] Wait for cluster to be created (2-3 minutes)
5. [ ] Click "Connect" button
6. [ ] Choose "Connect your application"
7. [ ] Copy connection string
8. [ ] Replace `<password>` with your database password
9. [ ] Replace `<dbname>` with `business_dashboard`

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/business_dashboard?retryWrites=true&w=majority
```

#### Option B: Local MongoDB
1. [ ] Install MongoDB locally
2. [ ] Start MongoDB service
3. [ ] Use connection string: `mongodb://localhost:27017/business_dashboard`

---

### Step 3: Configure Environment Variables

1. [ ] Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```

2. [ ] Open `.env` file in text editor

3. [ ] Update the following values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration (REQUIRED - Add your connection string)
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/business_dashboard

# JWT Configuration (REQUIRED - Change this secret)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_random
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Checklist:**
- [ ] `.env` file created
- [ ] `MONGODB_URI` updated with your connection string
- [ ] `JWT_SECRET` changed to a random string (at least 32 characters)
- [ ] All other values reviewed

**Generate Random JWT Secret:**
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Online
# Visit: https://randomkeygen.com/
```

---

### Step 4: Start the Server

```bash
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: cluster0.mongodb.net
🚀 Server running in development mode on port 5000
```

**Checklist:**
- [ ] Server started without errors
- [ ] MongoDB connection successful (✅ message)
- [ ] Server running on port 5000

**Common Issues:**
- ❌ "MongoDB Connection Error" → Check your connection string
- ❌ "Port already in use" → Change PORT in .env file
- ❌ "Module not found" → Run `npm install` again

---

## 🧪 Testing the Backend

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-27T10:00:00.000Z"
}
```

**Checklist:**
- [ ] Health check returns success
- [ ] Timestamp is current

---

### Test 2: Register a User

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"admin@businesshub.com\",\"password\":\"admin123\"}"
```

**Using Postman/Insomnia:**
- Method: POST
- URL: http://localhost:5000/api/auth/register
- Headers: Content-Type: application/json
- Body (JSON):
```json
{
  "name": "Admin User",
  "email": "admin@businesshub.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "Admin User",
      "email": "admin@businesshub.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Checklist:**
- [ ] User registered successfully
- [ ] Token received
- [ ] No error messages

**Save the token!** You'll need it for the next tests.

---

### Test 3: Login

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@businesshub.com\",\"password\":\"admin123\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Checklist:**
- [ ] Login successful
- [ ] Token received
- [ ] User data returned

---

### Test 4: Create a Client (Protected Route)

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"clientName\":\"Test Client\",\"projectName\":\"Test Project\",\"email\":\"test@example.com\",\"contact\":\"+1234567890\",\"startDate\":\"2024-03-27\",\"status\":\"development\"}"
```

**Replace `YOUR_TOKEN_HERE` with the token from Test 2 or 3!**

**Expected Response:**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "_id": "65abc789...",
    "clientName": "Test Client",
    "projectName": "Test Project",
    ...
  }
}
```

**Checklist:**
- [ ] Client created successfully
- [ ] Client data returned with ID
- [ ] No authorization errors

---

### Test 5: Get All Clients

**Using curl:**
```bash
curl http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65abc789...",
      "clientName": "Test Client",
      ...
    }
  ]
}
```

**Checklist:**
- [ ] Clients retrieved successfully
- [ ] Count matches number of clients
- [ ] Client data is correct

---

## 📊 Verify Database

### Check MongoDB Atlas
1. [ ] Go to MongoDB Atlas dashboard
2. [ ] Click "Browse Collections"
3. [ ] Verify database `business_dashboard` exists
4. [ ] Verify collections exist:
   - [ ] `users`
   - [ ] `clients`
   - [ ] `payments`
   - [ ] `teammembers`
5. [ ] Check that your test user and client are in the database

---

## 🎯 All Tests Passed?

If all tests passed, your backend is working correctly! ✅

### Next Steps:
1. [ ] Read `API_DOCUMENTATION.md` for all available endpoints
2. [ ] Test other endpoints (payments, team, dashboard)
3. [ ] Connect frontend to backend (see `BACKEND_INTEGRATION_GUIDE.md` in frontend folder)
4. [ ] Deploy to production (see `README.md` deployment section)

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: "MongoDB Connection Error"**
- [ ] Check connection string is correct
- [ ] Verify username and password
- [ ] Check database name is included
- [ ] Ensure IP address is whitelisted in MongoDB Atlas
  - Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
- [ ] Check if MongoDB service is running (local MongoDB)

**Error: "Authentication failed"**
- [ ] Verify database user credentials
- [ ] Check user has read/write permissions
- [ ] Recreate database user if needed

---

### Server Issues

**Error: "Port already in use"**
- [ ] Change PORT in `.env` file to 5001 or another port
- [ ] Kill process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

**Error: "Module not found"**
- [ ] Delete `node_modules` folder
- [ ] Delete `package-lock.json`
- [ ] Run `npm install` again

**Error: "JWT_SECRET is not defined"**
- [ ] Check `.env` file exists
- [ ] Verify `JWT_SECRET` is set in `.env`
- [ ] Restart server after changing `.env`

---

### API Testing Issues

**Error: "Not authorized to access this route"**
- [ ] Check token is included in Authorization header
- [ ] Verify token format: `Bearer <token>`
- [ ] Check token hasn't expired (7 days default)
- [ ] Login again to get new token

**Error: "Validation failed"**
- [ ] Check all required fields are included
- [ ] Verify data types are correct
- [ ] Check email format is valid
- [ ] Review API documentation for required fields

---

## 📞 Need Help?

### Documentation Files
- `README.md` - Complete setup and deployment guide
- `API_DOCUMENTATION.md` - All API endpoints with examples
- `QUICK_START.md` - Quick setup guide
- `IMPLEMENTATION_SUMMARY.md` - What's been built
- `ARCHITECTURE.md` - System architecture overview

### Testing Tools
- **Postman**: https://www.postman.com/downloads/
- **Insomnia**: https://insomnia.rest/download
- **Thunder Client**: VS Code extension

### Resources
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Express.js Docs: https://expressjs.com/
- Mongoose Docs: https://mongoosejs.com/
- JWT.io: https://jwt.io/

---

## ✨ Success!

Once all items are checked, your backend is fully operational and ready to use! 🎉

**What you have:**
- ✅ Complete REST API
- ✅ Secure authentication
- ✅ Database connected
- ✅ All endpoints working
- ✅ Production-ready code

**Next:** Connect your frontend to start using the live data!
