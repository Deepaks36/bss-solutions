import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../data.db');
const db = new Database(dbPath);

function ensureMessageColumns() {
  const columns = db.prepare('PRAGMA table_info(messages)').all().map((column) => column.name);

  if (!columns.includes('verified')) {
    db.exec('ALTER TABLE messages ADD COLUMN verified INTEGER NOT NULL DEFAULT 0');
  }

  if (!columns.includes('updated_at')) {
    db.exec('ALTER TABLE messages ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP');
    db.exec('UPDATE messages SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)');
  }
}

// Initialize database
function initDb() {
  // Original site_content for backup/migration if needed
  db.exec(`
        CREATE TABLE IF NOT EXISTS site_content (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            data TEXT NOT NULL
        )
    `);

  // Structured Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS hero_highlights (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS hero_stats (
      id TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      label TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS hero_proof_items (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      image TEXT,
      accent TEXT,
      bullets TEXT -- Store as JSON string
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS workflow (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      order_index INTEGER DEFAULT 0
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      quote TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      image TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS why_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS positions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS technologies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `);

  db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            verified INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

  ensureMessageColumns();
}

initDb();

export default db;
