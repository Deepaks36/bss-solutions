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

  db.exec(`
    CREATE TABLE IF NOT EXISTS footer (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      company_name TEXT NOT NULL DEFAULT 'Brilliant Systems',
      tagline TEXT NOT NULL DEFAULT 'We transform ambitious ideas into thriving digital products.',
      phone TEXT NOT NULL DEFAULT '+91-452 238 7388',
      whatsapp TEXT NOT NULL DEFAULT '914522387388',
      email TEXT NOT NULL DEFAULT 'info@bsyssolutions.com',
      address TEXT NOT NULL DEFAULT '90/2 Arun Nagar, Ponmeni, Madurai, India.',
      facebook TEXT NOT NULL DEFAULT 'https://www.facebook.com/brilliantsystemssolutions/',
      twitter TEXT NOT NULL DEFAULT 'https://twitter.com/bsspl_india',
      linkedin TEXT NOT NULL DEFAULT 'https://www.linkedin.com/company/brilliant-systems-solutions/',
      instagram TEXT NOT NULL DEFAULT '#',
      copyright TEXT NOT NULL DEFAULT 'Brilliant System Solutions Pvt Ltd. All rights reserved.'
    )
  `);

  // Seed footer defaults
  db.prepare(`INSERT OR IGNORE INTO footer (id) VALUES (1)`).run();

  ensureMessageColumns();
  ensureServiceColumns();
  ensureProductsColumns();
  seedInitialData();
}

