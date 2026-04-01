# Database Integration & CRUD Operations Guide

## Overview

Your project already has a **complete database integration** using **SQLite** with **better-sqlite3**. This guide explains how the database is structured and how CRUD operations work.

---

## Database Architecture

### Technology Stack
- **Database**: SQLite (file-based, stored as `data.db`)
- **Driver**: `better-sqlite3` (synchronous, fast)
- **Backend**: Express.js (Node.js)
- **Frontend**: React + TypeScript

### Database Location
- Main database: `C:\Users\deepak\Downloads\bss\data.db`
- Server database: `C:\Users\deepak\Downloads\bss\server\data.db`

---

## Database Tables

Your database has **17 tables** organized as follows:

### 1. **site_settings** - Global Configuration
Stores key-value pairs for site-wide settings.
```sql
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
)
```

### 2. **hero_highlights** - Hero Section Highlights
```sql
CREATE TABLE hero_highlights (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL
)
```

### 3. **hero_stats** - Hero Section Statistics
```sql
CREATE TABLE hero_stats (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL
)
```

### 4. **hero_proof_items** - Hero Section Proof Items
```sql
CREATE TABLE hero_proof_items (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL
)
```

### 5. **services** - Service Offerings
```sql
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  image TEXT,
  accent TEXT,
  bullets TEXT -- JSON array
)
```

### 6. **products** - Product Catalog
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  image TEXT,
  accent TEXT,
  bullets TEXT, -- JSON array
  details TEXT, -- JSON object
  detailsImage TEXT,
  type TEXT
)
```

### 7. **workflow** - Workflow Steps
```sql
CREATE TABLE workflow (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
)
```

### 8. **testimonials** - Client Testimonials
```sql
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL
)
```

### 9. **news** - News Articles
```sql
CREATE TABLE news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image TEXT NOT NULL,
  date TEXT NOT NULL
)
```

### 10. **clients** - Client Logos
```sql
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL
)
```

### 11. **why_items** - Why Choose Us Items
```sql
CREATE TABLE why_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL
)
```

### 12. **positions** - Job Openings
```sql
CREATE TABLE positions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL
)
```

### 13. **technologies** - Technology Stack
```sql
CREATE TABLE technologies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL
)
```

### 14. **messages** - Contact Form Submissions
```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### 15. **footer** - Footer Configuration
```sql
CREATE TABLE footer (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  company_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  facebook TEXT NOT NULL,
  twitter TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  instagram TEXT NOT NULL,
  copyright TEXT NOT NULL
)
```

### 16. **site_content** - Legacy Backup
Stores the entire site content as JSON (for backward compatibility).

---

## API Endpoints (CRUD Operations)

### Content Management

#### 1. Get All Content
```http
GET /api/content
```
**Response**: Returns all site content from structured tables.

#### 2. Update All Content (Full Sync)
```http
POST /api/content
Content-Type: application/json

{
  "heroTitle": "...",
  "services": [...],
  "products": [...]
}
```

#### 3. Update Single Setting
```http
PATCH /api/content/settings
Content-Type: application/json

{
  "key": "heroTitle",
  "value": "New Title"
}
```

### Section Management

#### 4. Add Item to Section
```http
POST /api/content/sections/:section
Content-Type: application/json

{
  "id": "new-id",
  "title": "New Item",
  ...
}
```

**Supported sections**: `services`, `products`, `workflow`, `testimonials`, `news`, `clients`, `whyItems`, `positions`, `technologies`, `heroHighlights`, `heroStats`, `heroProofItems`

#### 5. Update Item in Section
```http
PUT /api/content/sections/:section
Content-Type: application/json

{
  "id": "item-id",
  "title": "Updated Title",
  ...
}
```

#### 6. Delete Item from Section
```http
DELETE /api/content/sections/:section?id=item-id
```

### Footer Management

#### 7. Get Footer
```http
GET /api/footer
```

#### 8. Update Footer
```http
PUT /api/footer
Content-Type: application/json

{
  "company_name": "...",
  "tagline": "...",
  ...
}
```

### Messages (Contact Form)

#### 9. Create Message
```http
POST /api/messages
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Hello..."
}
```

#### 10. Get All Messages
```http
GET /api/messages
```

#### 11. Update Message
```http
PUT /api/messages/:id
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Updated Subject",
  "message": "Updated message",
  "verified": true
}
```

#### 12. Verify Message
```http
PATCH /api/messages/:id/verify
```

#### 13. Unverify Message
```http
PATCH /api/messages/:id/unverify
```

#### 14. Delete Message
```http
DELETE /api/messages/:id
```

### Authentication

#### 15. Admin Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

---

