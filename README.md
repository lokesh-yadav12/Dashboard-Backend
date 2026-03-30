# Business Dashboard Backend API

A complete, production-ready REST API for the Business Dashboard application built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **Client Management**: Full CRUD operations for managing clients
- **Payment Tracking**: Payment management with installment tracking
- **Team Management**: Manage team members and their details
- **Dashboard Analytics**: Real-time statistics and data visualization
- **Security**: Helmet, CORS, rate limiting, input validation
- **Error Handling**: Centralized error handling with detailed messages
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express-validator for input validation
- **Logging**: Morgan for HTTP request logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory**
   ```bash
   cd "Dashboard backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   
   Edit `.env` file and add your MongoDB connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
Dashboard backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── clientController.js  # Client management
│   │   ├── paymentController.js # Payment management
│   │   ├── teamController.js    # Team management
│   │   └── dashboardController.js # Dashboard analytics
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── validator.js         # Input validation
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Client.js            # Client model
│   │   ├── Payment.js           # Payment model
│   │   └── TeamMember.js        # Team member model
│   ├── routes/
│   │   ├── authRoutes.js        # Auth routes
│   │   ├── clientRoutes.js      # Client routes
│   │   ├── paymentRoutes.js     # Payment routes
│   │   ├── teamRoutes.js        # Team routes
│   │   └── dashboardRoutes.js   # Dashboard routes
│   └── server.js                # Express app setup
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/filter` - Filter clients by date range

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment
- `POST /api/payments/:id/installments` - Record new installment
- `GET /api/payments/client/:clientId` - Get client payments
- `GET /api/payments/analytics` - Get payment analytics

### Team
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single team member
- `POST /api/team` - Add new team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/clients` - Get client acquisition data
- `GET /api/dashboard/projects` - Get project completion data
- `GET /api/dashboard/project-status` - Get project status distribution

## 🔐 Authentication

All routes except `/api/auth/register` and `/api/auth/login` require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📝 Example Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Client
```bash
POST /api/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientName": "Tech Solutions Inc",
  "projectName": "E-commerce Website",
  "email": "contact@techsolutions.com",
  "contact": "+1 (555) 123-4567",
  "address": "123 Tech Street, Silicon Valley, CA",
  "startDate": "2024-01-15",
  "status": "development",
  "lastPayment": "$5,000 - Jan 15, 2024",
  "lastMeetNote": "Discussed project requirements"
}
```

### Create Payment
```bash
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientId": "65abc123def456...",
  "clientName": "Tech Solutions Inc",
  "projectName": "E-commerce Website",
  "amount": 5000,
  "date": "2024-03-25",
  "totalInstallments": 5,
  "currentInstallment": 1,
  "invoiceNumber": "INV-2024-001",
  "status": "paid",
  "description": "First installment payment",
  "paymentMethod": "Bank Transfer"
}
```

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configured for frontend origin
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Express-validator for request validation
- **Password Hashing**: Bcrypt for secure password storage
- **JWT**: Secure token-based authentication

## 🐛 Error Handling

The API uses centralized error handling with consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Optional validation errors
}
```

## 📊 Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Optional success message",
  "data": {}, // Response data
  "count": 0 // Optional count for list responses
}
```

## 🧪 Testing

Health check endpoint:
```bash
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-27T10:00:00.000Z"
}
```

## 🚀 Deployment

### Deploy to Heroku

1. Create Heroku app
2. Set environment variables
3. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Deploy to DigitalOcean

1. Create droplet
2. Install Node.js and MongoDB
3. Clone repository
4. Set environment variables
5. Use PM2 for process management

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | Required |
| JWT_SECRET | JWT secret key | Required |
| JWT_EXPIRE | JWT expiration time | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

Your Name

## 🆘 Support

For support, email your-email@example.com or create an issue in the repository.#   D a s h b o a r d - B a c k e n d  
 