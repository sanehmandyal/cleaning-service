import { useState, createContext, useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, Sparkles, MapPin, Mail, Clock, ShieldCheck } from 'lucide-react';
import { useApi } from '../hooks.js';
import { defaultSettings } from '../data.js';

const SettingsCtx = createContext({});
export const useSettings = () => useContext(SettingsCtx);

const nav = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/why-choose-us', 'Why Us'],
  ['/service-areas', 'Areas'],
  ['/blog', 'Blog'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/admin', 'Admin'],
];
const waLink = (n) => `https://wa.me/${String(n).replace(/\D/g, '')}`;

export default function Layout() {
  const { data: s } = useApi('/public/settings');
  const [open, setOpen] = useState(false);
  // Merge API settings with production-grade defaultSettings so no placeholder or blank state appears
  const st = {
    ...defaultSettings,
    ...(s && s.businessName && !s.businessName.includes('placeholder') ? s : {})
  };
  const track = (name) => window.gtag?.('event', name);
  return (
    <SettingsCtx.Provider value={st}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <img src={st.logo || '/images/logo.svg'} alt={st.businessName || 'SparkleClean Pro'} className="h-9 w-auto" />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-5 lg:gap-6 md:flex">
            {nav.map(([to, l]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `text-sm font-semibold transition-colors hover:text-brand ${isActive ? 'text-brand' : 'text-slate-700'}`}
              >
                {l}
              </NavLink>
            ))}
            <Link to="/book-cleaning" className="btn btn-primary !py-2 !px-4 text-xs whitespace-nowrap">Book a Cleaning</Link>
          </nav>
          <button className="md:hidden rounded-lg p-2 min-h-[44px] min-w-[44px]" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav aria-label="Mobile" className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">
            {nav.map(([to, l]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block py-2.5 text-base font-semibold ${isActive ? 'text-brand' : 'text-navy-900'}`}
              >
                {l}
              </NavLink>
            ))}
            <Link to="/book-cleaning" onClick={() => setOpen(false)} className="btn btn-primary mt-2 w-full">Book a Cleaning</Link>
          </nav>
        )}
      </header>

      <main id="main"><Outlet /></main>

      <footer className="bg-navy-900 text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={st.logo || '/images/logo.svg'} alt={st.businessName} className="h-9 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{st.tagline}</p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck size={14} /> Licensed, Bonded & Insured
            </div>
          </div>
          <div>
            <p className="font-semibold text-white tracking-wide uppercase text-xs">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['/about', 'About Us'],
                ['/why-choose-us', 'Why Choose Us & Guarantee'],
                ['/faqs', 'FAQs'],
                ['/blog', 'Cleaning Blog'],
                ['/contact', 'Contact Us'],
                ['/admin', 'Admin Portal'],
                ['/admin/login', 'Admin Sign In'],
              ].map(([to, l]) => (
                <li key={to}>
                  <Link className="hover:text-white transition-colors" to={to}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white tracking-wide uppercase text-xs">Services & Areas</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="hover:text-white transition-colors" to="/services">All Cleaning Services</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/service-areas">Service Areas We Cover</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/book-cleaning">Book a Cleaning Online</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/get-a-quote">Request a Free Quote</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white tracking-wide uppercase text-xs">Contact & Hours</p>
            <ul className="mt-4 space-y-3 text-sm">
              {st.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-brand shrink-0" />
                  <a className="hover:text-white font-medium" href={`tel:${st.phone}`}>{st.phone}</a>
                </li>
              )}
              {st.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-brand shrink-0" />
                  <a className="hover:text-white break-all" href={`mailto:${st.email}`}>{st.email}</a>
                </li>
              )}
              {st.addressLine && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-brand shrink-0 mt-0.5" />
                  <span className="text-slate-400">{st.addressLine}</span>
                </li>
              )}
              {st.openingHours && (
                <li className="flex items-start gap-2.5">
                  <Clock size={15} className="text-brand shrink-0 mt-0.5" />
                  <span className="text-slate-400">{st.openingHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-400 sm:px-6 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-3">
          <span>© {new Date().getFullYear()} {st.businessName}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

      {(st.phone || st.whatsapp) && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-slate-200 bg-white p-2 md:hidden">
          {st.phone && <a href={`tel:${st.phone}`} onClick={() => track('call_click')} className="btn btn-primary flex-1"><Phone size={16} /> Call</a>}
          {st.whatsapp && <a href={waLink(st.whatsapp)} onClick={() => track('whatsapp_click')} target="_blank" rel="noopener noreferrer" className="btn btn-ghost flex-1"><MessageCircle size={16} /> WhatsApp</a>}
        </div>
      )}
    </SettingsCtx.Provider>
  );
}
