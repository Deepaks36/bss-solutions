import express from 'express';
import cors from 'cors';
import db from './db.js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

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

const uploadsDir = path.resolve(__dirname, '../public/assets/uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(safeOriginalName);
    const base = path.basename(safeOriginalName, ext);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({ storage });

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

function ensureDocumentsTableExists() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      referenceType TEXT NOT NULL,
      referenceId TEXT NOT NULL,
      fieldName TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_documents_reference ON documents(referenceType, referenceId)');
}

ensureDocumentsTableExists();

const SECTION_REFERENCE_TYPE_MAP = {
  workflow: 'Workflow',
  products: 'Product',
  clients: 'Client',
  services: 'Service',
  news: 'News',
  whyItems: 'WhyItem',
  technologies: 'Technology',
  teamMembers: 'TeamMember',
  companies: 'Company',
  teamCelebrations: 'TeamCelebration',
};

const SETTINGS_IMAGE_KEYS = new Set([
  'heroImage',
  'heroTopLeftImage',
  'heroBottomRightImage',
  'aboutImage',
]);

function syncSettingDocument(key, value) {
  ensureDocumentsTableExists();
  if (!SETTINGS_IMAGE_KEYS.has(key)) return;

  db.prepare('DELETE FROM documents WHERE referenceType = ? AND referenceId = ?').run('Setting', key);
  if (typeof value === 'string' && value.trim()) {
    db.prepare('INSERT INTO documents (path, referenceType, referenceId, fieldName) VALUES (?, ?, ?, ?)').run(value, 'Setting', key, key);
  }
}

function applySettingDocuments(content) {
  ensureDocumentsTableExists();
  const docs = db
    .prepare('SELECT path, referenceId FROM documents WHERE referenceType = ?')
    .all('Setting');

  docs.forEach((doc) => {
    if (doc.referenceId) {
      content[doc.referenceId] = doc.path;
    }
  });
}

function getDefaultProductImages(product) {
  const text = `${product.id} ${product.title} ${product.type || ''} ${product.description || ''}`.toLowerCase();
  if (text.includes('p2') || text.includes('payroll') || text.includes('hr') || text.includes('salary')) {
    return { image: '/assets/products/payroll_preview.jpg', detailsImage: '/assets/products/payroll_details.jpg' };
  }
  if (text.includes('p3') || text.includes('booking') || text.includes('boat') || text.includes('reserve')) {
    return { image: '/assets/products/booking_preview.jpg', detailsImage: '/assets/products/booking_details.jpg' };
  }
  if (text.includes('p4') || text.includes('hotel') || text.includes('premise') || text.includes('hospitality')) {
    return { image: '/assets/products/hotel_preview.jpg', detailsImage: '/assets/products/hotel_details.jpg' };
  }
  return { image: '/assets/products/erp_preview.jpg', detailsImage: '/assets/products/erp_details.jpg' };
}

function syncDocumentsForItem(section, item) {
  ensureDocumentsTableExists();
  const referenceType = SECTION_REFERENCE_TYPE_MAP[section];
  if (!referenceType || !item?.id) return;

  const deleteStmt = db.prepare('DELETE FROM documents WHERE referenceType = ? AND referenceId = ?');
  const insertStmt = db.prepare('INSERT INTO documents (path, referenceType, referenceId, fieldName) VALUES (?, ?, ?, ?)');

  const imageFields = [
    { key: 'image', multiple: false },
    { key: 'icon', multiple: false },
    { key: 'detailsImage', multiple: false },
    { key: 'images', multiple: true },
  ];

  deleteStmt.run(referenceType, item.id);

  imageFields.forEach(({ key, multiple }) => {
    const value = item[key];
    if (!value) return;

    if (multiple && Array.isArray(value)) {
      value
        .filter((v) => typeof v === 'string' && v.trim().length > 0)
        .forEach((imgPath) => insertStmt.run(imgPath, referenceType, item.id, key));
      return;
    }

    if (!multiple && typeof value === 'string' && value.trim().length > 0) {
      insertStmt.run(value, referenceType, item.id, key);
    }
  });
}

