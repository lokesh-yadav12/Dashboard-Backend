const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Your Dashboard Login OTP',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .content {
                            background: #f9fafb;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .otp-box {
                            background: white;
                            border: 2px dashed #667eea;
                            padding: 20px;
                            text-align: center;
                            margin: 20px 0;
                            border-radius: 8px;
                        }
                        .otp-code {
                            font-size: 32px;
                            font-weight: bold;
                            color: #667eea;
                            letter-spacing: 8px;
                            margin: 10px 0;
                        }
                        .warning {
                            background: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .footer {
                            text-align: center;
                            color: #6b7280;
                            font-size: 12px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Dashboard Login</h1>
                            <p>Your One-Time Password</p>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>You requested to log in to your Dashboard. Use the OTP below to complete your login:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">Your OTP Code</p>
                                <div class="otp-code">${otp}</div>
                                <p style="margin: 0; color: #6b7280; font-size: 12px;">Valid for 10 minutes</p>
                            </div>

                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong>
                                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                    <li>Never share this OTP with anyone</li>
                                    <li>This OTP will expire in 10 minutes</li>
                                    <li>If you didn't request this, please ignore this email</li>
                                </ul>
                            </div>

                            <p>If you have any questions, please contact support.</p>
                            
                            <p>Best regards,<br>Dashboard Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply.</p>
                            <p>&copy; ${new Date().getFullYear()} Dashboard. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail
};
