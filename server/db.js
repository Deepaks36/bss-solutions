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
 
function ensureServiceColumns() {
  const columns = db.prepare('PRAGMA table_info(services)').all().map((column) => column.name);
  
  // Migration: If is_product exists, move products to the new products table
  if (columns.includes('is_product')) {
    // Ensure products table exists first
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        image TEXT,
        accent TEXT,
        bullets TEXT -- Store as JSON string
      )
    `);

    // Move data
    const products = db.prepare("SELECT * FROM services WHERE is_product = 1").all();
    const insProduct = db.prepare("INSERT OR REPLACE INTO products (id, title, description, icon, image, accent, bullets) VALUES (?, ?, ?, ?, ?, ?, ?)");
    products.forEach(p => insProduct.run(p.id, p.title, p.description, p.icon, p.image, p.accent, p.bullets));

    // Delete moved data from services
    db.exec("DELETE FROM services WHERE is_product = 1");
    
    // Note: We'll leave the column there for now to avoid complex table recreation in SQLite versions < 3.35.0
    // But we will update the schema definition below.
  }
}

function ensureProductsColumns() {
  try {
    const columns = db.prepare('PRAGMA table_info(products)').all().map((column) => column.name);

    if (!columns.includes('type')) {
      db.exec('ALTER TABLE products ADD COLUMN type TEXT');
      console.log('Added "type" column to products table');
    }

    if (!columns.includes('details')) {
      db.exec('ALTER TABLE products ADD COLUMN details TEXT');
      console.log('Added "details" column to products table');
    }

    if (!columns.includes('detailsImage')) {
      db.exec('ALTER TABLE products ADD COLUMN detailsImage TEXT');
      console.log('Added "detailsImage" column to products table');
    }
  } catch (error) {
    console.error('Error ensuring products columns:', error.message);
    // Table might not exist yet - CREATE will handle it
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
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      image TEXT,
      accent TEXT,
      bullets TEXT, -- Store as JSON string
      details TEXT, -- Extended product details (JSON)
      detailsImage TEXT,
      type TEXT
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
  ensureServiceColumns();
  ensureProductsColumns();
  seedInitialData();
}

function seedInitialData() {
  const services = [
    {
      id: 's1',
      title: 'Mobile Apps Development',
      description: 'Create powerful, native-feeling mobile experiences for iOS and Android that engage users and drive business growth through innovative mobile solutions.',
      icon: '',
      image: '',
      accent: 'from-blue-600 to-cyan-500',
      bullets: JSON.stringify(['Android & iOS Development', 'Cross-platform Solutions', 'UI/UX Mobile Design', 'Performance Optimization'])
    },
    {
      id: 's2',
      title: 'Web CMS Development',
      description: 'Build scalable and secure content management systems that empower your team to manage web content efficiently without technical expertise.',
      icon: '',
      image: '',
      accent: 'from-blue-600 to-cyan-500',
      bullets: JSON.stringify(['Custom CMS Solutions', 'Headless CMS Architecture', 'Enterprise Web Portals', 'Multi-tenant Systems'])
    },
    {
      id: 's3',
      title: 'E-Commerce Solutions',
      description: 'Launch and scale your online business with robust e-commerce platforms featuring secure payments, inventory management, and seamless customer journeys.',
      icon: '',
      image: '',
      accent: 'from-emerald-600 to-teal-500',
      bullets: JSON.stringify(['Custom Storefronts', 'Payment Gateway Integration', 'Inventory Management Systems', 'Customer Loyalty Platforms'])
    },
    {
      id: 's4',
      title: 'UI/UX Design Studio',
      description: 'Elevate your digital products with human-centric design that combines aesthetic beauty with intuitive functionality for maximum user engagement.',
      icon: '',
      image: '',
      accent: 'from-rose-600 to-pink-500',
      bullets: JSON.stringify(['User Research & Analysis', 'Intelligent Wireframing', 'Interactive Prototyping', 'Modern Visual Design'])
    },
    {
      id: 's5',
      title: 'Cloud & DevOps',
      description: 'Optimize your infrastructure with modern cloud solutions and automated CI/CD pipelines that ensure reliability, security, and rapid deployment.',
      icon: '',
      image: '',
      accent: 'from-indigo-600 to-violet-500',
      bullets: JSON.stringify(['Cloud Migration & Strategy', 'Automated CI/CD Pipelines', 'Container Orchestration', 'Infrastructure as Code'])
    },
    {
      id: 's6',
      title: 'Custom CRM Solutions',
      description: 'Manage customer relationships effectively with custom-built CRM tools that streamline sales, marketing, and support processes.',
      icon: '',
      image: '',
      accent: 'from-amber-500 to-orange-500',
      bullets: JSON.stringify(['Sales Force Automation', 'Customer Data Analytics', 'Lead Management Systems', 'Integration Services'])
    }
  ];

  const insService = db.prepare('INSERT OR IGNORE INTO services (id, title, description, icon, image, accent, bullets) VALUES (?, ?, ?, ?, ?, ?, ?)');
  services.forEach(s => insService.run(s.id, s.title, s.description, s.icon, s.image, s.accent, s.bullets));

  const products = [
    {
      id: 'p1',
      title: 'BSOL',
      description: 'A comprehensive enterprise resource planning solution tailored for modern business environments.',
      icon: '',
      image: '',
      accent: 'from-blue-600 to-cyan-500',
      bullets: JSON.stringify(['Financial Management', 'Inventory Control', 'Human Resources', 'Supply Chain Management']),
      type: 'ERP System',
      details: JSON.stringify({
        fullName: 'Billing System Shop Billing System (BSOL)',
        category: 'ERP-based Solution',
        description: 'BSOL is an advanced ERP system designed specifically for billing, shop management, and retail operations. It streamlines inventory management, point-of-sale transactions, and financial operations.',
        keyFeatures: [
          'Integrated billing and invoicing system',
          'Real-time inventory tracking',
          'Multi-store management capabilities',
          'Advanced reporting and analytics',
          'Barcode and SKU management',
          'Customer loyalty programs',
          'Batch processing for bulk operations',
          'Integration with payment gateways'
        ],
        useCases: ['Retail Shops', 'Supermarkets', 'Convenience Stores', 'Wholesale Distribution']
      }),
      detailsImage: ''
    },
    {
      id: 'p2',
      title: 'HRMetrics',
      description: 'A comprehensive human resources management platform for payroll, attendance, and salary processing.',
      icon: '',
      image: '',
      accent: 'from-purple-600 to-fuchsia-500',
      bullets: JSON.stringify(['Payroll Processing', 'Attendance Tracking', 'Salary Management', 'Employee Reports']),
      type: 'Payroll System',
      details: JSON.stringify({
        fullName: 'HRMetrics Payroll & Attendance System',
        category: 'Human Resources Management',
        description: 'HRMetrics is a robust payroll and attendance management system that automates employee compensation, attendance tracking, and HR analytics. It provides real-time insights into workforce data and ensures accurate salary processing.',
        keyFeatures: [
          'Automated payroll calculations',
          'Biometric and digital attendance integration',
          'Salary slip generation',
          'Tax and statutory compliance',
          'Leave management system',
          'Performance tracking dashboard',
          'Automated salary disbursement',
          'Employee self-service portal',
          'Advance salary processing',
          'Deduction and allowance management'
        ],
        useCases: ['Manufacturing Units', 'IT Companies', 'Educational Institutions', 'Corporate Offices', 'NGOs']
      }),
      detailsImage: ''
    },
    {
      id: 'p3',
      title: 'GoBoat',
      description: 'A modern boat booking and maritime experience platform for seamless reservations.',
      icon: '',
      image: '',
      accent: 'from-cyan-600 to-blue-500',
      bullets: JSON.stringify(['Booking Management', 'Fleet Management', 'Real-time Availability', 'Payment Integration']),
      type: 'Booking Platform',
      details: JSON.stringify({
        fullName: 'GoBoat - Boat Booking Platform',
        category: 'Tourism & Recreation',
        description: 'GoBoat is an innovative online platform that enables users to browse, reserve, and book various types of boats for recreational, commercial, or transportation purposes. It revolutionizes the maritime industry with seamless digital booking.',
        keyFeatures: [
          'Comprehensive boat catalog with photos and specifications',
          'Real-time availability and pricing',
          'Secure online booking system',
          'Flexible cancellation policies',
          'Multiple payment gateway integration',
          'GPS tracking for active bookings',
          'Captain/Crew booking management',
          'Rating and review system',
          'Tourist guide recommendations',
          'Emergency contact integration'
        ],
        useCases: ['Tourism Companies', 'Water Sports Centers', 'Private Yacht Clubs', 'Ferry Services', 'Marine Adventure Companies']
      }),
      detailsImage: ''
    },
    {
      id: 'p4',
      title: 'Premise Pro',
      description: 'A comprehensive hotel management system for seamless operations and guest experiences.',
      icon: '',
      image: '',
      accent: 'from-amber-500 to-orange-500',
      bullets: JSON.stringify(['Room Management', 'Reservation System', 'Guest Services', 'Billing & Reports']),
      type: 'Hotel Management System',
      details: JSON.stringify({
        fullName: 'Premise Pro - Hotel Management System',
        category: 'Hospitality Management',
        description: 'Premise Pro is a comprehensive hotel management system designed to streamline all aspects of hotel operations, from room management to guest services, billing, and analytics. It provides an integrated solution for boutique hotels and large chains.',
        keyFeatures: [
          'Inventory room management system',
          'Integrated reservation and booking engine',
          'Check-in and check-out automation',
          'Housekeeping management module',
          'Guest profile and history tracking',
          'Room rate management and pricing strategy',
          'Point of sale (POS) integration',
          'Multi-property management',
          'Guest feedback and complaint system',
          'Revenue management analytics',
          'Staff scheduling and management',
          'Maintenance and repair tracking'
        ],
        useCases: ['5-Star Hotels', 'Boutique Hotels', 'Resorts', 'Hostels', 'Guest Houses', 'Hotel Chains']
      }),
      detailsImage: ''
    }
  ];

  const insProduct = db.prepare('INSERT OR IGNORE INTO products (id, title, description, icon, image, accent, bullets, type, details, detailsImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  products.forEach(p => insProduct.run(p.id, p.title, p.description, p.icon, p.image, p.accent, p.bullets, p.type, p.details, p.detailsImage));
}

initDb();

export default db;
