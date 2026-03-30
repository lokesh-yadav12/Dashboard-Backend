# Backend Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                  (React + TypeScript)                            │
│                  http://localhost:5173                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests (axios)
                         │ Authorization: Bearer <token>
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      EXPRESS SERVER                              │
│                   http://localhost:5000                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              MIDDLEWARE LAYER                          │    │
│  │  • Helmet (Security Headers)                           │    │
│  │  • CORS (Cross-Origin)                                 │    │
│  │  • Body Parser (JSON)                                  │    │
│  │  • Compression                                         │    │
│  │  • Morgan (Logging)                                    │    │
│  │  • Rate Limiter (100 req/15min)                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  ROUTES LAYER                          │    │
│  │                                                         │    │
│  │  /api/auth/*        → authRoutes.js                    │    │
│  │  /api/clients/*     → clientRoutes.js                  │    │
│  │  /api/payments/*    → paymentRoutes.js                 │    │
│  │  /api/team/*        → teamRoutes.js                    │    │
│  │  /api/dashboard/*   → dashboardRoutes.js               │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                         │                                        │
│                         │ Route Handler                          │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │            AUTHENTICATION MIDDLEWARE                   │    │
│  │  • Verify JWT Token                                    │    │
│  │  • Extract User from Token                             │    │
│  │  • Check User Status                                   │    │
│  │  • Attach req.user                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                         │                                        │
│                         │ Authenticated Request                  │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │            VALIDATION MIDDLEWARE                       │    │
│  │  • Express-validator                                   │    │
│  │  • Check Required Fields                               │    │
│  │  • Validate Data Types                                 │    │
│  │  • Custom Validation Rules                             │    │
│  └────────────────────────────────────────────────────────┘    │
│                         │                                        │
│                         │ Validated Request                      │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              CONTROLLERS LAYER                         │    │
│  │                                                         │    │
│  │  authController.js      → Auth Logic                   │    │
│  │  clientController.js    → Client CRUD                  │    │
│  │  paymentController.js   → Payment & Installments       │    │
│  │  teamController.js      → Team Management              │    │
│  │  dashboardController.js → Analytics                    │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                         │                                        │
│                         │ Database Operations                    │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                MODELS LAYER                            │    │
│  │                                                         │    │
│  │  User.js        → User Schema + Password Hashing       │    │
│  │  Client.js      → Client Schema + Validation           │    │
│  │  Payment.js     → Payment Schema + Installment Logic   │    │
│  │  TeamMember.js  → Team Schema + Avatar Generation      │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                         │                                        │
│                         │ Mongoose ODM                           │
│                         ▼                                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ MongoDB Driver
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      MONGODB DATABASE                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    users     │  │   clients    │  │   payments   │         │
│  │  collection  │  │  collection  │  │  collection  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │ teammembers  │                                               │
│  │  collection  │                                               │
│  └──────────────┘                                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### Example: Create New Client

```
1. Frontend (React)
   ↓
   axios.post('/api/clients', clientData, {
     headers: { Authorization: 'Bearer <token>' }
   })

2. Express Server
   ↓
   Middleware Stack:
   - Helmet (security headers)
   - CORS (check origin)
   - Body Parser (parse JSON)
   - Rate Limiter (check limits)

3. Route Handler
   ↓
   POST /api/clients → clientRoutes.js

4. Authentication Middleware
   ↓
   - Extract token from header
   - Verify JWT signature
   - Get user from database
   - Attach user to req.user

5. Validation Middleware
   ↓
   - Check required fields
   - Validate email format
   - Validate data types

6. Controller
   ↓
   clientController.createClient()
   - Add userId to data
   - Call Client.create()

7. Model
   ↓
   Client.js
   - Run pre-save hooks
   - Validate schema
   - Save to database

8. Database
   ↓
   MongoDB
   - Insert document
   - Return created document

9. Response
   ↓
   {
     success: true,
     message: "Client created successfully",
     data: { ...clientData }
   }

10. Frontend
    ↓
    Update UI with new client
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    REGISTRATION FLOW                         │
└─────────────────────────────────────────────────────────────┘

1. User submits registration form
   ↓
2. POST /api/auth/register
   ↓
3. Validate input (name, email, password)
   ↓
4. Check if email already exists
   ↓
5. Hash password with bcrypt (10 rounds)
   ↓
6. Create user in database
   ↓
7. Generate JWT token
   ↓
8. Return user data + token
   ↓
9. Frontend stores token in localStorage
   ↓
10. Redirect to dashboard


┌─────────────────────────────────────────────────────────────┐
│                      LOGIN FLOW                              │
└─────────────────────────────────────────────────────────────┘

1. User submits login form
   ↓
2. POST /api/auth/login
   ↓
3. Validate input (email, password)
   ↓
4. Find user by email (include password field)
   ↓
5. Compare password with bcrypt
   ↓
6. Check if user is active
   ↓
7. Generate JWT token
   ↓
8. Return user data + token
   ↓
9. Frontend stores token in localStorage
   ↓
10. Redirect to dashboard


┌─────────────────────────────────────────────────────────────┐
│                  PROTECTED ROUTE FLOW                        │
└─────────────────────────────────────────────────────────────┘

1. User makes request to protected route
   ↓
2. Include token in Authorization header
   ↓
3. Auth middleware extracts token
   ↓
4. Verify token signature with JWT_SECRET
   ↓
5. Decode token to get user ID
   ↓
6. Find user in database
   ↓
7. Check if user exists and is active
   ↓
8. Attach user to req.user
   ↓
9. Continue to controller
   ↓
10. Controller uses req.user.id for queries
```

---

## 💳 Payment Installment System

```
┌─────────────────────────────────────────────────────────────┐
│              INSTALLMENT TRACKING FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. Create Payment
   ↓
   POST /api/payments
   {
     clientId: "...",
     amount: 5000,
     totalInstallments: 5,
     currentInstallment: 1,
     ...
   }
   ↓
2. Pre-save Hook Runs
   ↓
   - Calculate installment: "1/5"
   - Calculate remaining: "4 installments remaining"
   ↓
3. Save to Database
   ↓
   Payment created with:
   - installment: "1/5"
   - remaining: "4 installments remaining"


4. Record New Installment
   ↓
   POST /api/payments/:id/installments
   {
     amount: 5000,
     date: "2024-03-27",
     description: "Second installment"
   }
   ↓
5. Controller Logic
   ↓
   - Find payment by ID
   - Check if already completed
   - Increment currentInstallment
   - Update status to 'paid'
   ↓
6. Pre-save Hook Runs Again
   ↓
   - Calculate installment: "2/5"
   - Calculate remaining: "3 installments remaining"
   ↓
7. Save Updated Payment
   ↓
   Payment updated with:
   - currentInstallment: 2
   - installment: "2/5"
   - remaining: "3 installments remaining"


8. When All Installments Paid
   ↓
   currentInstallment === totalInstallments
   ↓
   Pre-save Hook:
   - installment: "5/5"
   - remaining: "Project Completed"
   - isCompleted: true (virtual field)
```

---

## 📊 Data Relationships

```
┌──────────────┐
│     User     │
│              │
│  - id        │
│  - name      │
│  - email     │
│  - password  │
│  - role      │
└──────┬───────┘
       │
       │ One-to-Many
       │
       ├─────────────────────────────────────┐
       │                                     │
       │                                     │
┌──────▼───────┐    ┌──────────────┐  ┌────▼─────────┐
│    Client    │    │   Payment    │  │ TeamMember   │
│              │    │              │  │              │
│  - userId ───┼───→│  - userId    │  │  - userId    │
│  - name      │    │  - clientId ─┼─→│  - name      │
│  - project   │    │  - amount    │  │  - role      │
│  - email     │    │  - install.  │  │  - email     │
│  - status    │    │  - invoice   │  │  - status    │
└──────────────┘    └──────────────┘  └──────────────┘
       │
       │ Referenced by
       │
       └─────────────┐
                     │
              ┌──────▼───────┐
              │   Payment    │
              │              │
              │  - clientId  │
              │  - clientName│
              └──────────────┘
```

---

## 🔍 Query Optimization

### Indexes Created

```javascript
// Client Model
clientSchema.index({ 
  clientName: 'text', 
  projectName: 'text', 
  email: 'text' 
});
clientSchema.index({ userId: 1, startDate: -1 });

// Payment Model
paymentSchema.index({ 
  clientName: 'text', 
  projectName: 'text', 
  invoiceNumber: 'text' 
});
paymentSchema.index({ userId: 1, date: -1 });
paymentSchema.index({ clientId: 1 });

// TeamMember Model
teamMemberSchema.index({ 
  name: 'text', 
  email: 'text', 
  role: 'text' 
});
teamMemberSchema.index({ userId: 1, joinDate: -1 });
```

### Benefits
- **Text Search**: Fast full-text search across multiple fields
- **User Queries**: Fast filtering by userId
- **Sorting**: Efficient sorting by date fields
- **Relationships**: Fast lookups by clientId

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├─ CORS (Cross-Origin Resource Sharing)
├─ Helmet (Security Headers)
└─ Rate Limiting (100 req/15min)

Layer 2: Authentication
├─ JWT Token Verification
├─ Token Expiration (7 days)
└─ User Status Check (isActive)

Layer 3: Authorization
├─ User-specific Data Isolation
├─ Role-based Access Control
└─ Resource Ownership Verification

Layer 4: Input Validation
├─ Express-validator
├─ Schema Validation (Mongoose)
├─ Data Type Checking
└─ Required Field Validation

Layer 5: Data Security
├─ Password Hashing (bcrypt)
├─ Password Never Returned
├─ Sensitive Data Exclusion
└─ SQL Injection Prevention (Mongoose)

Layer 6: Error Handling
├─ No Sensitive Data in Errors
├─ Consistent Error Format
├─ Proper HTTP Status Codes
└─ Error Logging
```

---

## 📈 Scalability Considerations

### Current Implementation
- ✅ Stateless authentication (JWT)
- ✅ Database indexing
- ✅ Efficient queries
- ✅ Compression middleware
- ✅ Connection pooling

### Future Enhancements
- 🔄 Redis caching for frequently accessed data
- 🔄 WebSocket for real-time updates
- 🔄 Message queue for background jobs
- 🔄 CDN for static assets
- 🔄 Load balancing for multiple instances
- 🔄 Database replication for read scaling

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                          │
└─────────────────────────────────────────────────────────────┘

Frontend (Vercel/Netlify)
├─ Static files served via CDN
├─ Environment variables configured
└─ API calls to backend URL

Backend (Heroku/Railway/DigitalOcean)
├─ Node.js server running
├─ Environment variables set
├─ HTTPS enabled
├─ Process manager (PM2)
└─ Auto-restart on crash

Database (MongoDB Atlas)
├─ Cloud-hosted MongoDB
├─ Automatic backups
├─ Replica sets for high availability
└─ IP whitelist configured

Monitoring
├─ Error tracking (Sentry)
├─ Performance monitoring
├─ Uptime monitoring
└─ Log aggregation
```

---

## 📝 Summary

This backend architecture provides:
- ✅ **Separation of Concerns**: Clear layers (routes, controllers, models)
- ✅ **Security**: Multiple security layers
- ✅ **Scalability**: Optimized queries and indexing
- ✅ **Maintainability**: Clean, organized code
- ✅ **Flexibility**: Easy to extend and modify
- ✅ **Performance**: Efficient database operations
- ✅ **Reliability**: Proper error handling

The architecture follows industry best practices and is production-ready! 🎉
