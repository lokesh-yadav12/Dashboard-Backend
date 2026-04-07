// const OTP = require('../models/OTP');
// const jwt = require('jsonwebtoken');
// const { sendOTPEmail } = require('../utils/emailService');

// // Get allowed emails from environment variable
// const getAllowedEmails = () => {
//     const emails = process.env.ALLOWED_EMAILS || '';
//     return emails.split(',').map(email => email.trim().toLowerCase()).filter(email => email);
// };

// // Generate 6-digit OTP
// const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Request OTP
// exports.requestOTP = async (req, res) => {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email is required'
//             });
//         }

//         const normalizedEmail = email.toLowerCase().trim();

//         // Check if email is in allowed list
//         const allowedEmails = getAllowedEmails();
//         if (!allowedEmails.includes(normalizedEmail)) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Access denied. This email is not authorized to access the dashboard.'
//             });
//         }

//         // Check for recent OTP requests (rate limiting)
//         const recentOTP = await OTP.findOne({
//             email: normalizedEmail,
//             createdAt: { $gte: new Date(Date.now() - 60000) } // Last 1 minute
//         });

//         if (recentOTP) {
//             return res.status(429).json({
//                 success: false,
//                 message: 'Please wait before requesting a new OTP. Try again in a minute.'
//             });
//         }

//         // Generate OTP
//         const otp = generateOTP();

//         // Save OTP to database
//         await OTP.create({
//             email: normalizedEmail,
//             otp: otp,
//             attempts: 0,
//             verified: false
//         });

//         // Send OTP via email
//         const emailResult = await sendOTPEmail(normalizedEmail, otp);

//         if (!emailResult.success) {
//             return res.status(500).json({
//                 success: false,
//                 message: 'Failed to send OTP email. Please try again later.'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'OTP sent successfully to your email',
//             expiresIn: '10 minutes'
//         });

//     } catch (error) {
//         console.error('Request OTP error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error. Please try again later.'
//         });
//     }
// };

const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Get allowed emails from environment variable
const getAllowedEmails = () => {
    const emails = process.env.ALLOWED_EMAILS || '';
    return emails.split(',').map(email => email.trim().toLowerCase()).filter(email => email);
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP
exports.requestOTP = async (req, res) => {
    const startTime = Date.now();

    try {
        const { email } = req.body;
        console.log(`[OTP_REQUEST] Incoming request for email: ${email}`);

        // 🔴 Missing email
        if (!email) {
            console.warn(`[OTP_REQUEST][FAIL] Missing email in request`);
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log(`[OTP_REQUEST] Normalized email: ${normalizedEmail}`);

        // 🔴 Not in allowed list
        const allowedEmails = getAllowedEmails();
        console.log(`[OTP_REQUEST] Allowed emails count: ${allowedEmails.length}`);

        if (!allowedEmails.includes(normalizedEmail)) {
            console.warn(`[OTP_REQUEST][FAIL] Unauthorized email attempt: ${normalizedEmail}`);
            return res.status(403).json({
                success: false,
                message: 'Access denied. This email is not authorized to access the dashboard.'
            });
        }

        // 🔴 Rate limit check
        const recentOTP = await OTP.findOne({
            email: normalizedEmail,
            createdAt: { $gte: new Date(Date.now() - 60000) }
        });

        if (recentOTP) {
            console.warn(`[OTP_REQUEST][RATE_LIMIT] OTP requested too soon for ${normalizedEmail}`);
            return res.status(429).json({
                success: false,
                message: 'Please wait before requesting a new OTP. Try again in a minute.'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        console.log(`[OTP_REQUEST] OTP generated for ${normalizedEmail}`);

        // Save OTP
        const savedOTP = await OTP.create({
            email: normalizedEmail,
            otp: otp,
            attempts: 0,
            verified: false
        });

        console.log(`[OTP_REQUEST] OTP saved in DB with id: ${savedOTP._id}`);

        // 🔴 Email service call
        console.log(`[OTP_REQUEST] Sending OTP via email service...`);

        let emailResponse;
        try {
            emailResponse = await axios.post(
                "https://lets-taxify.onrender.com/api/dashboard/send-otp",
                {
                    email: normalizedEmail,
                    otp: otp
                },
                {
                    timeout: 10000
                }
            );
        } catch (apiError) {
            console.error(`[OTP_REQUEST][EMAIL_API_FAIL] Failed to call email service`);
            console.error({
                message: apiError.message,
                status: apiError.response?.status,
                data: apiError.response?.data,
                stack: apiError.stack
            });

            return res.status(500).json({
                success: false,
                message: 'Email service unavailable. Please try again later.'
            });
        }

        const emailResult = emailResponse.data;

        // 🔴 Email service responded but failed
        if (!emailResult.success) {
            console.error(`[OTP_REQUEST][EMAIL_FAIL] Email service responded with failure`, emailResult);

            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again later.'
            });
        }

        console.log(`[OTP_REQUEST][SUCCESS] OTP sent successfully to ${normalizedEmail}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email',
            expiresIn: '10 minutes'
        });

    } catch (error) {
        console.error(`[OTP_REQUEST][CRITICAL_ERROR] Unexpected server error`);
        console.error({
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });

        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    } finally {
        const duration = Date.now() - startTime;
        console.log(`[OTP_REQUEST] Completed in ${duration}ms`);
    }
};

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find the most recent OTP for this email
        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            verified: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired or not found. Please request a new one.'
            });
        }

        // Check if OTP has expired (10 minutes)
        const otpAge = Date.now() - otpRecord.createdAt.getTime();
        if (otpAge > 10 * 60 * 1000) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Check attempts
        if (otpRecord.attempts >= 5) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                success: false,
                message: 'Too many failed attempts. Please request a new OTP.'
            });
        }

        // Verify OTP
        if (otpRecord.otp !== otp.trim()) {
            // Increment attempts
            otpRecord.attempts += 1;
            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`
            });
        }

        // OTP is valid - mark as verified
        otpRecord.verified = true;
        await otpRecord.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                email: normalizedEmail,
                loginTime: Date.now()
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                email: normalizedEmail
            }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
};

// Verify token (for protected routes)
exports.verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if email is still in allowed list
        const allowedEmails = getAllowedEmails();
        if (!allowedEmails.includes(decoded.email)) {
            return res.status(403).json({
                success: false,
                message: 'Access revoked'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                email: decoded.email
            }
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Get allowed emails (admin only - you can add admin check later)
exports.getAllowedEmailsList = async (req, res) => {
    try {
        const allowedEmails = getAllowedEmails();
        res.status(200).json({
            success: true,
            emails: allowedEmails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
