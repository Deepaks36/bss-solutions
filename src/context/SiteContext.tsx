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

const STORAGE_KEY = 'bss-site-content-v1.1';

export function SiteProvider({ children }: { children: React.ReactNode }) {
    const [content, setContent] = useState<SiteContent>(defaultContent);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Basic deep merge or just overwrite if structure matches
                setContent(parsed);
            } catch (e) {
                console.error('Failed to parse stored content', e);
            }
        }
    }, []);

    const updateContent = useCallback((key: keyof SiteContent, value: any) => {
        setContent((prev) => {
            const updated = { ...prev, [key]: value };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const addItemToSection = useCallback((section: keyof SiteContent, item: any) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;

            const updated = { ...prev, [section]: [...sectionData, item] };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const deleteItemFromSection = useCallback((section: keyof SiteContent, id: string) => {
        setContent((prev) => {
            const sectionData = prev[section];
            if (!Array.isArray(sectionData)) return prev;

            const updated = { ...prev, [section]: sectionData.filter((item: any) => item.id !== id) };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const resetContent = useCallback(() => {
        setContent(defaultContent);
        localStorage.removeItem(STORAGE_KEY);
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
