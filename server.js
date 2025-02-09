const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // 配置邮件发送
    let transporter = nodemailer.createTransport({
        host: "smtp.your-email-provider.com",
        port: 587,
        secure: false,
        auth: {
            user: "your-email@example.com",
            pass: "your-password"
        }
    });
    
    try {
        await transporter.sendMail({
            from: email,
            to: "fguo1996@cqu.edu.cn",
            subject: subject,
            text: `From: ${name} (${email})\n\n${message}`
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 