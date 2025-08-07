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
            // text: `${email}\n\nMessage: <p style="color:red;">${message}</p>`,
            // html: `<p style="color:red;">${message}</p>`, // HTML content for better formatting
             // create best html mail template
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #4CAF50;">New Message from Portfolio</h2>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
                        <p>${message}</p>
                    </div>
                </div>`
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

