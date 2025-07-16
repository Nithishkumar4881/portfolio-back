const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: 'https://nithish4881-portfolio.netlify.app',
    methods: ['POST'],
    credentials: true
}));

app.use(express.json());

app.post('/mailer', async (req, res) => {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ txt: 'Email sent successfully' });
        console.log(`Email sent to ${email} with subject "${subject}"`);
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});

