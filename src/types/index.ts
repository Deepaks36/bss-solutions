export interface Client {
  id: string;
  name: string;
  image: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at?: string;
  verified: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  accent?: string;
  bullets?: string[];
  is_product?: boolean;
  details?: string; // Extended product details (JSON)
  detailsImage?: string; // Image for details view
  type?: string; // Product type (e.g., ERP, Payroll, Booking, Hotel Management)
}

export interface HomeHighlight {
  id: string;
  label: string;
}

export interface HomeStat {
  id: string;
  value: string;
  label: string;
}

export interface HomeProofItem {
  id: string;
  label: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface WhyItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export interface Technology {
  id: string;
  name: string;
  image: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  website?: string;
  mapUrl?: string;
  description: string;
  images: string[];
  details: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  clients: number;
  growth: string;
  description: string;
  order_index?: number;
}

export interface TeamCelebration {
  id: string;
  year: number;
  title: string;
  description: string;
  images: string[];
  order_index?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order_index?: number;
}

export interface SiteContent {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroStat: string;
  heroCenterBadgeLabel: string;
  heroImage: string;
  heroHighlights: { id: string; label: string }[];
  heroStats: { id: string; value: string; label: string }[];
  heroProofItems: { id: string; label: string }[];
  heroTopLeftImage: string;
  heroTopLeftBadgeTop: string;
  heroTopLeftBadgeBottom: string;
  heroBottomRightImage: string;
  heroBottomRightBadgeTop: string;
  heroBottomRightBadgeBottom: string;

  // About Section
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;

  // Services Section
  servicesTagline: string;
  servicesTitle: string;
  servicesSubtitle: string;
  services: Service[];

  // Products Section
  products: Service[];

  // Workflow Section
  workflowTagline: string;
  workflowTitle: string;
  workflow: WorkflowStep[];

  // Why Choose Us Section
  whyTitle: string;
  whyItems: WhyItem[];

  // Testimonials Section
  testimonialsTagline: string;
  testimonialsTitle: string;
  testimonials: Testimonial[];

  // CTA Section
  ctaBannerText: string;

  // News Section
  newsTitle: string;
  newsTagline: string;
  news: NewsItem[];

  // Contact Section
  contactTitle: string;
  contactTagline: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;

  // Careers Section
  careersTagline: string;
  careersTitle: string;
  careersSubtitle: string;
  positions: JobPosition[];

  // Clients Section
  clients: Client[];

  // Tech Stack Section
  technologies: Technology[];

  // Company Section
  companies: Company[];

  // Timeline Section
  timelineItems: TimelineItem[];

  // Team Section
  ceoName?: string;
  ceoRole?: string;
  ceoMessage?: string;
  ceoImage?: string;
  teamTagline?: string;
  teamTitle?: string;
  teamCelebrations: TeamCelebration[];
  teamMembers: TeamMember[];
}
