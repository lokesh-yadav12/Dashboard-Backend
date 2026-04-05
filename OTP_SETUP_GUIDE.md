# OTP Authentication Setup Guide

## Backend Setup

### 1. Install Required Package

```bash
cd "Dashboard backend"
npm install nodemailer
```

### 2. Configure Email Settings

Update your `.env` file with your email credentials:

```env
# Email Configuration for OTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Dashboard <your-email@gmail.com>

# Allowed Emails (comma-separated)
ALLOWED_EMAILS=jenasaisubham@gmail.com,another@email.com

# OTP Configuration
OTP_EXPIRE_MINUTES=10
```

### 3. Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Select Security
3. Under "Signing in to Google," select 2-Step Verification
4. At the bottom, select App passwords
5. Select "Mail" and your device
6. Copy the 16-character password
7. Use this password in `EMAIL_PASSWORD` in your `.env` file

### 4. Add More Allowed Emails

To add more authorized emails, update the `ALLOWED_EMAILS` in `.env`:

```env
ALLOWED_EMAILS=jenasaisubham@gmail.com,admin@company.com,manager@company.com
```

### 5. Start the Backend Server

```bash
npm run dev
```

## Frontend Setup

### 1. Update App.tsx

You need to:
1. Import OTPAuthProvider
2. Wrap your app with OTPAuthProvider
3. Add OTP login route
4. Protect existing routes with ProtectedRoute

### 2. Test the System

1. Go to http://localhost:5173/otp-login
2. Enter an allowed email (jenasaisubham@gmail.com)
3. Check your email for the OTP
4. Enter the 6-digit OTP
5. You'll be logged in and redirected to dashboard

## API Endpoints

### Request OTP
```
POST /api/otp-auth/request-otp
Body: { "email": "jenasaisubham@gmail.com" }
```

### Verify OTP
```
POST /api/otp-auth/verify-otp
Body: { "email": "jenasaisubham@gmail.com", "otp": "123456" }
```

### Verify Token
```
GET /api/otp-auth/verify-token
Headers: { "Authorization": "Bearer <token>" }
```

### Get Allowed Emails
```
GET /api/otp-auth/allowed-emails
```

## Security Features

- ✅ Only whitelisted emails can access
- ✅ OTP expires after 10 minutes
- ✅ Maximum 5 attempts per OTP
- ✅ Rate limiting (1 OTP per minute per email)
- ✅ JWT token for session management
- ✅ Secure email delivery with HTML template
- ✅ Auto-cleanup of expired OTPs

## Troubleshooting

### Email not sending?
1. Check if EMAIL_USER and EMAIL_PASSWORD are correct
2. Make sure you're using App Password, not regular password
3. Check if 2-Step Verification is enabled on Gmail
4. Check server logs for error messages

### OTP not working?
1. Make sure the email is in ALLOWED_EMAILS list
2. Check if OTP hasn't expired (10 minutes)
3. Verify you haven't exceeded 5 attempts
4. Try requesting a new OTP

### Access denied?
1. Verify the email is in ALLOWED_EMAILS in .env
2. Restart the backend server after changing .env
3. Check for typos in email address
