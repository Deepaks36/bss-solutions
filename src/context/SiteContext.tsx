import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SiteContent } from '../types';
import { defaultContent } from '../data/siteData';

interface SiteContextType {
    content: SiteContent;
    updateContent: (key: keyof SiteContent, value: any) => void;
    updateSectionItem: (section: keyof SiteContent, id: string, field: string, value: any) => void;
    addItemToSection: (section: keyof SiteContent, item: any) => void;
    deleteItemFromSection: (section: keyof SiteContent, id: string) => void;
    isAdmin: boolean;
    setIsAdmin: (val: boolean) => void;
    editMode: boolean;
    setEditMode: (val: boolean) => void;
    resetContent: () => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/api/content';

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
                    setContent(data);
                } else if (res.status === 404) {
                    // Seed initial data if DB is empty
                    await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(defaultContent),
                    });
                }
            } catch (e) {
                console.error('Failed to fetch content', e);
            }
        };
        fetchContent();
    }, []);

    const saveContent = async (newContent: SiteContent) => {
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContent),
            });
        } catch (e) {
            console.error('Failed to save content', e);
        }
    };

    const updateContent = useCallback((key: keyof SiteContent, value: any) => {
        setContent((prev) => {
            const updated = { ...prev, [key]: value };
            saveContent(updated);
            return updated;
        });
    }, []);

    const updateSectionItem = useCallback((section: keyof SiteContent, id: string, field: string, value: any) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;

            const updatedSection = sectionData.map((item: any) =>
                item.id === id ? { ...item, [field]: value } : item
            );
            const updated = { ...prev, [section]: updatedSection };
            saveContent(updated);
            return updated;
        });
    }, []);

    const addItemToSection = useCallback((section: keyof SiteContent, item: any) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;

            const updated = { ...prev, [section]: [...sectionData, item] };
            saveContent(updated);
            return updated;
        });
    }, []);

    const deleteItemFromSection = useCallback((section: keyof SiteContent, id: string) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;

            const updated = { ...prev, [section]: sectionData.filter((item: any) => item.id !== id) };
            saveContent(updated);
            return updated;
        });
    }, []);

    const resetContent = useCallback(() => {
        setContent(defaultContent);
        saveContent(defaultContent);
    }, []);

    return (
        <SiteContext.Provider
            value={{
                content,
                updateContent,
                updateSectionItem,
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
