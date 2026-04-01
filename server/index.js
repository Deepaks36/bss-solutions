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

console.log(`\n--- BSS Solutions Server starting on port ${PORT} ---`);

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
    debug: false,
    logger: false
  });

  // Verify configuration
  transporter.verify(function (error, success) {
    if (error) {
      // Silent error for dev
    }
  });
} else {
  // Silent or minimal config warning
}

function serializeMessage(row) {
  return {
    ...row,
    verified: Boolean(row.verified),
  };
}

// Helper to get structured content
function getSiteContent() {
  const content = {};

  // 1. Get settings (top-level strings and JSON arrays)
  const settings = db.prepare('SELECT * FROM site_settings').all();
  settings.forEach(s => {
    try {
      if (s.value.trim().startsWith('[') || s.value.trim().startsWith('{')) {
        const parsed = JSON.parse(s.value);
        // Ensure that for known array keys, we actually got an array
        if (['heroHighlights', 'heroStats', 'heroProofItems'].includes(s.key) && !Array.isArray(parsed)) {
          content[s.key] = [];
        } else {
          content[s.key] = parsed;
        }
      } else {
        content[s.key] = s.value;
      }
    } catch (e) {
      content[s.key] = s.value;
    }
  });

  // 2. Main sections (Skip individual hero tables as they are now in site_settings)
  const services = db.prepare('SELECT * FROM services').all();
  content.services = services.map(s => ({
    ...s,
    bullets: s.bullets ? JSON.parse(s.bullets) : []
  }));

  const products = db.prepare('SELECT * FROM products').all();
  content.products = products.map(p => ({
    ...p,
    bullets: p.bullets ? JSON.parse(p.bullets) : [],
    details: p.details ? p.details : undefined
  }));

  content.workflow = db.prepare('SELECT * FROM workflow ORDER BY order_index').all();
  content.testimonials = db.prepare('SELECT * FROM testimonials').all();
  content.news = db.prepare('SELECT * FROM news').all();
  content.clients = db.prepare('SELECT * FROM clients').all();
  content.whyItems = db.prepare('SELECT * FROM why_items').all();
  content.positions = db.prepare('SELECT * FROM positions').all();
  content.technologies = db.prepare('SELECT * FROM technologies').all();

  return content;
}

