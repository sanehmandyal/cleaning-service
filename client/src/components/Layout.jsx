import { useState, createContext, useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { useApi } from '../hooks.js';

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
  const st = s || {};
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
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">{st.businessName}</p>
            <p className="mt-2 text-sm">{st.tagline}</p>
          </div>
          <div>
            <p className="font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
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
            <p className="font-semibold text-white">Get started</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="hover:text-white" to="/services">All services</Link></li>
              <li><Link className="hover:text-white" to="/service-areas">Service areas</Link></li>
              <li><Link className="hover:text-white" to="/book-cleaning">Book a cleaning</Link></li>
              <li><Link className="hover:text-white" to="/get-a-quote">Get a free quote</Link></li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-white">Contact</p>
            <ul className="mt-3 space-y-2">
              {st.phone && <li><a className="hover:text-white" href={`tel:${st.phone}`}>{st.phone}</a></li>}
              {st.email && <li><a className="hover:text-white break-all" href={`mailto:${st.email}`}>{st.email}</a></li>}
              {st.addressLine && <li>{st.addressLine}</li>}
              {st.openingHours && <li>{st.openingHours}</li>}
              {!st.phone && !st.email && <li className="text-slate-400">Contact details are set in the admin panel.</li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-4 text-center text-xs sm:px-6">
          © {new Date().getFullYear()} {st.businessName} · <Link to="/privacy-policy" className="hover:text-white">Privacy</Link> · <Link to="/terms-and-conditions" className="hover:text-white">Terms</Link> · <Link to="/admin" className="hover:text-white">Admin</Link>
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
