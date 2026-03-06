import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { Workflow } from './components/Workflow';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Clients } from './components/Clients';
import { Testimonials } from './components/Testimonials';
import { NewsRoom } from './components/NewsRoom';
import { Careers } from './components/Careers';
import { CtaBanner } from './components/CtaBanner';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import { useScrollSpy } from './hooks/useScrollSpy';
import { defaultContent } from './data/siteData';
import { SiteContent, Client, Service, WorkflowStep, WhyItem, Testimonial, NewsItem, JobPosition, Technology } from './types';

const SECTION_IDS = ['home', 'services', 'about', 'workflow', 'why', 'clients', 'news', 'careers', 'contact'];

export default function App() {
  const [dark, setDark] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);

  const activeSection = useScrollSpy(SECTION_IDS);

  const handleUpdate = useCallback((key: keyof SiteContent, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleUpdateService = useCallback((id: string, field: keyof Service, value: string) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  }, []);

  const handleAddService = useCallback((service: Service) => {
    setContent((prev) => ({ ...prev, services: [...prev.services, service] }));
  }, []);

  const handleDeleteService = useCallback((id: string) => {
    setContent((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) }));
  }, []);

  const handleUpdateWorkflowStep = useCallback((id: string, field: keyof WorkflowStep, value: string) => {
    setContent((prev) => ({
      ...prev,
      workflow: prev.workflow.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
    }));
  }, []);

  const handleAddWorkflowStep = useCallback((step: WorkflowStep) => {
    setContent((prev) => ({ ...prev, workflow: [...prev.workflow, step] }));
  }, []);

  const handleDeleteWorkflowStep = useCallback((id: string) => {
    setContent((prev) => ({ ...prev, workflow: prev.workflow.filter((w) => w.id !== id) }));
  }, []);

  const handleUpdateWhyItem = useCallback((id: string, field: keyof WhyItem, value: string) => {
    setContent((prev) => ({
      ...prev,
      whyItems: prev.whyItems.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
    }));
  }, []);

  const handleAddWhyItem = useCallback((item: WhyItem) => {
    setContent((prev) => ({ ...prev, whyItems: [...prev.whyItems, item] }));
  }, []);

  const handleDeleteWhyItem = useCallback((id: string) => {
    setContent((prev) => ({ ...prev, whyItems: prev.whyItems.filter((w) => w.id !== id) }));
  }, []);

  const handleUpdateTestimonial = useCallback((id: string, field: keyof Testimonial, value: string) => {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    }));
  }, []);

  const handleUpdateNewsItem = useCallback((id: string, field: keyof NewsItem, value: string) => {
    setContent((prev) => ({
      ...prev,
      news: prev.news.map((n) => (n.id === id ? { ...n, [field]: value } : n)),
    }));
  }, []);

  const handleAddNewsItem = useCallback((item: NewsItem) => {
    setContent((prev) => ({ ...prev, news: [...prev.news, item] }));
  }, []);

  const handleDeleteNewsItem = useCallback((id: string) => {
    setContent((prev) => ({ ...prev, news: prev.news.filter((n) => n.id !== id) }));
  }, []);

  const handleUpdatePosition = useCallback((id: string, field: keyof JobPosition, value: string) => {
    setContent((prev) => ({
      ...prev,
      positions: prev.positions.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  }, []);

  const handleAddPosition = useCallback((position: JobPosition) => {
    setContent((prev) => ({ ...prev, positions: [...prev.positions, position] }));
  }, []);

  const handleDeletePosition = useCallback((id: string) => {
    setContent((prev) => ({ ...prev, positions: prev.positions.filter((p) => p.id !== id) }));
  }, []);

  const handleAddTechnology = useCallback((tech: Technology) => {
    setContent((prev) => ({ ...prev, technologies: [...prev.technologies, tech] }));
  }, []);

  const handleDeleteTechnology = useCallback((id: string) => {
    setContent((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t.id !== id) }));
  }, []);

  const handleUpdateTechnology = useCallback((id: string, field: keyof Technology, value: string) => {
    setContent((prev) => ({
      ...prev,
      technologies: prev.technologies.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    }));
  }, []);

  const handleAddClient = useCallback((client: Client) => {
    setContent((prev) => ({ ...prev, clients: [...prev.clients, client] }));
  }, []);

  const handleUpdateClient = useCallback((id: string, field: keyof Client, value: string) => {
    setContent((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  }, []);

  const handleDeleteClient = useCallback((id: string) => {
    setContent((prev) => ({ ...prev, clients: prev.clients.filter((c) => c.id !== id) }));
  }, []);

  const handleLogin = () => {
    setIsAdmin(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setEditMode(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar
        activeSection={activeSection}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        isAdmin={isAdmin}
        editMode={editMode}
        onToggleEdit={() => setEditMode((e) => !e)}
        onShowLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      <main>
        <Hero
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
        />
        <Services
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
          onUpdateService={handleUpdateService}
          onAddService={handleAddService}
          onDeleteService={handleDeleteService}
        />
        <About
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
          onUpdateTechnology={handleUpdateTechnology}
          onAddTechnology={handleAddTechnology}
          onDeleteTechnology={handleDeleteTechnology}
        />
        <Workflow
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
          onUpdateWorkflowStep={handleUpdateWorkflowStep}
          onAddWorkflowStep={handleAddWorkflowStep}
          onDeleteWorkflowStep={handleDeleteWorkflowStep}
        />
        <WhyChooseUs
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
          onUpdateWhyItem={handleUpdateWhyItem}
          onAddWhyItem={handleAddWhyItem}
          onDeleteWhyItem={handleDeleteWhyItem}
        />
        <Testimonials
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
          onUpdateTestimonial={handleUpdateTestimonial}
        />
        <Clients
          content={content}
          dark={dark}
          editMode={editMode}
          onAddClient={handleAddClient}
          onUpdateClient={handleUpdateClient}
          onDeleteClient={handleDeleteClient}
          onUpdate={handleUpdate}
        />
        <NewsRoom
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
          onUpdateNewsItem={handleUpdateNewsItem}
          onAddNewsItem={handleAddNewsItem}
          onDeleteNewsItem={handleDeleteNewsItem}
        />
        <Careers
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
          onUpdatePosition={handleUpdatePosition}
          onAddPosition={handleAddPosition}
          onDeletePosition={handleDeletePosition}
        />
        <CtaBanner
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
        />
        <Contact
          content={content}
          dark={dark}
          editMode={editMode}
          onUpdate={handleUpdate}
        />
      </main>

      <Footer dark={dark} />

      {showLogin && (
        <AdminLogin
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
          dark={dark}
        />
      )}
    </div>
  );
}
