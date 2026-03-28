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
  db.exec(`
        CREATE TABLE IF NOT EXISTS site_content (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            data TEXT NOT NULL
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
