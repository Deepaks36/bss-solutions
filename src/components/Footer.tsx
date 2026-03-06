import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, Phone } from 'lucide-react';

interface Props {
  dark: boolean;
}

const services = [
  'Custom Solutions Development',
  'Web Development Services',
  'Mobile App Development',
  'Tech Consulting Services',
  'ERP Systems Implementations',
  'HR & Payroll Consulting',
  'Digital Marketing Services',
  'Graphic Designing Services',
];

export function Footer({ dark }: Props) {
  const linkCls = `text-sm transition-colors duration-200 ${dark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'}`;

  return (
    <footer
      className={`pt-16 pb-8 border-t ${
        dark ? 'bg-gray-950 border-gray-800' : 'bg-gray-900 border-gray-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img
              src="https://bsyssolutions.com/wp-content/uploads/2022/10/footer-logo.png.png"
              alt="BSS Footer Logo"
              className="h-12 w-auto mb-4"
              onError={(e) => {
                e.currentTarget.src = 'https://bsyssolutions.com/wp-content/uploads/2022/11/BSS-Logo.jpg';
              }}
            />
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Brilliant Systems Solutions will build your profitable business to turn your dreams true with our team of 50+ professional developers and creative designers.
            </p>
            <div className="flex gap-3">
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
                  className="w-9 h-9 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {['Who We Are', 'BSS Events', 'BSS Career', 'Our Clients', 'Testimonials'].map((item) => (
                <li key={item}><a href="#" className={linkCls}>{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Our Services</h4>
            <ul className="space-y-3">
              {services.slice(0, 5).map((s) => (
                <li key={s}><a href="#" className={linkCls}>{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">90/2 Arun Nagar, Ponmeni, Madurai, India.</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+914522387388" className={linkCls}>+91-452 238 7388</a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@bsyssolutions.com" className={linkCls}>info@bsyssolutions.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <p className="text-sm text-gray-500">
            &copy; 2026 Brilliant System Solutions Pvt Ltd. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className={linkCls}>Cookies Policy</a>
            <a href="#" className={linkCls}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
