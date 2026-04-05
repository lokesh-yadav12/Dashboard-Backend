// Test if nodemailer is installed correctly
const nodemailer = require('nodemailer');

console.log('Testing nodemailer...');
console.log('nodemailer object:', typeof nodemailer);
console.log('createTransport function:', typeof nodemailer.createTransport);

if (typeof nodemailer.createTransport === 'function') {
    console.log('✅ nodemailer is installed correctly!');
    
    // Try creating a transporter
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'test@gmail.com',
                pass: 'test'
            }
        });
        console.log('✅ Transporter created successfully!');
    } catch (error) {
        console.log('❌ Error creating transporter:', error.message);
    }
} else {
    console.log('❌ nodemailer.createTransport is not a function!');
    console.log('This means nodemailer is not installed correctly.');
    console.log('Please run: npm install nodemailer');
}
