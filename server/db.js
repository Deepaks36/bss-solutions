import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(process.cwd(), 'data.db');
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

    if (!columns.includes('images')) {
      db.exec('ALTER TABLE products ADD COLUMN images TEXT');
      console.log('Added "images" column to products table');
    }
  } catch (error) {
    console.error('Error ensuring products columns:', error.message);
    // Table might not exist yet - CREATE will handle it
  }
}

function ensureDocumentsTable() {
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

function ensureTestimonialColumns() {
  const columns = db.prepare('PRAGMA table_info(testimonials)').all().map((column) => column.name);

  if (!columns.includes('videoUrl')) {
    db.exec('ALTER TABLE testimonials ADD COLUMN videoUrl TEXT');
  }

  if (!columns.includes('audioOnly')) {
    db.exec('ALTER TABLE testimonials ADD COLUMN audioOnly INTEGER NOT NULL DEFAULT 0');
  }

  if (!columns.includes('videoMime')) {
    db.exec('ALTER TABLE testimonials ADD COLUMN videoMime TEXT');
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
      images TEXT,
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
      role TEXT NOT NULL,
      videoUrl TEXT,
      audioOnly INTEGER NOT NULL DEFAULT 0,
      videoMime TEXT
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
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      website TEXT,
      mapUrl TEXT,
      description TEXT,
      images TEXT, -- Store as JSON array of strings
      details TEXT  -- Store as JSON or Text
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS timeline_items (
      id TEXT PRIMARY KEY,
      year TEXT NOT NULL,
      clients INTEGER NOT NULL,
      growth TEXT NOT NULL,
      description TEXT NOT NULL,
      order_index INTEGER DEFAULT 0
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS team_celebrations (
      id TEXT PRIMARY KEY,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      images TEXT NOT NULL, -- Store as JSON array of string Data URIs/URLs
      order_index INTEGER DEFAULT 0
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      order_index INTEGER DEFAULT 0
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
  ensureDocumentsTable();
  ensureTestimonialColumns();
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
    { key: 'careersSubtitle', value: 'Be part of a team that is redefining the future of technology solutions.' },
    { key: 'ceoName', value: 'John Brilliant' },
    { key: 'ceoRole', value: 'Founder & CEO' },
    { key: 'ceoMessage', value: 'At BSS Solutions, we believe that our greatest asset is our people. Our culture is built on innovation, collaboration, and a relentless pursuit of excellence.' },
    { key: 'ceoCareerLeftTitle', value: 'Early Career' },
    { key: 'ceoCareerRightTitle', value: 'First Breakthrough' },
    { key: 'ceoCareerRightBody', value: 'He started by taking ownership of real client problems, building practical systems, and quickly learning what works at scale.' },
    { key: 'ceoImage', value: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800' },
    { key: 'teamTagline', value: 'Our Culture' },
    { key: 'teamTitle', value: 'Meet the Team Behind Our Success' }
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
      images: JSON.stringify([]),
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
      images: JSON.stringify([]),
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
      images: JSON.stringify([]),
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
      images: JSON.stringify([]),
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
  const insProduct = db.prepare('INSERT OR IGNORE INTO products (id, title, description, icon, image, images, accent, bullets, type, details, detailsImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  products.forEach(p => insProduct.run(p.id, p.title, p.description, p.icon, p.image, p.images, p.accent, p.bullets, p.type, p.details, p.detailsImage));

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
    { id: 't1', quote: "BSS transformed our legacy systems into a modern, efficient platform. Their expertise is unmatched.", name: 'Sarah Johnson', role: 'CTO, TechCorp', videoUrl: '', audioOnly: 0, videoMime: '' },
    { id: 't2', quote: "The best partner for enterprise software development. Professional, responsive, and innovative.", name: 'Michael Chen', role: 'CEO, InnovateX', videoUrl: '', audioOnly: 0, videoMime: '' }
  ];
  const insTestimonial = db.prepare('INSERT OR IGNORE INTO testimonials (id, quote, name, role, videoUrl, audioOnly, videoMime) VALUES (?, ?, ?, ?, ?, ?, ?)');
  testimonials.forEach(t => insTestimonial.run(t.id, t.quote, t.name, t.role, t.videoUrl, t.audioOnly, t.videoMime));

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

  // 12. Companies
  const companies = [
    {
      id: 'comp1',
      name: 'Brilliant Systems Solutions (India)',
      address: '90/2 Arun Nagar, Ponmeni, Madakulam Main Road, Madurai, India',
      email: 'info@bsyssolutions.com',
      phone: '+91-452 238 7388',
      website: 'https://bsyssolutions.com',
      mapUrl: '',
      description: 'Our Indian headquarters focusing on core R&D and enterprise solutions.',
      images: JSON.stringify(['/src/assets/images/hero/hero-main.jpg', '/src/assets/images/hero/hero-top-left.jpg']),
      details: 'Leading development center for BSOL ERP and HRMetrics platforms.'
    },
    {
      id: 'comp2',
      name: 'Brilliant Systems Solutions (Maldives)',
      address: "M. Alia Building, 7th Floor, Gandhakoalhi Magu, Male', Maldives",
      email: 'sales@bsyssolutions.com',
      phone: '+91- 452 238 7388',
      website: 'https://bsyssolutions.com',
      description: 'Our main headquarters and development hub in India.',
      details: 'Brilliant Systems Solutions Private Limited in India is the central heart of our operations, where we develop cutting-edge solutions in ERP, AI, and Custom App Development. Our Madurai office houses our core engineering and support teams dedicated to global client success.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200'
      ])
    },
    {
      id: 'comp-maldives',
      name: 'Systems Solutions Private Limited (Maldives)',
      address: 'M. Alia Building, 7th Floor, Gandhakoalhi Magu, Male’, Maldives',
      email: 'info@solutions.com.mv',
      phone: '(960) 301 13 55',
      website: 'https://solutions.com.mv',
      description: 'Our primary presence in the Maldives for localized support.',
      details: 'In the Maldives, Systems Solutions Private Limited provides specialized technology consulting and localized support for our growing client base in the region. We focus on delivering tailored ERP solutions that cater to the unique needs of Maldivian businesses.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=1200'
      ])
    },
    {
      id: 'comp-bhutan',
      name: 'Yang Khor Private Limited (Bhutan)',
      address: '2nd Floor, KMT Building Changangkha Thimphu, Bhutan',
      email: 'info@yangkhor.com',
      phone: '(975) 8939688814',
      website: 'https://yangkhor.com',
      description: 'Empowering businesses in Bhutan with innovative tech.',
      details: 'Yang Khor Private Limited represents our commitment to the Bhutanese market, providing modern technology solutions and consulting services to help local enterprises thrive in the digital age.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80&w=1200'
      ])
    }
  ];

  const insCompany = db.prepare('INSERT OR IGNORE INTO companies (id, name, address, email, phone, website, description, details, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
companies.forEach(c => insCompany.run(c.id, c.name, c.address, c.email, c.phone, c.website, c.description, c.details, c.images));

  // 13. Timeline Items
  const timeline = [
    { id: 'time1', year: '2020', clients: 50, growth: 'Starting', description: 'Established our foundation and launched BSOL ERP v1.', order_index: 0 },
    { id: 'time2', year: '2022', clients: 150, growth: '3x', description: 'Expanded to international markets and released HRMetrics.', order_index: 1 },
    { id: 'time3', year: '2024', clients: 300, growth: '2x', description: 'Reached 300+ successful projects milestone.', order_index: 2 },
    { id: 'time4', year: '2026', clients: 500, growth: '1.6x', description: 'Leading the digital transformation with AI-driven solutions.', order_index: 3 }
  ];
  const insTimeline = db.prepare('INSERT OR IGNORE INTO timeline_items (id, year, clients, growth, description, order_index) VALUES (?, ?, ?, ?, ?, ?)');
  timeline.forEach(t => insTimeline.run(t.id, t.year, t.clients, t.growth, t.description, t.order_index));

  // 14. Team Members
  const members = [
    { id: 'member1', name: 'Alice Johnson', role: 'Lead Engineer', bio: 'Passionate about building scalable systems and mentoring junior developers.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', order_index: 0 },
    { id: 'member2', name: 'Raj Patel', role: 'Product Manager', bio: 'Bridging the gap between business goals and technical execution.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', order_index: 1 },
    { id: 'member3', name: 'Sara Kim', role: 'UI/UX Designer', bio: 'Crafting intuitive and beautiful user experiences across all platforms.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400', order_index: 2 }
  ];
  const insMember = db.prepare('INSERT OR IGNORE INTO team_members (id, name, role, bio, image, order_index) VALUES (?, ?, ?, ?, ?, ?)');
  members.forEach(m => insMember.run(m.id, m.name, m.role, m.bio, m.image, m.order_index));

  // 15. Team Celebrations
  const celebrations = [
    { id: 'celeb1', year: 2022, title: 'Annual Team Retreat', description: 'Our 2022 retreat in the hills of Himachal was a time of bonding and strategic planning. We shared visions for the future and competed in friendly outdoor challenges.', images: JSON.stringify(['https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1549413204-61b477b94e02?auto=format&fit=crop&q=80&w=600']), order_index: 0 },
    { id: 'celeb2', year: 2022, title: 'Project Success Party', description: 'Celebrating the successful launch of BSOL ERP v2 with the entire engineering team. A night of music, dinner, and well-deserved recognition.', images: JSON.stringify(['https://images.unsplash.com/photo-1519671482749-fd09be45bc76?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600']), order_index: 1 },
    { id: 'celeb3', year: 2023, title: 'International Office Expansion', description: 'Marking our expansion into new territories. This celebration brought together team members from across our global offices.', images: JSON.stringify(['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600']), order_index: 2 },
    { id: 'celeb4', year: 2024, title: 'New Year Kickoff 2024', description: 'Starting the year with high energy and new ambitions. Our kickoff event featured inspirational talks and team-building workshops.', images: JSON.stringify(['https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=600']), order_index: 3 }
  ];
  const insCeleb = db.prepare('INSERT OR IGNORE INTO team_celebrations (id, year, title, description, images, order_index) VALUES (?, ?, ?, ?, ?, ?)');
  celebrations.forEach(c => insCeleb.run(c.id, c.year, c.title, c.description, c.images, c.order_index));
}

initDb();

export default db;
