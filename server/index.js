import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
