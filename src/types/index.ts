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

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroStat: string;
  heroCenterBadgeLabel?: string;
  heroImage: string;
  heroTopLeftImage?: string;
  heroTopLeftBadgeTop?: string;
  heroTopLeftBadgeBottom?: string;
  heroBottomRightImage?: string;
  heroBottomRightBadgeTop?: string;
  heroBottomRightBadgeBottom?: string;
  heroHighlights: HomeHighlight[];
  heroStats: HomeStat[];
  heroProofItems: HomeProofItem[];
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;
  servicesTagline: string;
  servicesTitle: string;
  servicesSubtitle: string;
  workflowTagline: string;
  workflowTitle: string;
  whyTitle: string;
  testimonialsTagline: string;
  testimonialsTitle: string;
  ctaBannerText: string;
  newsTitle: string;
  newsTagline: string;
  contactTitle: string;
  contactTagline: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  careersTagline: string;
  careersTitle: string;
  careersSubtitle: string;
  services: Service[];
  products: Service[];
  workflow: WorkflowStep[];
  testimonials: Testimonial[];
  news: NewsItem[];
  clients: Client[];
  whyItems: WhyItem[];
  positions: JobPosition[];
  technologies: Technology[];
}
