const express = require('express');
const router = express.Router();
const { 
    requestOTP, 
    verifyOTP, 
    verifyToken,
    getAllowedEmailsList 
} = require('../controllers/otpAuthController');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

// Request OTP
router.post('/request-otp',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address')
    ],
    validate,
    requestOTP
);

// Verify OTP and login
router.post('/verify-otp',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),
        body('otp')
            .isLength({ min: 6, max: 6 })
            .isNumeric()
            .withMessage('OTP must be a 6-digit number')
    ],
    validate,
    verifyOTP
);

// Verify token
router.get('/verify-token', verifyToken);

// Get allowed emails list
router.get('/allowed-emails', getAllowedEmailsList);

module.exports = router;
