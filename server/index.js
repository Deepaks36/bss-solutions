import express from 'express';
import cors from 'cors';
import db from './db.js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appSettingsPath = path.resolve(__dirname, '../appsettings.json');
let appSettings = { BackendPort: 3001, Smtp: {} };
if (fs.existsSync(appSettingsPath)) {
  try {
    appSettings = { ...appSettings, ...JSON.parse(fs.readFileSync(appSettingsPath, 'utf-8')) };
  } catch (e) {
    console.error('Error parsing appsettings.json:', e);
  }
}

const app = express();
const PORT = appSettings.BackendPort || 3001;

const SMTP_HOST = appSettings.Smtp?.Host || process.env.SMTP_HOST;
const SMTP_PORT = Number(appSettings.Smtp?.Port || process.env.SMTP_PORT || 587);
const SMTP_USER = appSettings.Smtp?.User || process.env.SMTP_USER;
const SMTP_PASS = appSettings.Smtp?.Pass || process.env.SMTP_PASS;
const SMTP_FROM = appSettings.Smtp?.From || process.env.SMTP_FROM || 'no-reply@bsyssolutions.com';
const CONTACT_TO_EMAIL = appSettings.Smtp?.ContactToEmail || process.env.CONTACT_TO_EMAIL || 'info@bsyssolutions.com';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

console.log('--- SERVER STARTUP ---');
console.log('Target Port:', PORT);
console.log('SMTP Configured:', !!SMTP_HOST && !!SMTP_USER && !!SMTP_PASS);
console.log('SMTP Host:', SMTP_HOST);
console.log('SMTP User:', SMTP_USER);
console.log('--- END STARTUP ---');

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  console.log('Initializing SMTP transporter for:', SMTP_HOST, 'port:', SMTP_PORT);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    debug: true,
    logger: true
  });
  
  // Verify configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.log('SMTP Verification Failed:', error);
    } else {
      console.log('SMTP Server is ready to take our messages');
    }
  });
  console.log('SMTP transporter created successfully.');
} else {
  console.log('SMTP configuration incomplete. Host:', !!SMTP_HOST, 'User:', !!SMTP_USER, 'Pass:', !!SMTP_PASS);
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
      try {
        // // info1: Internal Notification for Admin
        // const info1 = await transporter.sendMail({
        //   from: `"${name.trim()} via BSS" <${SMTP_USER}>`, 
        //   sender: SMTP_USER,
        //   replyTo: email.trim(),
        //   to: CONTACT_TO_EMAIL,
        //   subject: `New Reach Out submission from ${name.trim()}`,
        //   text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${(subject || 'General inquiry').trim()}\n\nMessage:\n${message.trim()}`,
        // });

        // info2: Confirmation for User
        const info2 = await transporter.sendMail({
          from: `"BSS Solutions Support" <${SMTP_USER}>`,
          sender: SMTP_USER,
          to: email.trim(),
          subject: 'We received your Reach Out request',
          text: `Hello ${name.trim()},\n\nThank you for contacting BSS Solutions. We received your message and our team will review it shortly.\n\nSubject: ${(subject || 'General inquiry').trim()}\n\nBest regards,\nBSS Solutions`,
        });
        console.log('User confirmation response:', info2.response);
        console.log('User confirmation mail triggered. MessageId:', info2.messageId);

        emailSent = true;
      } catch (mailError) {
        console.error('Email delivery process failed!');
        console.error('Error stack:', mailError);
        warning = `The submission was saved, but email delivery failed: ${mailError.message}`;
      }
    } else {
      console.log('Mail triggered but transporter is NULL. Check config.');
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

// Unverify (Revert) a message
app.patch('/api/messages/:id/unverify', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('UPDATE messages SET verified = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
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
    transporter.verify((error) => {
      if (error) console.error('SMTP Verification Failed:', error.message);
      else console.log('SMTP Server is ready to take our messages');
    });
  } else {
    console.log('SMTP not configured. Reach Out submissions will still be saved to the database.');
  }
});
