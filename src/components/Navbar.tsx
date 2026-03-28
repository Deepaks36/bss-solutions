import { useState, useEffect } from 'react';
import { Sun, Moon, LogOut, Edit3, Eye, Shield, Bell } from 'lucide-react';

interface Props {
  activeSection: string;
  dark: boolean;
  onToggleDark: () => void;
  isAdmin: boolean;
  editMode: boolean;
  onToggleEdit: () => void;
  onShowMessages: () => void;
  onShowLogin: () => void;
  onLogout: () => void;
}

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'about', label: 'About' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'why', label: 'Why Us' },
  { id: 'companies', label: 'Clients' },
  { id: 'news', label: 'Newsroom' },
  { id: 'contact', label: 'Reach Out' },
];

export function Navbar({ activeSection, dark, onToggleDark, isAdmin, editMode, onToggleEdit, onShowMessages, onShowLogin, onLogout }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const bg = scrolled
    ? dark
      ? 'bg-gray-950/95 shadow-xl shadow-black/30 backdrop-blur-md'
      : 'bg-white/95 shadow-xl shadow-gray-200/80 backdrop-blur-md'
    : dark
      ? 'bg-transparent'
      : 'bg-white/80 backdrop-blur-sm';

  const linkBase = 'text-sm font-medium transition-all duration-200 px-1 py-0.5 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300';
  const linkActive = 'text-blue-600 after:w-full';
  const linkInactive = dark
    ? 'text-gray-300 hover:text-white after:w-0 hover:after:w-full'
    : 'text-gray-600 hover:text-gray-900 after:w-0 hover:after:w-full';

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${bg}`}>
      <div className="max-w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); }} className="flex items-center gap-2">
            <img
              src="https://bsyssolutions.com/wp-content/uploads/2022/11/BSS-Logo.jpg"
              alt="BSS Logo"
              className="h-12 w-auto rounded"
            />
            <span className="text-xl font-bold">BSS Solutions</span>
          </a>

          {/* Nav & Actions Grouped End */}
          <div className="flex items-center gap-8">
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`${linkBase} ${activeSection === link.id ? linkActive : linkInactive}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={onToggleDark}
                className={`p-2 rounded-xl transition-all duration-200 ${dark
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                aria-label="Toggle theme"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Admin controls */}
              {isAdmin ? (
                <>
                  <button
                    onClick={onShowMessages}
                    className={`p-2 rounded-xl transition-all duration-200 ${dark
                      ? 'bg-blue-900/40 text-blue-400 hover:bg-blue-900/60'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    aria-label="View Messages"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onToggleEdit}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${editMode
                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                      }`}
                  >
                    {editMode ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                    {editMode ? 'Preview' : 'Edit Mode'}
                  </button>
                  <button
                    onClick={onLogout}
                    className={`p-2 rounded-xl transition-all duration-200 ${dark
                      ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60'
                      : 'bg-red-50 text-red-500 hover:bg-red-100'
                      }`}
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onShowLogin}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${dark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Login
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all ${dark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
              >
                <div className="w-4 h-3.5 flex flex-col justify-between">
                  <span className={`block h-0.5 rounded transition-all ${dark ? 'bg-white' : 'bg-gray-700'} ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block h-0.5 rounded transition-all ${dark ? 'bg-white' : 'bg-gray-700'} ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 rounded transition-all ${dark ? 'bg-white' : 'bg-gray-700'} ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className={`lg:hidden py-4 border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === link.id
                    ? 'bg-blue-600 text-white'
                    : dark
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Edit mode banner */}
      {isAdmin && editMode && (
        <div className="bg-amber-500 text-white text-center text-xs py-1.5 font-semibold tracking-wide">
          EDIT MODE ACTIVE — Click any pencil icon to edit content inline
        </div>
      )}
    </header>
  );
}
