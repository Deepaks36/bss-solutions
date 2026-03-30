import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
    resetContent: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const API_URL = '/api/content';

const defaultContent: SiteContent = {
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

  services: [],
  workflow: [],
  testimonials: [],
  news: [],
  clients: [],
  whyItems: [],
  positions: [],
  technologies: [],
};

export function SiteProvider({ children }: { children: React.ReactNode }) {
    const [content, setContent] = useState<SiteContent>(defaultContent);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Load from database on mount
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(API_URL);
                if (res.ok) {
                    const data = await res.json();
                    // Merge with defaultContent to ensure any new fields in code are present
                    setContent({ ...defaultContent, ...data });
                } else if (res.status === 404) {
                    // Seed initial data if DB is empty as a fallback
                    // Note: Since we're removing siteData.ts, we use the local defaultContent
                    await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(defaultContent),
                    });
                    setContent(defaultContent);
                }
            } catch (e) {
                console.error('Failed to fetch content from server. Using local defaults.', e);
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
            console.error('Failed to update setting:', e);
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
            await fetch(`${API_URL}/sections/${section}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value }),
            });
        } catch (e) {
            console.error('Failed to update section item:', e);
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
            await fetch(`${API_URL}/sections/${section}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
        } catch (e) {
            console.error('Failed to update section item atomic:', e);
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
            console.error('Failed to add section item:', e);
        }
    }, []);

    const deleteItemFromSection = useCallback(async (section: keyof SiteContent, id: string) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;
            return { ...prev, [section]: sectionData.filter((item: any) => item.id !== id) };
        });

        try {
            await fetch(`${API_URL}/sections/${section}/${id}`, {
                method: 'DELETE'
            });
        } catch (e) {
            console.error('Failed to delete section item:', e);
        }
    }, []);

    const resetContent = useCallback(() => {
        setContent(defaultContent);
    }, []);

    return (
        <SiteContext.Provider
            value={{
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
                resetContent,
            }}
        >
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