## Frontend Integration (React Context)

### SiteContext API

The frontend uses React Context (`SiteContext`) to manage state and sync with the backend.

#### Available Methods:

```typescript
// Update a single content field
updateContent(key: keyof SiteContent, value: any)

// Update a single field in a section item
updateSectionItem(section: keyof SiteContent, id: string, field: string, value: any)

// Update multiple fields in a section item (atomic)
updateSectionItemAtomic(section: keyof SiteContent, id: string, updates: Record<string, any>)

// Add a new item to a section
addItemToSection(section: keyof SiteContent, item: any)

// Delete an item from a section
deleteItemFromSection(section: keyof SiteContent, id: string)

// Reset content to defaults
resetContent()
```

#### Usage Example:

```typescript
import { useSite } from './context/SiteContext';

function MyComponent() {
  const { content, updateContent, addItemToSection } = useSite();

  // Update hero title
  const handleUpdateTitle = () => {
    updateContent('heroTitle', 'New Title');
  };

  // Add a new service
  const handleAddService = () => {
    addItemToSection('services', {
      id: 's7',
      title: 'New Service',
      description: 'Description',
      icon: '',
      accent: 'from-blue-600 to-cyan-500',
      bullets: ['Feature 1', 'Feature 2']
    });
  };

  return (
    <div>
      <h1>{content.heroTitle}</h1>
      <button onClick={handleUpdateTitle}>Update Title</button>
      <button onClick={handleAddService}>Add Service</button>
    </div>
  );
}
```

---

## Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
This starts both:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### 3. Start Backend Only
```bash
npm run server
```

---

## Configuration Files

### appsettings.json
```json
{
  "Admin": {
    "Username": "admin",
    "Password": "admin123"
  },
  "Smtp": {
    "Host": "smtp.gmail.com",
    "Port": 465,
    "User": "your-email@gmail.com",
    "Pass": "your-app-password",
    "From": "noreply@bsyssolutions.com",
    "ContactToEmail": "info@bsyssolutions.com"
  },
  "BackendPort": 3001,
  "FrontendPort": 5173
}
```

---

## Database Initialization

The database is automatically initialized when the server starts:

1. **Tables are created** if they don't exist
2. **Migrations are applied** (e.g., adding new columns)
3. **Initial data is seeded** if tables are empty

See `server/db.js` → `initDb()` and `seedInitialData()` functions.

---

## Email Integration

When a contact form is submitted:
1. Message is saved to the `messages` table
2. **Admin notification email** is sent to `ContactToEmail`
3. **User confirmation email** is sent to the submitter

Configure SMTP settings in `appsettings.json`.

---

## Admin Features

### Admin Login
- Navigate to the site and click the admin icon
- Default credentials: `admin` / `admin123`

### Edit Mode
- Toggle edit mode to modify content inline
- Changes are saved automatically to the database

### Message Management
- View all contact form submissions
- Mark messages as verified
- Edit or delete messages
- Filter and search messages

---

## Best Practices

### 1. Always Use Context Methods
Don't directly call `fetch()` in components. Use the context methods:
```typescript
// ❌ Bad
fetch('/api/content/settings', { ... })

// ✅ Good
updateContent('heroTitle', 'New Title')
```

### 2. Use Atomic Updates for Multiple Fields
```typescript
// ❌ Bad (multiple API calls)
updateSectionItem('services', 's1', 'title', 'New Title')
updateSectionItem('services', 's1', 'description', 'New Desc')

// ✅ Good (single API call)
updateSectionItemAtomic('services', 's1', {
  title: 'New Title',
  description: 'New Desc'
})
```

### 3. Generate Unique IDs
```typescript
const newId = `s${Date.now()}`;
```

### 4. Handle JSON Fields
Some fields store JSON (e.g., `bullets`, `details`):
```typescript
// Store as JSON string in DB
bullets: JSON.stringify(['Item 1', 'Item 2'])

// Parse when reading
const bullets = JSON.parse(service.bullets)
```

---

## Troubleshooting

### Database Locked Error
If you get "database is locked":
- Close any SQLite browser tools
- Restart the server

### Port Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001

# Kill process on port 5173
npx kill-port 5173
```

### Reset Database
```bash
# Delete database file
rm data.db

# Restart server (will recreate with seed data)
npm run server
```

---

## Summary

Your project has a **fully functional database integration** with:
- ✅ SQLite database with 17 tables
- ✅ Complete CRUD API endpoints
- ✅ React Context for state management
- ✅ Automatic database initialization
- ✅ Email integration for contact forms
- ✅ Admin authentication and management
- ✅ Real-time updates between frontend and backend

**No additional setup is required!** The database integration is already complete and working.
