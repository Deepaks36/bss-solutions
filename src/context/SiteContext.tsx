import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { SiteContent } from '../types';

interface SiteContextType {
    content: SiteContent;
    updateContent: (key: keyof SiteContent, value: any) => void;
    updateSectionItem: (section: keyof SiteContent, id: string, field: string, value: any) => void;
    updateSectionItemAtomic: (section: keyof SiteContent, id: string, updates: Record<string, any>) => void;
    addItemToSection: (section: keyof SiteContent, item: any) => void;
    deleteItemFromSection: (section: keyof SiteContent, id: string) => void;
    isAdmin: boolean;
    setIsAdmin: (val: boolean) => void;
    editMode: boolean;
    setEditMode: (val: boolean) => void;
    activeEditingSection: string | null;
    setActiveEditingSection: (id: string | null) => void;
    resetContent: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const API_URL = '/api/content';

// Empty shape; real content is loaded from the database via `/api/content`.
const defaultContent: SiteContent = {
  heroTitle: '',
  heroSubtitle: '',
  heroCta: '',
  heroStat: '',
  heroCenterBadgeLabel: '',
  heroImage: '',
  heroTopLeftImage: '',
  heroTopLeftBadgeTop: '',
  heroTopLeftBadgeBottom: '',
  heroBottomRightImage: '',
  heroBottomRightBadgeTop: '',
  heroBottomRightBadgeBottom: '',
  heroHighlights: [],
  heroStats: [],
  heroProofItems: [],
  aboutTitle: '',
  aboutBody: '',
  aboutImage: '',
  servicesTagline: '',
  servicesTitle: '',
  servicesSubtitle: '',
  workflowTagline: '',
  workflowTitle: '',
  whyTitle: '',
  testimonialsTagline: '',
  testimonialsTitle: '',
  ctaBannerText: '',
  newsTitle: '',
  newsTagline: '',
  contactTitle: '',
  contactTagline: '',
  contactAddress: '',
  contactEmail: '',
  contactPhone: '',
  careersTagline: '',
  careersTitle: '',
  careersSubtitle: '',
  services: [],
  products: [
    {
      id: 'prod-1',
      title: 'Enterprise Core ERP',
      description: 'A comprehensive ERP solution designed to streamline core business processes from finance to supply chain.',
      accent: 'from-blue-600 to-indigo-600',
      type: 'ERP System',
      icon: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=100',
      image: '/assets/products/erp_preview.jpg',
      detailsImage: '/assets/products/erp_details.jpg',
      bullets: ['Real-time Analytics', 'Multi-currency Support', 'Automated Workflows']
    },
    {
      id: 'prod-2',
      title: 'Cloud Payroll Pro',
      description: 'The ultimate payroll management system for modern enterprises, ensuring compliance and precision.',
      accent: 'from-cyan-500 to-blue-500',
      type: 'HR Tech',
      icon: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=100',
      image: '/assets/products/payroll_preview.jpg',
      detailsImage: '/assets/products/payroll_details.jpg',
      bullets: ['Tax Automation', 'Self-service Portal', 'Direct Batch Transfers']
    },
    {
      id: 'prod-3',
      title: 'ReserveEase Booking',
      description: 'Seamless appointment and resource booking platform that scales with your growth.',
      accent: 'from-purple-600 to-pink-500',
      type: 'Booking Solution',
      icon: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=100',
      image: '/assets/products/booking_preview.jpg',
      detailsImage: '/assets/products/booking_details.jpg',
      bullets: ['Calendar Sync', 'Payment Integration', 'Automated Reminders']
    },
    {
      id: 'prod-4',
      title: 'GrandStay Hotel Suite',
      description: 'A dedicated property management system for the hospitality industry, from small boutiques to large resorts.',
      accent: 'from-amber-500 to-orange-600',
      type: 'Hospitality',
      icon: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=100',
      image: '/assets/products/hotel_preview.jpg',
      detailsImage: '/assets/products/hotel_details.jpg',
      bullets: ['Channel Management', 'Front Desk Dashboard', 'Guest Experience Portal']
    }
  ],
  workflow: [],
  testimonials: [],
  news: [],
  clients: [],
  whyItems: [],
  positions: [],
  technologies: [],
  companies: [],
  timelineItems: [
    { id: 'tm-1', year: '2020', clients: 12, growth: 'Foundation', description: 'BSS-Solutions was founded with a vision to provide cutting-edge ERP systems for local businesses.' },
    { id: 'tm-2', year: '2022', clients: 50, growth: 'Regional Leader', description: 'Successfully expanded operations to the UAE and achieved a 50+ client milestone with our cloud payroll module.' },
    { id: 'tm-3', year: '2024', clients: 150, growth: 'AI Innovation', description: 'Launched our AI-driven analytics suite and established a global presence with partners in 10+ countries.' }
  ],
  leaders: [
    {
      id: 'leader-1',
      name: 'John Brilliant',
      role: 'Founder & CEO',
      bio: 'Visionary leader with 15+ years of experience in ERP automation and digital transformation.',
      image: '/src/assets/ceo.jpg',
      timeline: [
        { id: 'ceo-1', title: 'The Vision (2018)', body: 'Founded BSS-Solutions with a team of 4, driven by the goal of automating regional enterprises using custom-built ERP frameworks.' },
        { id: 'ceo-2', title: 'The Acceleration (2020)', body: 'Spearheaded our first major cloud payroll implementation, successfully serving 100+ clients across the Middle East.' },
        { id: 'ceo-3', title: 'The Innovation (2022)', body: 'Won the Digital Strategy Excellence Award for our AI-driven workforce management analytics platform.' },
        { id: 'ceo-4', title: 'The Global Horizon (2024)', body: 'Initiated our global expansion strategy, establishing key partnerships in APAC and Europe to scale our tech stack.' }
      ]
    },
    {
      id: 'leader-2',
      name: 'Sarah Chen',
      role: 'Co-Founder & CTO',
      bio: 'Tech architect specializing in scalable cloud infrastructures and enterprise-grade security.',
      image: '/src/assets/cto.jpg',
      timeline: [
        { id: 'cto-1', title: 'Core Architecture (2018)', body: 'Designed the underlying microservices architecture that powers BSS-Solutions platform.' },
        { id: 'cto-2', title: 'Security First (2021)', body: 'Achieved ISO 27001 certification for our cloud ecosystem.' }
      ]
    }
  ],
  teamCelebrations: [
    { id: 'celeb-1', year: 2021, title: 'Inception Anniversary', description: 'Celebrating our first full year of operations with a team retreat and the launch of our initial ERP product.', images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200'], order_index: 0 },
    { id: 'celeb-2', year: 2022, title: 'Regional Expansion', description: 'Marking our successful entry into the UAE market with a new regional headquarters and 50+ new team members.', images: ['https://images.unsplash.com/photo-1540317580114-ed684c15ff73?auto=format&fit=crop&q=80&w=1200'], order_index: 0 },
    { id: 'celeb-3', year: 2023, title: 'Excellence Awards', description: 'An evening celebrating the hard work and dedication of our team with the first annual BSS Excellence Awards.', images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200'], order_index: 0 },
    { id: 'celeb-4', year: 2024, title: 'Tech Innovation Summit', description: 'Gathering world-class engineers to discuss the future of AI and the global scaling of our tech stack.', images: ['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200'], order_index: 0 }
  ],
  teamMembers: []
};

export function SiteProvider({ children }: { children: React.ReactNode }) {
    const [content, setContent] = useState<SiteContent>(defaultContent);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [activeEditingSection, setActiveEditingSection] = useState<string | null>(null);

    // Clear active section if edit mode is toggled off
    useEffect(() => {
        if (!editMode) {
            setActiveEditingSection(null);
        }
    }, [editMode]);

    // Load from database on mount
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(API_URL);
                if (res.ok) {
                    const data = await res.json();
                    // Smart merge: Only override defaults if API response is not empty for arrays
                    const mergedData = { ...defaultContent };
                    Object.keys(data).forEach(key => {
                        const val = data[key as keyof SiteContent];
                        if (Array.isArray(val)) {
                            if (val.length > 0) {
                                (mergedData as any)[key] = val;
                            }
                        } else if (val !== undefined && val !== null && val !== '') {
                            (mergedData as any)[key] = val;
                        }
                    });

                    setContent(mergedData);
                } else {
                    setContent(defaultContent);
                }
            } catch (e) {
                setContent(defaultContent);
            }
        };
        fetchContent();
    }, []);

    const updateContent = useCallback(async (key: keyof SiteContent, value: any) => {
        setContent((prev) => ({ ...prev, [key]: value }));

        try {
            await fetch(`${API_URL}/settings`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            });
        } catch (e) {
            // Error handled silently
        }
    }, []);

    const updateSectionItem = useCallback(async (section: keyof SiteContent, id: string, field: string, value: any) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;

            const updatedSection = sectionData.map((item: any) =>
                item.id === id ? { ...item, [field]: value } : item
            );
            return { ...prev, [section]: updatedSection };
        });

        try {
            await fetch(`${API_URL}/sections/${section}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, [field]: value }),
            });
        } catch (e) {
            // Error handled silently or via global toast in real apps
        }
    }, []);

    const updateSectionItemAtomic = useCallback(async (section: keyof SiteContent, id: string, updates: Record<string, any>) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;

            const updatedSection = sectionData.map((item: any) =>
                item.id === id ? { ...item, ...updates } : item
            );
            return { ...prev, [section]: updatedSection };
        });

        try {
            await fetch(`${API_URL}/sections/${section}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            });
        } catch (e) {
            // Error handled silently
        }
    }, []);

    const addItemToSection = useCallback(async (section: keyof SiteContent, item: any) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;
            return { ...prev, [section]: [...sectionData, item] };
        });

        try {
            await fetch(`${API_URL}/sections/${section}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            });
        } catch (e) {
            // Error handled silently
        }
    }, []);

    const deleteItemFromSection = useCallback(async (section: keyof SiteContent, id: string) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;
            return { ...prev, [section]: sectionData.filter((item: any) => item.id !== id) };
        });

        try {
            await fetch(`${API_URL}/sections/${section}?id=${id}`, {
                method: 'DELETE'
            });
        } catch (e) {
            // Error handled silently
        }
    }, []);

    const resetContent = useCallback(() => {
        setContent(defaultContent);
    }, []);

    const value = useMemo(() => ({
        content,
        updateContent,
        updateSectionItem,
        updateSectionItemAtomic,
        addItemToSection,
        deleteItemFromSection,
        isAdmin,
        setIsAdmin,
        editMode,
        setEditMode,
        activeEditingSection,
        setActiveEditingSection,
        resetContent,
    }), [
        content,
        updateContent,
        updateSectionItem,
        updateSectionItemAtomic,
        addItemToSection,
        deleteItemFromSection,
        isAdmin,
        editMode,
        activeEditingSection,
        resetContent,
    ]);

    return (
        <SiteContext.Provider value={value}>
            {children}
        </SiteContext.Provider>
    );
}

export function useSite() {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSite must be used within a SiteProvider');
    }
    return context;
}