function applyDocumentImages(section, items) {
  ensureDocumentsTableExists();
  const referenceType = SECTION_REFERENCE_TYPE_MAP[section];
  if (!referenceType || !Array.isArray(items) || items.length === 0) return items;

  const docs = db
    .prepare('SELECT path, referenceId, fieldName FROM documents WHERE referenceType = ?')
    .all(referenceType);

  const docsByReference = docs.reduce((acc, doc) => {
    if (!acc[doc.referenceId]) acc[doc.referenceId] = [];
    acc[doc.referenceId].push(doc);
    return acc;
  }, {});

  return items.map((item) => {
    const itemDocs = docsByReference[item.id] || [];
    if (!itemDocs.length) return item;

    const next = { ...item };
    itemDocs.forEach((doc) => {
      if (doc.fieldName === 'images') {
        if (!Array.isArray(next.images)) next.images = [];
        next.images.push(doc.path);
      } else if (doc.fieldName) {
        next[doc.fieldName] = doc.path;
      } else if (!next.image) {
        next.image = doc.path;
      }
    });
    return next;
  });
}

function backfillDocuments() {
  ensureDocumentsTableExists();
  const sectionsToBackfill = [
    { section: 'services', table: 'services' },
    { section: 'workflow', table: 'workflow' },
    { section: 'news', table: 'news' },
    { section: 'whyItems', table: 'why_items' },
    { section: 'technologies', table: 'technologies' },
    { section: 'products', table: 'products' },
    { section: 'clients', table: 'clients' },
    { section: 'teamMembers', table: 'team_members' },
    { section: 'companies', table: 'companies' },
    { section: 'teamCelebrations', table: 'team_celebrations' },
  ];

  sectionsToBackfill.forEach(({ section, table }) => {
    const rows = db.prepare(`SELECT * FROM ${table}`).all();
    rows.forEach((row) => {
      const normalized = { ...row };
      if (typeof normalized.images === 'string') {
        try {
          normalized.images = JSON.parse(normalized.images);
        } catch (_e) {
          normalized.images = [];
        }
      }

      if (section === 'products') {
        const defaults = getDefaultProductImages(normalized);
        normalized.image = normalized.image?.trim() ? normalized.image : defaults.image;
        normalized.detailsImage = normalized.detailsImage?.trim() ? normalized.detailsImage : defaults.detailsImage;

        db.prepare('UPDATE products SET image = ?, detailsImage = ? WHERE id = ?').run(
          normalized.image,
          normalized.detailsImage,
          normalized.id
        );
      }

      syncDocumentsForItem(section, normalized);
    });
  });

  const settingRows = db.prepare('SELECT key, value FROM site_settings').all();
  settingRows.forEach((row) => syncSettingDocument(row.key, row.value));
}

