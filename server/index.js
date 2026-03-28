import express from 'express';
import cors from 'cors';
import db from './db.js';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'no-reply@bsyssolutions.com';
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info@bsyssolutions.com';

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  // Setup mock email transporter
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
    console.log('Mock email transporter initialized.');
  });
}

function serializeMessage(row) {
  return {
    ...row,
    verified: Boolean(row.verified),
  };
}

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

// Create message and send email when SMTP is configured
app.post('/api/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO messages (name, email, subject, message, verified, updated_at)
      VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
    `);
    const result = stmt.run(name.trim(), email.trim(), (subject || '').trim(), message.trim());

    let emailSent = false;
    let warning = null;

    if (transporter) {
      const info1 = await transporter.sendMail({
        from: SMTP_FROM,
        to: CONTACT_TO_EMAIL,
        replyTo: email.trim(),
        subject: `New Reach Out submission from ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${(subject || 'General inquiry').trim()}\n\nMessage:\n${message.trim()}`,
      });

      const info2 = await transporter.sendMail({
        from: SMTP_FROM,
        to: email.trim(),
        subject: 'We received your Reach Out request',
        text: `Hello ${name.trim()},\n\nThank you for contacting BSS Solutions. We received your message and our team will review it shortly.\n\nSubject: ${(subject || 'General inquiry').trim()}\n\nBest regards,\nBSS Solutions`,
      });

      console.log('Message sent: %s', info1.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info1));
      
      emailSent = true;
    } else {
      warning = 'SMTP is not configured yet. The submission was saved successfully, but email delivery is disabled until mail settings are added.';
    }

    res.json({ success: true, id: result.lastInsertRowid, emailSent, warning });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all messages for admin
app.get('/api/messages', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM messages ORDER BY verified ASC, created_at DESC').all();
    res.json(rows.map(serializeMessage));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a message
app.put('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, subject, message, verified } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const stmt = db.prepare(`
      UPDATE messages
      SET name = ?, email = ?, subject = ?, message = ?, verified = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    const result = stmt.run(name.trim(), email.trim(), (subject || '').trim(), message.trim(), verified ? 1 : 0, id);

    if (!result.changes) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const row = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    res.json({ success: true, message: serializeMessage(row) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify a message
app.patch('/api/messages/:id/verify', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('UPDATE messages SET verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(id);

    if (!result.changes) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const row = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    res.json({ success: true, message: serializeMessage(row) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a message
app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
    const result = stmt.run(id);

    if (!result.changes) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (transporter) {
    console.log('SMTP transport configured for Reach Out emails.');
  } else {
    console.log('SMTP not configured. Reach Out submissions will still be saved to the database.');
  }
});
