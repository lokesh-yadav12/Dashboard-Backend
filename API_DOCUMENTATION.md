# API Documentation

Complete API documentation for Business Dashboard Backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
Authenticate user and get JWT token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
Get logged in user details.

**Endpoint:** `GET /auth/me`

**Access:** Private

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## Client Endpoints

### Get All Clients
Retrieve all clients for the authenticated user.

**Endpoint:** `GET /clients`

**Access:** Private

**Query Parameters:**
- `search` (optional): Search by client name, project name, or email
- `status` (optional): Filter by status (live, development, completed)
- `sortBy` (optional): Sort field (default: -createdAt)

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65abc123...",
      "clientName": "Tech Solutions Inc",
      "projectName": "E-commerce Website",
      "email": "contact@techsolutions.com",
      "contact": "+1 (555) 123-4567",
      "address": "123 Tech Street",
      "startDate": "2024-01-15T00:00:00.000Z",
      "status": "development",
      "lastPayment": "$5,000 - Jan 15, 2024",
      "lastMeetNote": "Discussed requirements",
      "userId": "65abc456...",
      "createdAt": "2024-03-27T10:00:00.000Z",
      "updatedAt": "2024-03-27T10:00:00.000Z"
    }
  ]
}
```

### Get Single Client
Retrieve a specific client by ID.

**Endpoint:** `GET /clients/:id`

**Access:** Private

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "clientName": "Tech Solutions Inc",
    "projectName": "E-commerce Website",
    ...
  }
}
```

### Create Client
Add a new client.

**Endpoint:** `POST /clients`

**Access:** Private

**Request Body:**
```json
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

**Success Response (201):**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "_id": "65abc123...",
    "clientName": "Tech Solutions Inc",
    ...
  }
}
```

### Update Client
Update an existing client.

**Endpoint:** `PUT /clients/:id`

**Access:** Private

**Request Body:** (All fields optional)
```json
{
  "status": "live",
  "lastPayment": "$10,000 - Mar 27, 2024",
  "lastMeetNote": "Project launched successfully"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "_id": "65abc123...",
    ...
  }
}
```

### Delete Client
Delete a client.

**Endpoint:** `DELETE /clients/:id`

**Access:** Private

**Success Response (200):**
```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

---

## Payment Endpoints

### Get All Payments
Retrieve all payments for the authenticated user.

**Endpoint:** `GET /payments`

**Access:** Private

**Query Parameters:**
- `search` (optional): Search by client name, project name, or invoice number
- `status` (optional): Filter by status (paid, pending, overdue)
- `sortBy` (optional): Sort field (default: -date)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65abc789...",
      "clientId": "65abc123...",
      "clientName": "Tech Solutions Inc",
      "projectName": "E-commerce Website",
      "amount": 5000,
      "date": "2024-03-25T00:00:00.000Z",
      "totalInstallments": 5,
      "currentInstallment": 3,
      "installment": "3/5",
      "remaining": "2 installments remaining",
      "invoiceNumber": "INV-2024-001",
      "status": "paid",
      "description": "Third installment payment",
      "paymentMethod": "Bank Transfer",
      "userId": "65abc456...",
      "createdAt": "2024-03-27T10:00:00.000Z",
      "updatedAt": "2024-03-27T10:00:00.000Z"
    }
  ]
}
```

### Create Payment
Add a new payment record.

**Endpoint:** `POST /payments`

**Access:** Private

**Request Body:**
```json
{
  "clientId": "65abc123...",
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

**Success Response (201):**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "_id": "65abc789...",
    ...
  }
}
```

### Record Installment
Record a new installment payment (increments currentInstallment).

**Endpoint:** `POST /payments/:id/installments`

**Access:** Private

**Request Body:**
```json
{
  "amount": 5000,
  "date": "2024-03-27",
  "description": "Second installment payment"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Installment recorded successfully",
  "data": {
    "_id": "65abc789...",
    "currentInstallment": 2,
    "installment": "2/5",
    "remaining": "3 installments remaining",
    ...
  }
}
```

### Get Payment Analytics
Get payment statistics and analytics.

**Endpoint:** `GET /payments/analytics`

**Access:** Private

**Query Parameters:**
- `timeRange` (optional): monthly or yearly (default: monthly)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalReceived": 113300,
      "totalPending": 8400,
      "averagePayment": 3875,
      "activeInstallments": 12,
      "totalPayments": 30
    },
    "chartData": [
      { "name": "Jan 2024", "value": 12500 },
      { "name": "Feb 2024", "value": 18200 },
      { "name": "Mar 2024", "value": 15500 }
    ]
  }
}
```

---

## Team Endpoints

### Get All Team Members
Retrieve all team members.

**Endpoint:** `GET /team`

**Access:** Private

**Query Parameters:**
- `search` (optional): Search by name, email, or role
- `status` (optional): Filter by status (active, inactive)
- `department` (optional): Filter by department
- `sortBy` (optional): Sort field (default: -createdAt)

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "65abc999...",
      "name": "John Smith",
      "role": "Senior Developer",
      "email": "john.smith@company.com",
      "phone": "+1 (555) 123-4567",
      "department": "Development",
      "status": "active",
      "joinDate": "2023-01-15T00:00:00.000Z",
      "address": "123 Main St",
      "salary": 85000,
      "projects": 8,
      "skills": ["React", "Node.js", "TypeScript"],
      "avatar": "JS",
      "userId": "65abc456...",
      "createdAt": "2024-03-27T10:00:00.000Z",
      "updatedAt": "2024-03-27T10:00:00.000Z"
    }
  ]
}
```

### Create Team Member
Add a new team member.

**Endpoint:** `POST /team`

**Access:** Private

**Request Body:**
```json
{
  "name": "John Smith",
  "role": "Senior Developer",
  "email": "john.smith@company.com",
  "phone": "+1 (555) 123-4567",
  "department": "Development",
  "status": "active",
  "joinDate": "2023-01-15",
  "address": "123 Main St, City, State",
  "salary": 85000,
  "projects": 8,
  "skills": ["React", "Node.js", "TypeScript"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Team member added successfully",
  "data": {
    "_id": "65abc999...",
    "name": "John Smith",
    "avatar": "JS",
    ...
  }
}
```

---

## Dashboard Endpoints

### Get Dashboard Statistics
Get overall dashboard statistics.

**Endpoint:** `GET /dashboard/stats`

**Access:** Private

**Query Parameters:**
- `timeFilter` (optional): monthly or yearly (default: monthly)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalClients": {
      "value": 156,
      "change": "+12%"
    },
    "activeProjects": {
      "value": 45,
      "change": "+8%"
    },
    "revenue": {
      "value": 125000,
      "formatted": "$125.0K",
      "change": "+15%"
    },
    "teamMembers": {
      "value": 24,
      "change": "+2%"
    }
  }
}
```

### Get Client Acquisition Data
Get client acquisition data for charts.

**Endpoint:** `GET /dashboard/clients`

**Access:** Private

**Query Parameters:**
- `timeFilter` (optional): monthly or yearly (default: monthly)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    { "name": "Jan", "clients": 12 },
    { "name": "Feb", "clients": 19 },
    { "name": "Mar", "clients": 15 }
  ]
}
```

### Get Project Status Distribution
Get project status distribution for pie chart.

**Endpoint:** `GET /dashboard/project-status`

**Access:** Private

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    { "name": "Live Projects", "value": 15, "color": "#10B981" },
    { "name": "In Development", "value": 30, "color": "#3B82F6" },
    { "name": "Completed", "value": 45, "color": "#6B7280" }
  ]
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

**Rate Limit Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 1234567890
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```