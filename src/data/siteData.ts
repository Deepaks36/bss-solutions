import { SiteContent } from '../types';

export const defaultContent: SiteContent = {
  heroTitle: "Significant IT Software Technologies Development Kingdom Ends Here!",
  heroSubtitle:
    "Brilliant Systems Solutions will transverse your business across the world by outsourcing your requirements to a leading IT software development company around the globe. We help clients launch next-generation products with robust, Advanced features, User-Friendly applications.",
  heroCta: "Let's Live Your Project Today!",
  heroStat: "Successfully Completed & Delivered 300+ Projects!",
  heroImage: "/src/assets/images/hero/hero-main.jpg",
  heroTopLeftImage: "/src/assets/images/hero/hero-top-left.jpg",
  heroTopLeftBadgeTop: "Growth rate",
  heroTopLeftBadgeBottom: "+340% Velocity",
  heroBottomRightImage: "/src/assets/images/hero/hero-bottom-right.jpg",
  heroBottomRightBadgeTop: "System Status",
  heroBottomRightBadgeBottom: "100% Uptime Guaranteed",
  heroHighlights: [
    { id: "hh1", label: "Enterprise HR platforms" },
    { id: "hh2", label: "Cloud-native product engineering" },
    { id: "hh3", label: "AI-driven workflow automation" },
  ],
  heroStats: [
    { id: "hs1", value: "4.9/5", label: "Client rating" },
    { id: "hs2", value: "60+", label: "Team members" },
    { id: "hs3", value: "200+", label: "Projects done" },
  ],
  heroProofItems: [
    { id: "hp1", label: "HR Metrics" },
    { id: "hp2", label: "BSOL ERP Suite" },
    { id: "hp3", label: "AI Chatbot" },
    { id: "hp4", label: "Knowledgebase AI" },
  ],
  aboutTitle: "About Us",
  aboutBody:
    "Brilliant Systems Solution Pvt. Ltd is a tech-leading IT consulting and software development company in the Digital Era! We have provisioned our esteemed clients with the Best-Suite Software Solutions. We mainly focus on ERP Development, Implementation, and integration. Our journey began out of the passion for a unique monarch in the industry.",
  aboutImage: "/src/assets/images/about/about-main.png",
  servicesTagline: "We Are Best",
  servicesTitle: "Our Services & Solution For Your Innovative Ideas!",
  servicesSubtitle:
    "Team up with the perfect digital partner for all your technical needs to achieve your business goals, reduce costs and accelerate your business growth.",
  workflowTagline: "Being a reputed service provider, we are offering streamlined workflow to clients!",
  workflowTitle: "Our Seamless Workflow",
  whyTitle: "Why Choose Us",
  testimonialsTagline: "Testimonials",
  testimonialsTitle: "The Leading Brands & Enterprises",
  ctaBannerText: "Grow Your Business and Build Your Website or Software With Us.",
  newsTitle: "News Room",
  newsTagline: "Latest events and activities from our team",
  contactTitle: "Reach Out",
  contactTagline: "Let us help you build your next project",
  contactAddress: "M. Alia Building, 7th Floor, Gandhakoalhi Magu, Male', Maldives.",
  contactEmail: "info@bsyssolutions.com",
  contactPhone: "(0452) 238 738 80",
  careersTagline: "Join Our Team",
  careersTitle: "Latest Job Openings",
  careersSubtitle: "Be part of a team that is redefining the future of technology solutions.",

  services: [
    {
      id: "s1",
      title: "BSOL ERP",
      description: "A comprehensive enterprise resource planning platform designed to unify your finance, operations, procurement, and reporting into a single, high-performance secure ecosystem. Empower your business with robust data visibility and seamless automation across departments. Designed for scale, BSOL ERP bridges the gap between complex logistics and actionable business intelligence.",
      icon: "/src/assets/images/products/bsol-erp-icon.svg",
      image: "/src/assets/products/bsol_erp.png",
      accent: "from-blue-600 to-cyan-500",
      bullets: ["Finance workflows", "Inventory control", "Operational reporting", "Real-time analytics", "Secure ecosystem", "Scalable architecture"]
    },
    {
      id: "s2",
      title: "HR Metrics",
      description: "The ultimate workforce management dashboard. Track attendance, employee performance, payroll signals, and advanced people analytics with precision. Streamline HR operations from onboarding to retirement with a user-centric interface that simplifies complex personnel data into clear, manageable insights for leadership.",
      icon: "/src/assets/images/products/hrmetrics-icon.svg",
      image: "/src/assets/products/hrmetrics.png",
      accent: "from-indigo-600 to-violet-500",
      bullets: ["People analytics", "Payroll insights", "Employee performance", "Automated attendance", "HR operations", "Clear insights"]
    },
    {
      id: "s3",
      title: "GoBoat",
      description: "Revolutionize your maritime operations with a complete boat booking and fleet management solution. From automated scheduling to real-time customer tracking, GoBoat handles the complex logistics of your sea-based business. Ensure your fleet is always at peak efficiency with integrated maintenance alerts and dynamic pricing models tailored for high-demand seasons.",
      icon: "/src/assets/images/products/goboat-icon.svg",
      image: "/src/assets/products/goboat.png",
      accent: "from-emerald-600 to-teal-500",
      bullets: ["Fleet tracking", "Booking automation", "Customer management", "Dynamic pricing", "Peak efficiency", "Maintenance alerts"]
    },
    {
      id: "s4",
      title: "FariCampus",
      description: "An intelligent school and campus management solution. Streamline everything from student portals and academic tracking to resource scheduling and faculty management. Designed for modern educational institutions, FariCampus fosters a digital-first learning environment that connects parents, teachers, and students in real-time for improved academic outcomes and administrative efficiency.",
      icon: "/src/assets/images/products/faricampus-icon.svg",
      image: "/src/assets/products/faricampus.png",
      accent: "from-amber-500 to-orange-500",
      bullets: ["Student portals", "Academic tracking", "Resource scheduling", "Parent-Teacher communication", "Administrative efficiency", "Digital-first learning"]
    },
    {
      id: "s5",
      title: "AI Chatbot Koya",
      description: "Intelligent customer and employee support at your fingertips. Koya uses advanced AI to answer questions instantly, route support requests, and integrate seamlessly with your internal workflows and knowledge base. Reduce support volume by up to 60% while providing 24/7 instant assistance across all your digital channels, from web to mobile apps.",
      icon: "/src/assets/images/products/ai-chatbot-koya-icon.svg",
      image: "/src/assets/products/koya.png",
      accent: "from-rose-600 to-pink-500",
      bullets: ["24/7 assistance", "Smart routing", "Conversation history", "Knowledge base integration", "AI-assisted workflows", "Digital channels"]
    },
    {
      id: "s6",
      title: "Mobile Apps Development",
      description: "Produce mobile solutions that work flawlessly on all major operating systems and thousands of different mobile devices. We specialize in cross-platform and native developments.",
      icon: "",
      image: "",
      accent: "from-blue-600 to-indigo-500",
      bullets: ["iOS & Android", "Native Performance", "User Experience Focus", "Offline Capability", "Push Notifications", "Cloud Sync"]
    },
    {
      id: "s7",
      title: "Web CMS Development",
      description: "Create scalable and secure content management solutions that empower your team to manage information without technical expertise. Tailored to your brand's unique needs.",
      icon: "",
      image: "",
      accent: "from-cyan-600 to-blue-500",
      bullets: ["Admin Dashboards", "SEO Optimized", "Fast Performance", "Easy Content Editing", "Media Management", "User Permissions"]
    },
    {
      id: "s8",
      title: "E-Commerce Solutions",
      description: "Building high-conversion online stores that simplify the shopping journey. From interactive catalogs to secure payment gateways, we build end-to-end digital retail ecosystems.",
      icon: "",
      image: "",
      accent: "from-emerald-600 to-teal-500",
      bullets: ["Payment Gateways", "Inventory Sync", "Order Tracking", "Customer Retention", "Smooth Checkout", "Mobile Ready"]
    },
    {
      id: "s9",
      title: "UI/UX Design Studio",
      description: "Visual logic and aesthetic excellence. We design interfaces that are not only beautiful but also intuitive, reducing friction and increasing user satisfaction across all platforms.",
      icon: "",
      image: "",
      accent: "from-orange-500 to-amber-500",
      bullets: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Visual Identity", "Usability Testing"]
    },
    {
      id: "s10",
      title: "Cloud & DevOps",
      description: "Accelerate your development cycle with robust cloud infrastructure and automated deployment pipelines. We ensure your environments are always available, secure, and scalable.",
      icon: "",
      image: "",
      accent: "from-purple-600 to-fuchsia-500",
      bullets: ["AWS/Azure/GCP", "CI/CD Pipelines", "Containerization", "Server Security", "Auto-scaling", "24/7 Monitoring"]
    },
    {
      id: "s11",
      title: "Custom CRM Solutions",
      description: "Manage your customer relationships with surgical precision. We build custom CRM solutions that integrate your sales, support, and marketing into one single source of truth.",
      icon: "",
      image: "",
      accent: "from-pink-600 to-rose-500",
      bullets: ["Lead Management", "Sales Tracking", "Email Integration", "Report Generation", "Task Automation", "Team Collaboration"]
    },
    {
      id: "s12",
      title: "Software Development",
      description: "Custom software development tailored to your specific business needs. We build robust, scalable, and secure applications using the latest industry standards and frameworks.",
      icon: "",
      image: "",
      accent: "from-blue-600 to-cyan-500",
      bullets: ["Custom Solutions", "Agile Methodology", "Code Quality", "Legacy Migration", "API Integration", "Ongoing Support"]
    },
    {
      id: "s13",
      title: "SEO Services",
      description: "Improve your search engine rankings and drive organic traffic to your website. Our SEO specialists use data-driven strategies to increase your visibility and reach your target audience.",
      icon: "",
      image: "",
      accent: "from-indigo-600 to-violet-500",
      bullets: ["Keyword Research", "On-Page SEO", "Link Building", "Technical Audits", "Content Strategy", "Performance Tracking"]
    }
  ],

  workflow: [
    {
      id: "w1",
      title: "Gathering Client Requirements",
      description:
        "Once devoted to initiating the work, we congregate the ideas and conditions to invent the software as the client desired.",
      icon: "/src/assets/images/workflow/workflow-1.png",
    },
    {
      id: "w2",
      title: "Complete Demands Analysis",
      description:
        "Subsequently, we gather the necessary knowledge to do quick research to provide one of the best business solutions.",
      icon: "/src/assets/images/workflow/workflow-2.png",
    },
    {
      id: "w3",
      title: "Clear-Edge Development",
      description:
        "Our nifty tech teams will work with futuristic technologies to provide the software with magnificent quality.",
      icon: "/src/assets/images/workflow/workflow-3.png",
    },
    {
      id: "w4",
      title: "God-Eye Testing",
      description:
        "Before originating the developed software, we cross-check and make bugs-free scripts with a good navigation process.",
      icon: "/src/assets/images/workflow/workflow-4.png",
    },
    {
      id: "w5",
      title: "Promptly Delivery",
      description:
        "We always have a strict policy to deliver the software just at the time when the client needs it.",
      icon: "/src/assets/images/workflow/workflow-5.png",
    },
    {
      id: "w6",
      title: "User-Friendly Support",
      description:
        "Even after delivery, our support team will follow the client frequently to maintain a customer-friendly relationship.",
      icon: "/src/assets/images/workflow/workflow-6.png",
    },
  ],

  testimonials: [
    {
      id: "t1",
      quote:
        "HR MetricS has done a great job. It has changed the whole game of payroll management by equipping us to manage and process payroll in just a few clicks.",
      name: "Mr. Rajeev Kumar Jha",
      role: "Parveen",
    },
    {
      id: "t2",
      quote:
        "As a user, I can say the system is very simple, fast and glitch-free. HR MetricS has helped us to automate every routine human resources operation.",
      name: "Ms. Esha Aggarwal",
      role: "DVP, Human Resources",
    },
    {
      id: "t3",
      quote:
        "We wanted to not be person dependent but process dependent. HR MetricS came in at the right time for us. Our engagement increased from 25 to 125%.",
      name: "Mr. Naresh Khagupati",
      role: "HR Manager",
    },
  ],

  news: [
    {
      id: "n1",
      title: "Earth Hour",
      excerpt: "We deal in so many social activities. Earth Hour is one of our key initiatives.",
      image: "/src/assets/images/news/news-1.jpg",
      date: "Mar 25, 2024",
    },
    {
      id: "n2",
      title: "Cricket Tournament",
      excerpt: "2nd Year Cricket Tournament Conducted by Alia Investment in our campus.",
      image: "/src/assets/images/news/news-2.jpg",
      date: "Feb 12, 2024",
    },
    {
      id: "n3",
      title: "ICT Exhibition",
      excerpt: "The Connect Fair held at the National Art Gallery showcased our latest innovations.",
      image: "/src/assets/images/news/news-3.jpg",
      date: "Jan 15, 2024",
    },
    {
      id: "n4",
      title: "Football Tournament",
      excerpt: "As usual this year we conducted Football tournament for team bonding.",
      image: "/src/assets/images/news/news-4.jpg",
      date: "Dec 05, 2023",
    },
  ],

  clients: [
    { id: "c1", name: "AAA Hotels & Resorts", image: "/src/assets/images/clients/c1.png" },
    { id: "c2", name: "Alia", image: "/src/assets/images/clients/c2.png" },
    { id: "c3", name: "Baglioni Resorts", image: "/src/assets/images/clients/c3.jpg" },
    { id: "c4", name: "City Garden", image: "/src/assets/images/clients/c4.png" },
    { id: "c5", name: "City Investments", image: "/src/assets/images/clients/c5.jpg" },
    { id: "c6", name: "Cocoon", image: "/src/assets/images/clients/c6.png" },
    { id: "c7", name: "Co Load", image: "/src/assets/images/clients/c7.png" },
    { id: "c8", name: "Colors Of OBLU", image: "/src/assets/images/clients/c8.png" },
    { id: "c9", name: "ECM", image: "/src/assets/images/clients/c9.png" },
    { id: "c10", name: "Flyme", image: "/src/assets/images/clients/c10.png" },
    { id: "c11", name: "FSM", image: "/src/assets/images/clients/c11.png" },
    { id: "c12", name: "Fun Island", image: "/src/assets/images/clients/c12.png" },
    { id: "c13", name: "Fushifaru", image: "/src/assets/images/clients/c13.png" },
    { id: "c14", name: "Gage Fire Safety", image: "/src/assets/images/clients/c14.png" },
    { id: "c15", name: "Happy Market", image: "/src/assets/images/clients/c15.png" },
    { id: "c16", name: "HDFC", image: "/src/assets/images/clients/c16.jpg" },
    { id: "c17", name: "Holiday Island", image: "/src/assets/images/clients/c17.png" },
    { id: "c18", name: "Horizon Fisheries", image: "/src/assets/images/clients/c18.png" },
    { id: "c19", name: "IBC", image: "/src/assets/images/clients/c19.png" },
    { id: "c20", name: "Mifco", image: "/src/assets/images/clients/c20.png" },
    { id: "c21", name: "Medianet", image: "/src/assets/images/clients/c21.jpg" },
    { id: "c22", name: "OBLU", image: "/src/assets/images/clients/c22.jpg" },
    { id: "c23", name: "Ozen", image: "/src/assets/images/clients/c23.png" },
    { id: "c24", name: "Royal Island", image: "/src/assets/images/clients/c24.png" },
    { id: "c25", name: "Sun Island", image: "/src/assets/images/clients/c25.png" },
    { id: "c26", name: "TEP Construction", image: "/src/assets/images/clients/c26.png" },
    { id: "c27", name: "The Hawks", image: "/src/assets/images/clients/c27.png" },
    { id: "c28", name: "Villa", image: "/src/assets/images/clients/c28.png" },
    { id: "c29", name: "Voyages Maldives", image: "/src/assets/images/clients/c29.png" },
    { id: "c30", name: "You & Me", image: "/src/assets/images/clients/c30.jpg" },
  ],
  whyItems: [
    {
      id: 'w1',
      title: 'Strict NDA & Privacy Policy',
      description: 'We incorporate NDA & privacy policy before accepting a project. It is a gentle and confidential agreement we follow with all our clients.',
      image: '/src/assets/images/why/why-1.jpg',
    },
    {
      id: 'w2',
      title: 'Latest Technology',
      description: 'We are adaptive to leading-edge technologies. Our products are built on MEAN stack, MERN stack, Swift, and GraphQL.',
      image: '/src/assets/images/why/why-2.jpg',
    },
    {
      id: 'w3',
      title: 'Team of Experts',
      description: 'We have a team of experts in emerging technologies. So far they have handled and developed the most successful projects.',
      image: '/src/assets/images/why/why-3.jpg',
    },
    {
      id: 'w4',
      title: 'Round-clock Support',
      description: 'Our technical manager will be eager to assist you whenever you need them. Connect with us at any time.',
      image: '/src/assets/images/why/why-4.jpg',
    },
    {
      id: 'w5',
      title: 'Timely Delivery',
      description: 'Timely Delivery is our mantra. Once we commit to a project, we hand it over to clients within the mentioned time span.',
      image: '/src/assets/images/why/why-5.jpg',
    },
  ],
  positions: [
    {
      id: "p1",
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Male', Maldives",
      type: "Full-time",
      description: "We are looking for an experienced Full Stack Developer to lead our core product development team.",
    },
    {
      id: "p2",
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Join our creative team to design beautiful and intuitive interfaces for our global clients.",
    },
  ],
  technologies: [
    { id: "tech1", name: "Software Development", image: "/src/assets/images/technologies/tech1.png" },
    { id: "tech2", name: "Mobile App Development", image: "/src/assets/images/technologies/tech2.png" },
    { id: "tech3", name: "Web Development", image: "/src/assets/images/technologies/tech3.png" },
    { id: "tech4", name: "IT Consulting", image: "/src/assets/images/technologies/tech4.png" },
    { id: "tech5", name: "UI/UX Design", image: "/src/assets/images/technologies/tech1.png" },
    { id: "tech6", name: "ERP Solutions", image: "/src/assets/images/technologies/tech6.png" },
    { id: "tech7", name: "HR & Payroll", image: "/src/assets/images/technologies/tech7.png" },
    { id: "tech8", name: "AI & Chatbots", image: "/src/assets/images/technologies/tech1.png" },
  ],
};
