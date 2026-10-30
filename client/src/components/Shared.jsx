import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronDown, Star } from 'lucide-react';
import { api } from '../api.js';

export function StarRating({ rating = 5, size = 16 }) {
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
      ))}
    </div>
  );
}

export const Loading = () => <div className="section text-center text-slate-500" role="status">Loading…</div>;
export const Missing = () => (
  <div className="section text-center"><h1 className="text-3xl">Page not found</h1><p className="mt-3">That page isn’t available.</p><Link to="/" className="btn btn-primary mt-6">Back to home</Link></div>
);

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 pt-6 text-sm text-slate-500 sm:px-6">
      <ol className="flex flex-wrap gap-1">
        <li><Link to="/" className="hover:text-brand">Home</Link></li>
        {items.map(([to, label], i) => <li key={label}>/ {to && i < items.length - 1 ? <Link to={to} className="hover:text-brand">{label}</Link> : <span aria-current="page">{label}</span>}</li>)}
      </ol>
    </nav>
  );
}

export function Faqs({ items = [] }) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
      {items.map((f, i) => (
        <div key={i}>
          <h3 className="text-base"><button className="flex w-full items-center justify-between gap-4 p-4 text-left font-semibold" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{f.q}<ChevronDown className={`h-5 w-5 shrink-0 transition ${open === i ? 'rotate-180' : ''}`} /></button></h3>
          {open === i && <p className="px-4 pb-4">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

export const Checklist = ({ items = [] }) => (
  <ul className="space-y-2">{items.map((x) => <li key={x} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" /><span>{x}</span></li>)}</ul>
);

export const Paragraphs = ({ text }) => String(text || '').split(/\n{2,}/).filter(Boolean).map((p, i) => <p key={i} className="mt-4 leading-relaxed">{p}</p>);

export function Img({ src, alt, className = '', eager = false, w = 1200, h = 675 }) {
  if (!src) return null;
  return <img src={src} alt={alt || ''} width={w} height={h} loading={eager ? 'eager' : 'lazy'} fetchpriority={eager ? 'high' : undefined} decoding="async" className={className} />;
}

export function EnquiryForm({ type = 'contact', serviceSlug = '', areaSlug = '', services = [], compact = false }) {
  const { pathname, search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const initialService = serviceSlug || searchParams.get('service') || '';
  const [f, setF] = useState({ name: '', phone: '', email: '', serviceSlug: initialService, areaSlug, preferredDate: '', message: '', website: '' });
  
  useEffect(() => {
    if (initialService) setF((prev) => ({ ...prev, serviceSlug: initialService }));
  }, [initialService]);
  const [st, setSt] = useState({ s: 'idle', err: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setSt({ s: 'sending', err: '' });
    try {
      await api.post('/public/enquiries', { ...f, type, sourcePage: pathname });
      window.gtag?.('event', type === 'booking' ? 'booking_submit' : type === 'quote' ? 'quote_submit' : 'contact_submit');
      setSt({ s: 'done', err: '' });
    } catch (er) {
      const d = er.response?.data?.details;
      setSt({ s: 'error', err: d ? Object.values(d).flat().join(' ') : 'Could not send. Please try again or call us.' });
    }
  }
  if (st.s === 'done') return <div role="status" className="rounded-2xl bg-brand-50 p-6 text-navy-900"><p className="text-lg font-semibold">Thank you — we’ve received your request.</p><p className="mt-1">We’ll get back to you shortly.</p></div>;
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Name<input className="input mt-1" required autoComplete="name" value={f.name} onChange={set('name')} /></label>
        <label className="block text-sm font-medium">Phone<input className="input mt-1" required type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} /></label>
      </div>
      {!compact && <label className="block text-sm font-medium">Email (optional)<input className="input mt-1" type="email" autoComplete="email" value={f.email} onChange={set('email')} /></label>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Service
          <select className="input mt-1" value={f.serviceSlug} onChange={set('serviceSlug')}><option value="">Select a service</option>{services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select>
        </label>
        {type === 'booking' && <label className="block text-sm font-medium">Preferred date<input className="input mt-1" type="date" value={f.preferredDate} onChange={set('preferredDate')} /></label>}
      </div>
      <label className="block text-sm font-medium">Details<textarea className="input mt-1" rows={4} maxLength={3000} value={f.message} onChange={set('message')} placeholder="Property type, size, and anything we should know" /></label>
      {/* honeypot: hidden from people, bots fill it */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" name="website" value={f.website} onChange={set('website')} />
      {st.s === 'error' && <p role="alert" className="text-sm text-red-600">{st.err}</p>}
      <button className="btn btn-primary w-full sm:w-auto" disabled={st.s === 'sending'}>{st.s === 'sending' ? 'Sending…' : type === 'booking' ? 'Request booking' : type === 'quote' ? 'Get my free quote' : 'Send enquiry'}</button>
    </form>
  );
}
