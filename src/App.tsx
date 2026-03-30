import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Products } from './components/Products';
import { About } from './components/About';
import { Services } from './components/Services';
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
import { AdminToolbar } from './components/AdminToolbar';
import { MessagesModal } from './components/MessagesModal';
import { AdminMessagesPage } from './components/AdminMessagesPage';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useSite } from './context/SiteContext';
import { CheckCircle } from 'lucide-react';

const SECTION_IDS = ['home', 'products', 'about', 'services', 'workflow', 'why', 'companies', 'news', 'careers', 'contact'];

export default function App() {
  const [dark, setDark] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [adminView, setAdminView] = useState<'main' | 'reach-out'>('main');
  const [showLoginToast, setShowLoginToast] = useState<string | null>(null);
  const {
    content,
    isAdmin,
    setIsAdmin,
    editMode,
    setEditMode,
    updateContent,
    updateSectionItem,
    updateSectionItemAtomic,
    addItemToSection,
    deleteItemFromSection
  } = useSite();

  const activeSection = useScrollSpy(SECTION_IDS);

  const handleLogin = async () => {
    setIsAdmin(true);
    setShowLogin(false);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        const unverified = data.filter((m: any) => !m.verified).length;
        if (unverified > 0) {
          setShowLoginToast(`You have ${unverified} new message${unverified > 1 ? 's' : ''}`);
        } else {
          setShowLoginToast('Admin logged in successfully!');
        }
      } else {
        setShowLoginToast('Admin logged in successfully!');
      }
    } catch {
      setShowLoginToast('Admin logged in successfully!');
    }
    setTimeout(() => setShowLoginToast(null), 3000);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setEditMode(false);
    setAdminView('main');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar
        activeSection={activeSection}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        isAdmin={isAdmin}
        editMode={editMode}
        onToggleEdit={() => setEditMode(!editMode)}
        onShowMessages={() => setShowMessages(true)}
        onShowLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        adminView={adminView}
        onSetAdminView={setAdminView}
      />

      <main>
        {isAdmin && adminView === 'reach-out' ? (
          <AdminMessagesPage dark={dark} />
        ) : (
          <>
            <Hero
              content={content}
              dark={dark}
              onUpdate={updateContent}
            />
            <Products
              content={content}
              dark={dark}
              onUpdateServiceAtomic={(id, updates) => updateSectionItemAtomic('products', id, updates)}
              onAddService={(service) => addItemToSection('products', service)}
              onDeleteService={(id) => deleteItemFromSection('products', id)}
            />
            <About
              content={content}
              dark={dark}
              onUpdate={updateContent}
              onUpdateTechnologyAtomic={(id, updates) => updateSectionItemAtomic('technologies', id, updates)}
              onAddTechnology={(tech) => addItemToSection('technologies', tech)}
              onDeleteTechnology={(id) => deleteItemFromSection('technologies', id)}
            />
            <Services
               content={content}
               dark={dark}
               onUpdateServiceAtomic={(id, updates) => updateSectionItemAtomic('services', id, updates)}
               onAddService={(service) => addItemToSection('services', service)}
               onDeleteService={(id) => deleteItemFromSection('services', id)}
            />
            <Workflow
              content={content}
              dark={dark}
              onUpdate={updateContent}
              onUpdateWorkflowStepAtomic={(id, updates) => updateSectionItemAtomic('workflow', id, updates)}
              onAddWorkflowStep={(step) => addItemToSection('workflow', step)}
              onDeleteWorkflowStep={(id) => deleteItemFromSection('workflow', id)}
            />
            <WhyChooseUs
              content={content}
              dark={dark}
              onUpdate={updateContent}
              onUpdateWhyItemAtomic={(id, updates) => updateSectionItemAtomic('whyItems', id, updates)}
              onAddWhyItem={(item) => addItemToSection('whyItems', item)}
              onDeleteWhyItem={(id) => deleteItemFromSection('whyItems', id)}
            />
            <Testimonials
              content={content}
              dark={dark}
              onUpdate={updateContent}
              onUpdateTestimonial={(id, field, value) => updateSectionItem('testimonials', id, field, value)}
              onAddTestimonial={(testimonial) => addItemToSection('testimonials', testimonial)}
              onDeleteTestimonial={(id) => deleteItemFromSection('testimonials', id)}
            />
            <Clients
              content={content}
              dark={dark}
              onUpdate={updateContent}
              onUpdateClientAtomic={(id, updates) => updateSectionItemAtomic('clients', id, updates)}
              onAddClient={(client) => addItemToSection('clients', client)}
              onDeleteClient={(id) => deleteItemFromSection('clients', id)}
            />
            <NewsRoom
              content={content}
              dark={dark}
              onUpdate={updateContent}
              onUpdateNewsItemAtomic={(id, updates) => updateSectionItemAtomic('news', id, updates)}
              onAddNewsItem={(item) => addItemToSection('news', item)}
              onDeleteNewsItem={(id) => deleteItemFromSection('news', id)}
            />
            <Careers
              content={content}
              dark={dark}
              onUpdate={updateContent}
              onUpdatePositionAtomic={(id, updates) => updateSectionItemAtomic('positions', id, updates)}
              onAddPosition={(position) => addItemToSection('positions', position)}
              onDeletePosition={(id) => deleteItemFromSection('positions', id)}
            />
            <CtaBanner
              content={content}
              dark={dark}
              onUpdate={updateContent}
            />
            <Contact
              content={content}
              dark={dark}
              onUpdate={updateContent} />
          </>
        )}
      </main>

      <Footer dark={dark} />
      <AdminToolbar />

      {showLogin && (
        <AdminLogin
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
          dark={dark}
        />
      )}

      {showMessages && (
        <MessagesModal
          dark={dark}
          onClose={() => setShowMessages(false)}
        />
      )}

      {showLoginToast && (
        <div className="fixed top-24 right-4 z-[200] bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 animate-[slideIn_0.3s_ease-out]">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
          {showLoginToast}
        </div>
      )}
    </div>
  );
}
