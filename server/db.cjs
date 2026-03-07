const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../data.db');
const db = new Database(dbPath);

// Initialize database
function initDb() {
    // Single-row table for global settings/content
    db.exec(`
        CREATE TABLE IF NOT EXISTS site_content (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            data TEXT NOT NULL
        )
    `);

    // We can also create separate tables if we want more granular control,
    // but for now, we'll store the whole SiteContent object as JSON
    // to match the existing frontend structure easily.
    // Initial seed if empty
    const row = db.prepare('SELECT id FROM site_content WHERE id = 1').get();
    if (!row) {
        // We'll need the defaultContent from siteData.ts
        // Since this is a Node.js environment, we might need to handle the import/require carefully
        // For simplicity, I'll pass it from the server or hardcode it if it's small, 
        // but it's better to keep it in a shared place or just handle it in the server's first run.
    }
}

initDb();

module.exports = db;
