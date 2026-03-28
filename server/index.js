import express from 'express';
import cors from 'cors';
import db from './db.js';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Get all content
app.get('/api/content', (req, res) => {
    try {
        const row = db.prepare('SELECT data FROM site_content WHERE id = 1').get();
        if (row) {
            res.json(JSON.parse(row.data));
        } else {
            res.status(404).json({ error: 'Content not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update content
app.post('/api/content', (req, res) => {
    try {
        const data = JSON.stringify(req.body);
        const stmt = db.prepare('INSERT OR REPLACE INTO site_content (id, data) VALUES (1, ?)');
        stmt.run(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Setup mock email transporter
let transporter;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return;
    }
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
});

// Create message and send email
app.post('/api/messages', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    try {
        const stmt = db.prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)');
        const result = stmt.run(name, email, subject || '', message);
        
        // Send email
        if (transporter) {
            const info = await transporter.sendMail({
                from: '"BSS Solutions" <no-reply@bsyssolutions.com>',
                to: email, // Send to the user's provided email
                subject: "Thank you for contacting us!",
                text: `Hello ${name},\n\nThank you for reaching out to us regarding: ${subject || 'General Inquiry'}.\nWe have received your message and will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nBSS Solutions Team`,
                html: `<h3>Hello ${name},</h3><p>Thank you for reaching out to us regarding: <strong>${subject || 'General Inquiry'}</strong>.</p><p>We have received your message and will get back to you shortly.</p><br/><h4>Your message:</h4><p>${message}</p><br/><p>Best regards,<br/>BSS Solutions Team</p>`
            });
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all messages for admin
app.get('/api/messages', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