backfillDocuments();

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
  applySettingDocuments(content);

  // 2. Hero ribbon data (stored in dedicated tables)
  content.heroHighlights = db.prepare('SELECT * FROM hero_highlights').all();
  content.heroStats = db.prepare('SELECT * FROM hero_stats').all();
  content.heroProofItems = db.prepare('SELECT * FROM hero_proof_items').all();

  // 3. Main sections
  const services = db.prepare('SELECT * FROM services').all();
  const parsedServices = services.map(s => ({
    ...s,
    bullets: s.bullets ? JSON.parse(s.bullets) : []
  }));
  content.services = applyDocumentImages('services', parsedServices);

  const products = db.prepare('SELECT * FROM products').all();
  const parsedProducts = products.map(p => ({
    ...p,
    bullets: p.bullets ? JSON.parse(p.bullets) : [],
    details: p.details ? p.details : undefined,
    images: p.images ? JSON.parse(p.images) : []
  }));
  content.products = applyDocumentImages('products', parsedProducts);

  const workflow = db.prepare('SELECT * FROM workflow ORDER BY order_index').all();
  content.workflow = applyDocumentImages('workflow', workflow);
  content.testimonials = db.prepare('SELECT * FROM testimonials').all();
  const news = db.prepare('SELECT * FROM news').all();
  content.news = applyDocumentImages('news', news);
  const clients = db.prepare('SELECT * FROM clients').all();
  content.clients = applyDocumentImages('clients', clients);
  const whyItems = db.prepare('SELECT * FROM why_items').all();
  content.whyItems = applyDocumentImages('whyItems', whyItems);
  content.positions = db.prepare('SELECT * FROM positions').all();
  const technologies = db.prepare('SELECT * FROM technologies').all();
  content.technologies = applyDocumentImages('technologies', technologies);
  const teamCelebrations = db.prepare('SELECT * FROM team_celebrations ORDER BY year DESC, order_index ASC').all().map(c => ({
    ...c,
    images: JSON.parse(c.images || '[]')
  }));
  content.teamCelebrations = applyDocumentImages('teamCelebrations', teamCelebrations);

  const teamMembers = db.prepare('SELECT * FROM team_members ORDER BY order_index ASC').all();
  content.teamMembers = applyDocumentImages('teamMembers', teamMembers);

  const companies = db.prepare('SELECT * FROM companies').all();
  const parsedCompanies = companies.map(c => ({
    ...c,
    images: c.images ? JSON.parse(c.images) : []
  }));
  content.companies = applyDocumentImages('companies', parsedCompanies);

  content.timelineItems = db.prepare('SELECT * FROM timeline_items ORDER BY order_index').all();

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
      if (data[key] !== undefined) {
        const value = String(data[key]);
        setSetting.run(key, value);
        syncSettingDocument(key, value);
      }
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
    (data.services || []).forEach(s => {
      insService.run(s.id, s.title, s.description, s.icon, s.image || '', s.accent || '', JSON.stringify(s.bullets || []));
      syncDocumentsForItem('services', s);
    });

    // Products
    db.prepare('DELETE FROM products').run();
    const insProduct = db.prepare('INSERT INTO products (id, title, description, icon, image, images, accent, bullets, type, details, detailsImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    (data.products || []).forEach(p => {
      const images = Array.isArray(p.images) ? JSON.stringify(p.images) : (p.images || '');
      insProduct.run(
        p.id,
        p.title,
        p.description,
        p.icon,
        p.image || '',
        images,
        p.accent || '',
        JSON.stringify(p.bullets || []),
        p.type || '',
        p.details || '',
        p.detailsImage || ''
      );
      syncDocumentsForItem('products', p);
    });

    // Workflow
    db.prepare('DELETE FROM workflow').run();
    const insWorkflow = db.prepare('INSERT INTO workflow (id, title, description, icon, order_index) VALUES (?, ?, ?, ?, ?)');
    (data.workflow || []).forEach((w, i) => {
      insWorkflow.run(w.id, w.title, w.description, w.icon, i);
      syncDocumentsForItem('workflow', w);
    });

    // Testimonials
    db.prepare('DELETE FROM testimonials').run();
    const insTestimonial = db.prepare('INSERT INTO testimonials (id, quote, name, role) VALUES (?, ?, ?, ?)');
    (data.testimonials || []).forEach(t => insTestimonial.run(t.id, t.quote, t.name, t.role));

    // News
    db.prepare('DELETE FROM news').run();
    const insNews = db.prepare('INSERT INTO news (id, title, excerpt, image, date) VALUES (?, ?, ?, ?, ?)');
    (data.news || []).forEach(n => {
      insNews.run(n.id, n.title, n.excerpt, n.image, n.date);
      syncDocumentsForItem('news', n);
    });

    // Clients
    db.prepare('DELETE FROM clients').run();
    const insClient = db.prepare('INSERT INTO clients (id, name, image) VALUES (?, ?, ?)');
    (data.clients || []).forEach(c => {
      insClient.run(c.id, c.name, c.image);
      syncDocumentsForItem('clients', c);
    });

    // Why Items
    db.prepare('DELETE FROM why_items').run();
    const insWhy = db.prepare('INSERT INTO why_items (id, title, description, image) VALUES (?, ?, ?, ?)');
    (data.whyItems || []).forEach(w => {
      insWhy.run(w.id, w.title, w.description, w.image);
      syncDocumentsForItem('whyItems', w);
    });

    // Positions
    db.prepare('DELETE FROM positions').run();
    const insPosition = db.prepare('INSERT INTO positions (id, title, department, location, type, description) VALUES (?, ?, ?, ?, ?, ?)');
    (data.positions || []).forEach(p => insPosition.run(p.id, p.title, p.department, p.location, p.type, p.description));

    // Technologies
    db.prepare('DELETE FROM technologies').run();
    const insTech = db.prepare('INSERT INTO technologies (id, name, image) VALUES (?, ?, ?)');
    (data.technologies || []).forEach(t => {
      insTech.run(t.id, t.name, t.image);
      syncDocumentsForItem('technologies', t);
    });

    // Team Celebrations
    db.prepare('DELETE FROM team_celebrations').run();
    const insCeleb = db.prepare('INSERT INTO team_celebrations (id, year, title, description, images, order_index) VALUES (?, ?, ?, ?, ?, ?)');
    (data.teamCelebrations || []).forEach((c, i) => {
      insCeleb.run(c.id, c.year, c.title, c.description, JSON.stringify(c.images || []), c.order_index || i);
      syncDocumentsForItem('teamCelebrations', c);
    });

    // Team Members
    db.prepare('DELETE FROM team_members').run();
    const insMember = db.prepare('INSERT INTO team_members (id, name, role, bio, image, order_index) VALUES (?, ?, ?, ?, ?, ?)');
    (data.teamMembers || []).forEach((m, i) => {
      insMember.run(m.id, m.name, m.role, m.bio || '', m.image || '', m.order_index ?? i);
      syncDocumentsForItem('teamMembers', m);
    });

    // Companies
    db.prepare('DELETE FROM companies').run();
    const insCompany = db.prepare('INSERT INTO companies (id, name, address, email, phone, website, mapUrl, description, images, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    (data.companies || []).forEach(c => {
      insCompany.run(c.id, c.name, c.address, c.email, c.phone, c.website || '', c.mapUrl || '', c.description || '', JSON.stringify(c.images || []), c.details || '');
      syncDocumentsForItem('companies', c);
    });

    // Timeline Items
    db.prepare('DELETE FROM timeline_items').run();
    const insTimeline = db.prepare('INSERT INTO timeline_items (id, year, clients, growth, description, order_index) VALUES (?, ?, ?, ?, ?, ?)');
    (data.timelineItems || []).forEach((t, i) => insTimeline.run(t.id, t.year, t.clients || 0, t.growth || '', t.description || '', i));

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
    // Hero ribbon arrays are stored in dedicated tables (not site_settings).
    if (['heroHighlights', 'heroStats', 'heroProofItems'].includes(key)) {
      const parsed = Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value) : []);

      if (key === 'heroHighlights') {
        db.prepare('DELETE FROM hero_highlights').run();
        const ins = db.prepare('INSERT INTO hero_highlights (id, label) VALUES (?, ?)');
        (parsed || []).forEach((h) => ins.run(h.id, h.label));
      } else if (key === 'heroStats') {
        db.prepare('DELETE FROM hero_stats').run();
        const ins = db.prepare('INSERT INTO hero_stats (id, value, label) VALUES (?, ?, ?)');
        (parsed || []).forEach((s) => ins.run(s.id, s.value, s.label));
      } else if (key === 'heroProofItems') {
        db.prepare('DELETE FROM hero_proof_items').run();
        const ins = db.prepare('INSERT INTO hero_proof_items (id, label) VALUES (?, ?)');
        (parsed || []).forEach((p) => ins.run(p.id, p.label));
      }
      return res.json({ success: true });
    }

    const stmt = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
    const serializedValue = (typeof value === 'object' && value !== null) ? JSON.stringify(value) : String(value);
    stmt.run(key, serializedValue);
    syncSettingDocument(key, serializedValue);
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
  heroProofItems: 'hero_proof_items',
  companies: 'companies',
  timelineItems: 'timeline_items',
  teamCelebrations: 'team_celebrations',
  teamMembers: 'team_members'
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
      return (Array.isArray(val) || (typeof val === 'object' && val !== null)) ? JSON.stringify(val) : val;
    });

    const stmt = db.prepare(sql);
    stmt.run(...values);
    syncDocumentsForItem(section, item);
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
      return (Array.isArray(val) || (typeof val === 'object' && val !== null)) ? JSON.stringify(val) : val;
    });

    const stmt = db.prepare(sql);
    const result = stmt.run(...values, id);
    
    if (result.changes === 0) return res.status(404).json({ error: 'Item not found' });
    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
    if (row) {
      const normalized = { ...row };
      if (normalized.images && typeof normalized.images === 'string') {
        try {
          normalized.images = JSON.parse(normalized.images);
        } catch (_e) {
          normalized.images = [];
        }
      }
      syncDocumentsForItem(section, normalized);
    }
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
    const referenceType = SECTION_REFERENCE_TYPE_MAP[section];
    if (referenceType) {
      db.prepare('DELETE FROM documents WHERE referenceType = ? AND referenceId = ?').run(referenceType, id);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/uploads', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const webPath = `/assets/uploads/${req.file.filename}`;
  return res.json({ success: true, path: webPath });
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