function seedInitialData() {
  // 1. Site Settings
  const settings = [
    { key: 'heroTitle', value: 'Significant IT Software Technologies Development Kingdom Ends Here!' },
    { key: 'heroSubtitle', value: 'Brilliant Systems Solutions will transverse your business across the world by outsourcing your requirements to a leading IT software development company around the globe. We help clients launch next-generation products with robust, Advanced features, User-Friendly applications.' },
    { key: 'heroCta', value: "Let's Live Your Project Today!" },
    { key: 'heroStat', value: 'Successfully Completed & Delivered 300+ Projects!' },
    { key: 'heroCenterBadgeLabel', value: 'Trusted Leaders' },
    { key: 'heroImage', value: '/src/assets/images/hero/hero-main.jpg' },
    { key: 'heroTopLeftImage', value: '/src/assets/images/hero/hero-top-left.jpg' },
    { key: 'heroTopLeftBadgeTop', value: 'Growth rate' },
    { key: 'heroTopLeftBadgeBottom', value: '+340% Velocity' },
    { key: 'heroBottomRightImage', value: '/src/assets/images/hero/hero-bottom-right.jpg' },
    { key: 'heroBottomRightBadgeTop', value: 'System Status' },
    { key: 'heroBottomRightBadgeBottom', value: '100% Uptime Guaranteed' },
    { key: 'aboutTitle', value: 'About Us' },
    { key: 'aboutBody', value: 'Brilliant Systems Solution Pvt. Ltd is a tech-leading IT consulting and software development company in the Digital Era! We have provisioned our esteemed clients with the Best-Suite Software Solutions. We mainly focus on ERP Development, Implementation, and integration. Our journey began out of the passion for a unique monarch in the industry.' },
    { key: 'aboutImage', value: '/src/assets/images/about/about-main.png' },
    { key: 'servicesTagline', value: 'We Are Best' },
    { key: 'servicesTitle', value: 'Our Services & Solution For Your Innovative Ideas!' },
    { key: 'servicesSubtitle', value: 'Team up with the perfect digital partner for all your technical needs to achieve your business goals, reduce costs and accelerate your business growth.' },
    { key: 'workflowTagline', value: 'Being a reputed service provider, we are offering streamlined workflow to clients!' },
    { key: 'workflowTitle', value: 'Our Seamless Workflow' },
    { key: 'whyTitle', value: 'Why Choose Us' },
    { key: 'testimonialsTagline', value: 'Testimonials' },
    { key: 'testimonialsTitle', value: 'The Leading Brands & Enterprises' },
    { key: 'ctaBannerText', value: 'Grow Your Business and Build Your Website or Software With Us.' },
    { key: 'newsTitle', value: 'News Room' },
    { key: 'newsTagline', value: 'Latest events and activities from our team' },
    { key: 'contactTitle', value: 'Reach Out' },
    { key: 'contactTagline', value: 'Let us help you build your next project' },
    { key: 'contactAddress', value: "M. Alia Building, 7th Floor, Gandhakoalhi Magu, Male', Maldives." },
    { key: 'contactEmail', value: 'info@bsyssolutions.com' },
    { key: 'contactPhone', value: '(0452) 238 738 80' },
    { key: 'careersTagline', value: 'Join Our Team' },
    { key: 'careersTitle', value: 'Latest Job Openings' },
    { key: 'careersSubtitle', value: 'Be part of a team that is redefining the future of technology solutions.' }
  ];

  const insSetting = db.prepare('INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)');
  settings.forEach(s => insSetting.run(s.key, s.value));

  // 2. Hero Sections
  const highlights = [
    { id: 'hh1', label: 'Enterprise HR platforms' },
    { id: 'hh2', label: 'Cloud-native product engineering' },
    { id: 'hh3', label: 'AI-driven workflow automation' }
  ];
  const insHighlight = db.prepare('INSERT OR IGNORE INTO hero_highlights (id, label) VALUES (?, ?)');
  highlights.forEach(h => insHighlight.run(h.id, h.label));

  const stats = [
    { id: 'hs1', value: '4.9/5', label: 'Client rating' },
    { id: 'hs2', value: '60+', label: 'Team members' },
    { id: 'hs3', value: '200+', label: 'Projects done' }
  ];
  const insStat = db.prepare('INSERT OR IGNORE INTO hero_stats (id, value, label) VALUES (?, ?, ?)');
  stats.forEach(s => insStat.run(s.id, s.value, s.label));

  const proof = [
    { id: 'hp1', label: 'HR Metrics' },
    { id: 'hp2', label: 'BSOL ERP Suite' },
    { id: 'hp3', label: 'AI Chatbot' },
    { id: 'hp4', label: 'Knowledgebase AI' }
  ];
  const insProof = db.prepare('INSERT OR IGNORE INTO hero_proof_items (id, label) VALUES (?, ?)');
  proof.forEach(p => insProof.run(p.id, p.label));

  // 3. Services
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

  // 4. Products
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

  // 5. Workflow
  const workflows = [
    { id: 'w1', title: 'Consultation', description: 'We start by understanding your vision and goals.', icon: 'Search', order_index: 0 },
    { id: 'w2', title: 'Planning', description: 'Creating a strategic roadmap for your project.', icon: 'Map', order_index: 1 },
    { id: 'w3', title: 'Development', description: 'Our experts build your solution with precision.', icon: 'Code', order_index: 2 },
    { id: 'w4', title: 'Deployment', description: 'Launching your product to the world.', icon: 'Rocket', order_index: 3 }
  ];
  const insWorkflow = db.prepare('INSERT OR IGNORE INTO workflow (id, title, description, icon, order_index) VALUES (?, ?, ?, ?, ?)');
  workflows.forEach(w => insWorkflow.run(w.id, w.title, w.description, w.icon, w.order_index));

  // 6. Testimonials
  const testimonials = [
    { id: 't1', quote: "BSS transformed our legacy systems into a modern, efficient platform. Their expertise is unmatched.", name: 'Sarah Johnson', role: 'CTO, TechCorp' },
    { id: 't2', quote: "The best partner for enterprise software development. Professional, responsive, and innovative.", name: 'Michael Chen', role: 'CEO, InnovateX' }
  ];
  const insTestimonial = db.prepare('INSERT OR IGNORE INTO testimonials (id, quote, name, role) VALUES (?, ?, ?, ?)');
  testimonials.forEach(t => insTestimonial.run(t.id, t.quote, t.name, t.role));

  // 7. News
  const news = [
    { id: 'n1', title: 'BSS Launches AI Suite', excerpt: 'Our new AI-driven workflow automation tools are now available.', image: '', date: '2025-10-15' },
    { id: 'n2', title: 'Named Top Developer 2025', excerpt: 'BSS recognized for excellence in enterprise software.', image: '', date: '2025-11-20' }
  ];
  const insNews = db.prepare('INSERT OR IGNORE INTO news (id, title, excerpt, image, date) VALUES (?, ?, ?, ?, ?)');
  news.forEach(n => insNews.run(n.id, n.title, n.excerpt, n.image, n.date));

  // 8. Clients
  const clients = [
    { id: 'c1', name: 'Global Logistics', image: '' },
    { id: 'c2', name: 'Metro Health', image: '' }
  ];
  const insClient = db.prepare('INSERT OR IGNORE INTO clients (id, name, image) VALUES (?, ?, ?)');
  clients.forEach(c => insClient.run(c.id, c.name, c.image));

  // 9. Why Items
  const whyItems = [
    { id: 'why1', title: 'Expert Team', description: 'Years of experience in complex integrations.', image: '' },
    { id: 'why2', title: 'Rapid Delivery', description: 'Agile methodologies for faster time-to-market.', image: '' }
  ];
  const insWhy = db.prepare('INSERT OR IGNORE INTO why_items (id, title, description, image) VALUES (?, ?, ?, ?)');
  whyItems.forEach(w => insWhy.run(w.id, w.title, w.description, w.image));

  // 10. Positions
  const positions = [
    { id: 'pos1', title: 'Senior React Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Lead our frontend development efforts.' },
    { id: 'pos2', title: 'Node.js Architect', department: 'Engineering', location: 'Hybrid', type: 'Contract', description: 'Design scalable backend architectures.' }
  ];
  const insPosition = db.prepare('INSERT OR IGNORE INTO positions (id, title, department, location, type, description) VALUES (?, ?, ?, ?, ?, ?)');
  positions.forEach(p => insPosition.run(p.id, p.title, p.department, p.location, p.type, p.description));

  // 11. Technologies
  const techs = [
    { id: 'tech1', name: 'React', image: '' },
    { id: 'tech2', name: 'Node.js', image: '' },
    { id: 'tech3', name: 'SQLite', image: '' },
    { id: 'tech4', name: 'Typescript', image: '' }
  ];
  const insTech = db.prepare('INSERT OR IGNORE INTO technologies (id, name, image) VALUES (?, ?, ?)');
  techs.forEach(t => insTech.run(t.id, t.name, t.image));
}

initDb();

export default db;