// Helper to save structured content
function saveSiteContent(content) {
  const transaction = db.transaction((data) => {
    // 1. Settings
    const setSetting = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
    const simpleKeys = [
      'heroTitle', 'heroSubtitle', 'heroCta', 'heroStat', 'heroCenterBadgeLabel', 'heroImage',
      'heroTopLeftImage', 'heroTopLeftBadgeTop', 'heroTopLeftBadgeBottom', 'heroBottomRightImage',
      'heroBottomRightBadgeTop', 'heroBottomRightBadgeBottom', 'aboutTitle', 'aboutBody',
      'aboutImage', 'servicesTagline', 'servicesTitle', 'servicesSubtitle', 'workflowTagline',
      'workflowTitle', 'whyTitle', 'testimonialsTagline', 'testimonialsTitle', 'ctaBannerText',
      'newsTitle', 'newsTagline', 'contactTitle', 'contactTagline', 'contactAddress',
      'contactEmail', 'contactPhone', 'careersTagline', 'careersTitle', 'careersSubtitle'
    ];

    simpleKeys.forEach(key => {
      if (data[key] !== undefined) setSetting.run(key, String(data[key]));
    });

    // 2. Sections (Clear and refilled for simplicity in this full-sync POST)
    // In a real app, you might want more granular updates, but this matches the current frontend behavior
    
    // Highlights
    db.prepare('DELETE FROM hero_highlights').run();
    const insHighlight = db.prepare('INSERT INTO hero_highlights (id, label) VALUES (?, ?)');
    (data.heroHighlights || []).forEach(h => insHighlight.run(h.id, h.label));

    // Stats
    db.prepare('DELETE FROM hero_stats').run();
    const insStat = db.prepare('INSERT INTO hero_stats (id, value, label) VALUES (?, ?, ?)');
    (data.heroStats || []).forEach(s => insStat.run(s.id, s.value, s.label));

    // Proof Items
    db.prepare('DELETE FROM hero_proof_items').run();
    const insProof = db.prepare('INSERT INTO hero_proof_items (id, label) VALUES (?, ?)');
    (data.heroProofItems || []).forEach(p => insProof.run(p.id, p.label));

    // Services
    db.prepare('DELETE FROM services').run();
    const insService = db.prepare('INSERT INTO services (id, title, description, icon, image, accent, bullets) VALUES (?, ?, ?, ?, ?, ?, ?)');
    (data.services || []).forEach(s => insService.run(s.id, s.title, s.description, s.icon, s.image || '', s.accent || '', JSON.stringify(s.bullets || [])));

    // Products
    db.prepare('DELETE FROM products').run();
    const insProduct = db.prepare('INSERT INTO products (id, title, description, icon, image, accent, bullets, type, details, detailsImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    (data.products || []).forEach(p => insProduct.run(p.id, p.title, p.description, p.icon, p.image || '', p.accent || '', JSON.stringify(p.bullets || []), p.type || '', p.details || '', p.detailsImage || ''));

    // Workflow
    db.prepare('DELETE FROM workflow').run();
    const insWorkflow = db.prepare('INSERT INTO workflow (id, title, description, icon, order_index) VALUES (?, ?, ?, ?, ?)');
    (data.workflow || []).forEach((w, i) => insWorkflow.run(w.id, w.title, w.description, w.icon, i));

    // Testimonials
    db.prepare('DELETE FROM testimonials').run();
    const insTestimonial = db.prepare('INSERT INTO testimonials (id, quote, name, role) VALUES (?, ?, ?, ?)');
    (data.testimonials || []).forEach(t => insTestimonial.run(t.id, t.quote, t.name, t.role));

    // News
    db.prepare('DELETE FROM news').run();
    const insNews = db.prepare('INSERT INTO news (id, title, excerpt, image, date) VALUES (?, ?, ?, ?, ?)');
    (data.news || []).forEach(n => insNews.run(n.id, n.title, n.excerpt, n.image, n.date));

    // Clients
    db.prepare('DELETE FROM clients').run();
    const insClient = db.prepare('INSERT INTO clients (id, name, image) VALUES (?, ?, ?)');
    (data.clients || []).forEach(c => insClient.run(c.id, c.name, c.image));

    // Why Items
    db.prepare('DELETE FROM why_items').run();
    const insWhy = db.prepare('INSERT INTO why_items (id, title, description, image) VALUES (?, ?, ?, ?)');
    (data.whyItems || []).forEach(w => insWhy.run(w.id, w.title, w.description, w.image));

    // Positions
    db.prepare('DELETE FROM positions').run();
    const insPosition = db.prepare('INSERT INTO positions (id, title, department, location, type, description) VALUES (?, ?, ?, ?, ?, ?)');
    (data.positions || []).forEach(p => insPosition.run(p.id, p.title, p.department, p.location, p.type, p.description));

    // Technologies
    db.prepare('DELETE FROM technologies').run();
    const insTech = db.prepare('INSERT INTO technologies (id, name, image) VALUES (?, ?, ?)');
    (data.technologies || []).forEach(t => insTech.run(t.id, t.name, t.image));

    // Also update the legacy site_content blob (for backward compatibility or as a backup)
    db.prepare('INSERT OR REPLACE INTO site_content (id, data) VALUES (1, ?)').run(JSON.stringify(data));
  });

  transaction(content);
}

// ── Footer CRUD ──────────────────────────────────────────────
app.get('/api/footer', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM footer WHERE id = 1').get();
    if (!row) return res.status(404).json({ error: 'Footer not found' });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/footer', (req, res) => {
  const { company_name, tagline, phone, whatsapp, email, address, facebook, twitter, linkedin, instagram, copyright } = req.body;
  try {
    db.prepare(`
      INSERT INTO footer (id, company_name, tagline, phone, whatsapp, email, address, facebook, twitter, linkedin, instagram, copyright)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        company_name=excluded.company_name, tagline=excluded.tagline, phone=excluded.phone,
        whatsapp=excluded.whatsapp, email=excluded.email, address=excluded.address,
        facebook=excluded.facebook, twitter=excluded.twitter, linkedin=excluded.linkedin,
        instagram=excluded.instagram, copyright=excluded.copyright
    `).run(company_name, tagline, phone, whatsapp, email, address, facebook, twitter, linkedin, instagram, copyright);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get all content
app.get('/api/content', (req, res) => {
  try {
    const content = getSiteContent();
    // If settings are empty, consider it 404 so frontend can seed
    const settingsCount = db.prepare('SELECT COUNT(*) as count FROM site_settings').get().count;
    if (settingsCount > 0) {
      res.json(content);
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update content (Full Sync - remains for convenience)
app.post('/api/content', (req, res) => {
  try {
    saveSiteContent(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update specific setting (Granular)
app.patch('/api/content/settings', (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: 'Key is required' });

  try {
    const stmt = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
    stmt.run(key, (typeof value === 'object' && value !== null) ? JSON.stringify(value) : String(value));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Section whitelist to prevent arbitrary table access
const SECTION_TABLE_MAP = {
  services: 'services',
  products: 'products',
  workflow: 'workflow',
  testimonials: 'testimonials',
  news: 'news',
  clients: 'clients',
  whyItems: 'why_items',
  positions: 'positions',
  technologies: 'technologies',
  heroHighlights: 'hero_highlights',
  heroStats: 'hero_stats',
  heroProofItems: 'hero_proof_items'
};

// Add item to section
app.post('/api/content/sections/:section', (req, res) => {
  const { section } = req.params;
  const table = SECTION_TABLE_MAP[section];
  if (!table) return res.status(400).json({ error: 'Invalid section' });

  try {
    const item = req.body;
    const columns = Object.keys(item);
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    const values = columns.map(col => {
      const val = item[col];
      if (typeof val === 'boolean') return val ? 1 : 0;
      return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
    });

    const stmt = db.prepare(sql);
    stmt.run(...values);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item in section - Now uses section-only URL for better display
app.put('/api/content/sections/:section', (req, res) => {
  const { section } = req.params;
  const table = SECTION_TABLE_MAP[section];
  if (!table) return res.status(400).json({ error: 'Invalid section' });

  try {
    const { id, ...updates } = req.body;
    if (!id) return res.status(400).json({ error: 'ID is required in body' });

    const columns = Object.keys(updates);
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;

    const values = columns.map(col => {
      const val = updates[col];
      if (typeof val === 'boolean') return val ? 1 : 0;
      return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
    });

    const stmt = db.prepare(sql);
    const result = stmt.run(...values, id);
    
    if (result.changes === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item from section - Now uses section-only URL for better display
app.delete('/api/content/sections/:section', (req, res) => {
  const { section } = req.params;
  const { id } = req.query;
  const table = SECTION_TABLE_MAP[section];
  if (!table) return res.status(400).json({ error: 'Invalid section' });
  if (!id) return res.status(400).json({ error: 'ID is required' });

  try {
    const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    const result = stmt.run(id);
    
    if (result.changes === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const adminConfig = appSettings.Admin;

  if (username === adminConfig.Username && password === adminConfig.Password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
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
        // info1: Internal Notification for Admin
        const info1 = await transporter.sendMail({
          from: `"${name.trim()} via BSS" <${SMTP_USER}>`,
          sender: SMTP_USER,
          replyTo: email.trim(),
          to: CONTACT_TO_EMAIL,
          subject: `New Reach Out submission from ${name.trim()}`,
          text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${(subject || 'General inquiry').trim()}\n\nMessage:\n${message.trim()}`,
        });
        console.log('Internal notification mail triggered. MessageId:', info1.messageId);

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
  console.log(`\n Server running on http://localhost:${PORT}\n`);
});
