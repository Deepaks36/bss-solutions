import { Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

interface Props {
  dark: boolean;
}

const services = [
  'Custom Solutions',
  'Web Development',
  'Mobile Apps',
  'Tech Consulting',
  'ERP Implementations',
  'HR & Payroll',
  'Digital Marketing',
];

export function Footer({ dark }: Props) {
  const linkCls = `group flex items-center gap-2 text-sm transition-all duration-300 ${dark ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-white'}`;

  return (
    <footer
      className={`relative pt-24 pb-12 overflow-hidden border-t ${
        dark ? 'bg-[#0A0F1C] border-white/5' : 'bg-slate-950 border-slate-900'
      }`}
    >
      {/* Background glowing effects */}
      <div className="absolute top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
        <div className="w-[1000px] h-[300px] bg-gradient-to-b from-blue-600/20 to-transparent blur-3xl rounded-full -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-4">
            <a href="#home" className="inline-block mb-6 group">
              <div className="flex items-center gap-3">
                <img
                  src="https://bsyssolutions.com/wp-content/uploads/2022/11/BSS-Logo.jpg"
                  alt="BSS Logo"
                  className="h-10 w-auto rounded-lg shadow-xl shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://bsyssolutions.com/wp-content/uploads/2022/11/BSS-Logo.jpg';
                  }}
                />
                <span className="text-xl font-black tracking-tight text-white">
                  Brilliant Systems
                </span>
              </div>
            </a>
            <p className={`text-sm leading-relaxed mb-8 max-w-sm ${dark ? 'text-gray-400' : 'text-slate-400'}`}>
              We transform ambitious ideas into thriving digital products. With 25+ years of combined expertise, we deliver enterprise-grade IT solutions tailored to scale globally.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: 'https://www.facebook.com/brilliantsystemssolutions/' },
                { Icon: Twitter, href: 'https://twitter.com/bsspl_india' },
                { Icon: Linkedin, href: 'https://www.linkedin.com/company/brilliant-systems-solutions/' },
                { Icon: Instagram, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-1 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer for large screens */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Company */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent inline-block">Company</h4>
              <ul className="space-y-4">
                {['Who We Are', 'Success Stories', 'BSS Events', 'Career', 'Contact Us'].map((item) => (
                  <li key={item}>
                    <a href="#" className={linkCls}>
                      <ChevronRight className="w-3 h-3 text-blue-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent inline-block">Expertise</h4>
              <ul className="space-y-4">
                {services.slice(0, 6).map((s) => (
                  <li key={s}>
                    <a href="#" className={linkCls}>
                      <ChevronRight className="w-3 h-3 text-emerald-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent inline-block">Reach Out</h4>
              <ul className="space-y-4">
                <li className="flex gap-3 group items-start">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20 group-hover:bg-rose-500 group-hover:border-rose-500 transition-colors">
                    <MapPin className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className={`text-sm leading-relaxed pt-1 ${dark ? 'text-gray-400' : 'text-slate-400'}`}>90/2 Arun Nagar, Ponmeni, Madurai, India.</span>
                </li>
                <li className="flex gap-3 group items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors">
                    <Phone className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <a href="tel:+914522387388" className={`text-sm hover:text-white transition-colors ${dark ? 'text-gray-400' : 'text-slate-400'}`}>+91-452 238 7388</a>
                </li>
                <li className="flex gap-3 group items-center">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500 group-hover:border-amber-500 transition-colors">
                    <Mail className="w-4 h-4 text-amber-400 group-hover:text-white transition-colors" />
                  </div>
                  <a href="mailto:info@bsyssolutions.com" className={`text-sm hover:text-white transition-colors ${dark ? 'text-gray-400' : 'text-slate-400'}`}>info@bsyssolutions.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${dark ? 'border-white/10' : 'border-white/10'}`}>
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Brilliant System Solutions Pvt Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className={`text-sm font-medium transition-colors ${dark ? 'text-gray-500 hover:text-white' : 'text-slate-500 hover:text-white'}`}>Cookies Policy</a>
            <a href="#" className={`text-sm font-medium transition-colors ${dark ? 'text-gray-500 hover:text-white' : 'text-slate-500 hover:text-white'}`}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
