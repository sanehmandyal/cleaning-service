import { useEffect, useState, useCallback } from 'react';
import { Link, NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { api, getToken, setToken } from '../api.js';

const csv = (v) => (Array.isArray(v) ? v.join(', ') : v || '');
const lines = (v) => (Array.isArray(v) ? v.join('\n') : v || '');
const faqText = (v) => (v || []).map((f) => `${f.q} || ${f.a}`).join('\n');
const parseFaq = (t) => t.split('\n').map((l) => l.split('||').map((x) => x.trim())).filter((x) => x[0] && x[1]).map(([q, a]) => ({ q, a }));
const dateIn = (v) => (v ? String(v).slice(0, 10) : '');

const SEO = [
  ['metaTitle', 'Meta title (aim ≲ 60 chars)'], ['metaDescription', 'Meta description (aim ≲ 160 chars)', 'area'],
  ['canonicalUrl', 'Canonical URL (leave blank for default)'], ['noindex', 'Noindex (hide from search & sitemap)', 'check'],
  ['focusKeyword', 'Primary keyword / intent'],
];
const STATUS = ['draft', 'published', 'archived'];
const RES = {
  services: { title: 'Services', cols: ['name', 'status', 'category'], fields: [
    ['name', 'Name'], ['slug', 'Slug (blank = from name)'], ['category', 'Category', 'select', ['residential', 'commercial', 'specialist']], ['status', 'Status', 'select', STATUS],
    ['sortOrder', 'Sort order', 'number'], ['summary', 'Summary'], ['content', 'Content (blank line = new paragraph)', 'area'],
    ['heroImage', 'Hero image', 'image'], ['heroImageAlt', 'Hero image alt text'],
    ['inclusions', 'Inclusions (one per line)', 'lines'], ['suitableFor', 'Suitable for (one per line)', 'lines'], ['process', 'Process steps (one per line)', 'lines'],
    ['safetyNotes', 'Safety notes', 'area'], ['priceNote', 'Pricing / quotation text'], ['faqs', 'FAQs (question || answer, one per line)', 'faq'],
    ['relatedServices', 'Related service slugs (comma separated)', 'csv'], ['areas', 'Area slugs (comma separated)', 'csv'], ...SEO] },
  areas: { title: 'Service areas', cols: ['name', 'status'], fields: [
    ['name', 'Area name'], ['slug', 'Slug'], ['status', 'Status', 'select', STATUS], ['sortOrder', 'Sort order', 'number'], ['intro', 'Intro'],
    ['localContent', 'Genuine local content (unique per area)', 'area'], ['coverageNote', 'Real coverage / travel limits', 'area'],
    ['heroImage', 'Image', 'image'], ['heroImageAlt', 'Image alt text'], ['services', 'Service slugs available here (comma separated)', 'csv'],
    ['nearbyAreas', 'Nearby area slugs (comma separated)', 'csv'], ['faqs', 'FAQs (question || answer)', 'faq'], ...SEO] },
  blog: { title: 'Blog', cols: ['title', 'status'], fields: [
    ['title', 'Title'], ['slug', 'Slug'], ['status', 'Status', 'select', STATUS], ['author', 'Author'], ['publishedAt', 'Publish date (future = scheduled)', 'date'],
    ['excerpt', 'Excerpt'], ['content', 'Content', 'area'], ['heroImage', 'Image', 'image'], ['heroImageAlt', 'Image alt text'],
    ['relatedServices', 'Related service slugs (comma separated)', 'csv'], ...SEO] },
  testimonials: { title: 'Testimonials', cols: ['name', 'status', 'consentGiven'], fields: [
    ['name', 'Customer name'], ['location', 'Location'], ['text', 'Review text (genuine only)', 'area'], ['source', 'Source (e.g. Google)'],
    ['consentGiven', 'Customer consented to publishing', 'check'], ['status', 'Status', 'select', STATUS]] },
  gallery: { title: 'Gallery', cols: ['alt', 'status'], fields: [['image', 'Image', 'image'], ['alt', 'Alt text (required)'], ['caption', 'Caption'], ['serviceSlug', 'Service slug'], ['areaSlug', 'Area slug'], ['status', 'Status', 'select', STATUS]] },
  backlinks: { title: 'Backlink prospects', cols: ['website', 'status', 'followUpDate'], fields: [
    ['website', 'Website'], ['contactUrl', 'Contact page URL'], ['category', 'Category', 'select', ['association', 'directory', 'property-mgmt', 'real-estate', 'facility-mgmt', 'contractor', 'hospitality', 'supplier', 'publication', 'sponsorship', 'other']],
    ['relevance', 'Why relevant'], ['opportunity', 'Opportunity'], ['valueOffered', 'Value we offer'],
    ['status', 'Status', 'select', ['identified', 'contacted', 'replied', 'agreed', 'live-unverified', 'verified-live', 'lost', 'declined']],
    ['followUpDate', 'Follow-up date', 'date'], ['linkUrl', 'Live link URL (required to verify)'], ['referralNote', 'Referral traffic note'], ['notes', 'Notes', 'area']] },
  citations: { title: 'Citations', cols: ['directory', 'status'], fields: [
    ['directory', 'Directory'], ['url', 'Listing URL'], ['nameUsed', 'Name used'], ['phoneUsed', 'Phone used'], ['addressUsed', 'Address used'], ['websiteUsed', 'Website used'],
    ['status', 'Status', 'select', ['planned', 'submitted', 'verified-live', 'needs-fix', 'rejected']], ['notes', 'Notes', 'area']] },
  outreach: { title: 'Outreach log', cols: ['channel', 'summary'], fields: [['channel', 'Channel', 'select', ['email', 'phone', 'in-person', 'form', 'social']], ['summary', 'What was sent / discussed', 'area'], ['outcome', 'Outcome']] },
  seotasks: { title: 'Keyword map & SEO tasks', cols: ['title', 'primaryKeyword', 'done'], fields: [
    ['title', 'Task'], ['pageType', 'Page type'], ['pageSlug', 'Page slug'], ['primaryKeyword', 'Primary keyword'], ['secondaryKeywords', 'Secondary keywords (comma separated)', 'csv'],
    ['intent', 'Intent', 'select', ['commercial', 'local', 'informational', 'navigational']], ['done', 'Done', 'check'], ['notes', 'Notes', 'area']] },
  redirects: { title: 'Redirects (301)', cols: ['from', 'to'], fields: [['from', 'From path (e.g. /old-page)'], ['to', 'To path or URL'], ['code', 'Code', 'number']] },
};

export function Login() {
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  async function go(e) {
    e.preventDefault();
    try { const r = await api.post('/auth/login', f); setToken(r.data.token); nav('/admin'); } catch { setErr('Invalid email or password'); }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 p-4">
      <form onSubmit={go} className="card w-full max-w-sm space-y-4">
        <h1 className="text-2xl">Admin sign in</h1>
        <label className="block text-sm font-medium">Email<input className="input mt-1" type="email" autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required /></label>
        <label className="block text-sm font-medium">Password<input className="input mt-1" type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required /></label>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
    </div>
  );
}

const menu = [['', 'Dashboard'], ['enquiries', 'Enquiries'], ['services', 'Services'], ['areas', 'Service areas'], ['blog', 'Blog'], ['testimonials', 'Testimonials'], ['gallery', 'Gallery'],
  ['seo', 'SEO audit'], ['seotasks', 'Keyword map'], ['redirects', 'Redirects'], ['backlinks', 'Backlinks'], ['citations', 'Citations'], ['outreach', 'Outreach'], ['settings', 'Settings']];

export function AdminLayout() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  if (!getToken()) return <Navigate to="/admin/login" replace />;
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <div className="flex items-center justify-between bg-navy-900 p-3 text-white md:hidden">
        <span className="font-bold">Admin</span><button className="btn !py-1 border border-white/40" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
      </div>
      <aside className={`${open ? 'block' : 'hidden'} w-full bg-navy-900 p-4 text-sm text-slate-200 md:block md:w-56 md:shrink-0`}>
        <p className="mb-4 hidden text-lg font-bold text-white md:block">Admin</p>
        <nav aria-label="Admin" className="space-y-1">
          {menu.map(([to, l]) => <NavLink key={to} end={to === ''} to={`/admin/${to}`} onClick={() => setOpen(false)} className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? 'bg-brand text-white' : 'hover:bg-white/10'}`}>{l}</NavLink>)}
        </nav>
        <Link to="/" className="mt-6 block px-3 text-xs underline">View site</Link>
        <button className="mt-2 px-3 text-xs underline" onClick={() => { setToken(null); nav('/admin/login'); }}>Sign out</button>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8"><Outlet /></main>
    </div>
  );
}

export function Dashboard() {
  const [d, setD] = useState(null); const [a, setA] = useState(null);
  useEffect(() => { api.get('/admin/dashboard').then((r) => setD(r.data)); api.get('/admin/seo-audit').then((r) => setA(r.data)); }, []);
  if (!d) return <p>Loading…</p>;
  const cnt = (arr, k) => arr.find((x) => x._id === k)?.n || 0;
  const Tile = ({ t, v, to }) => <Link to={to} className="card block"><p className="text-sm text-slate-500">{t}</p><p className="mt-1 text-3xl font-bold text-navy-900">{v}</p></Link>;
  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">All figures come from your database. Traffic, rankings and backlink counts appear only if you enter or connect real data.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile t="New enquiries" v={d.enquiries.new} to="/admin/enquiries" /><Tile t="All enquiries" v={d.enquiries.total} to="/admin/enquiries" />
        <Tile t="Published services" v={cnt(d.services, 'published')} to="/admin/services" /><Tile t="Draft services" v={cnt(d.services, 'draft')} to="/admin/services" />
        <Tile t="Published areas" v={cnt(d.areas, 'published')} to="/admin/areas" /><Tile t="Published posts" v={cnt(d.posts, 'published')} to="/admin/blog" />
        <Tile t="Verified live backlinks" v={cnt(d.backlinks, 'verified-live')} to="/admin/backlinks" /><Tile t="Verified citations" v={cnt(d.citations, 'verified-live')} to="/admin/citations" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card"><h2 className="text-lg">SEO issues {a && `(${a.issueCount})`}</h2>{a && <ul className="mt-3 max-h-64 space-y-1 overflow-auto text-sm">{a.issues.slice(0, 12).map((i, n) => <li key={n}><code>{i.path}</code>: {i.issue}</li>)}{!a.issues.length && <li>No issues found in {a.checkedPages} published pages.</li>}</ul>}<Link to="/admin/seo" className="mt-3 inline-block text-sm text-brand">Full audit →</Link></div>
        <div className="card"><h2 className="text-lg">Enquiries by service</h2><ul className="mt-3 text-sm">{d.byService.map((b) => <li key={b._id}>{b._id}: {b.n}</li>)}{!d.byService.length && <li>No data yet.</li>}</ul>
          <h2 className="mt-6 text-lg">Recent activity</h2><ul className="mt-3 text-sm">{d.recent.map((r) => <li key={r._id}>{r.user} {r.action} {r.entity}</li>)}{!d.recent.length && <li>None yet.</li>}</ul></div>
      </div>
    </div>
  );
}

export function SeoAudit() {
  const [a, setA] = useState(null);
  useEffect(() => { api.get('/admin/seo-audit').then((r) => setA(r.data)); }, []);
  return (<div><h1 className="text-2xl">SEO audit</h1><p className="mt-1 text-sm text-slate-500">Checks stored content: missing/duplicate/long metadata, missing alt text, noindex, broken internal references, weak linking, redirect chains.</p>
    {!a ? <p className="mt-4">Running…</p> : <><p className="mt-4 font-semibold">{a.checkedPages} published pages checked · {a.issueCount} issues</p>
      <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-2">Page</th><th className="p-2">Issue</th></tr></thead><tbody>{a.issues.map((i, n) => <tr key={n} className="border-b"><td className="p-2"><code>{i.path}</code></td><td className="p-2">{i.issue}</td></tr>)}</tbody></table></div>
      <p className="mt-4 text-sm text-slate-500">Sitemap: <a className="text-brand underline" href="/sitemap.xml" target="_blank" rel="noreferrer">/sitemap.xml</a> is generated live from published, indexable pages, so it is always current.</p></>}</div>);
}

function Field({ def, value, onChange }) {
  const [key, label, type = 'text', opts] = def;
  const [up, setUp] = useState(false);
  const base = 'input mt-1';
  let el;
  if (type === 'area') el = <textarea className={base} rows={6} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
  else if (type === 'select') el = <select className={base} value={value || opts[0]} onChange={(e) => onChange(e.target.value)}>{opts.map((o) => <option key={o}>{o}</option>)}</select>;
  else if (type === 'check') return <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {label}</label>;
  else if (type === 'number') el = <input className={base} type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
  else if (type === 'date') el = <input className={base} type="date" value={dateIn(value)} onChange={(e) => onChange(e.target.value || null)} />;
  else if (type === 'lines') el = <textarea className={base} rows={4} defaultValue={lines(value)} onBlur={(e) => onChange(e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))} />;
  else if (type === 'csv') el = <input className={base} defaultValue={csv(value)} onBlur={(e) => onChange(e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} />;
  else if (type === 'faq') el = <textarea className={base} rows={5} defaultValue={faqText(value)} onBlur={(e) => onChange(parseFaq(e.target.value))} />;
  else if (type === 'image') el = (
    <div className="mt-1 flex flex-wrap items-center gap-3">
      {value && <img src={value} alt="" className="h-16 w-24 rounded object-cover" />}
      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" aria-label={label} onChange={async (e) => {
        const file = e.target.files[0]; if (!file) return; setUp(true);
        const fd = new FormData(); fd.append('image', file);
        try { const r = await api.post('/admin/upload', fd); onChange(r.data.url); } catch (er) { alert(er.response?.data?.error || 'Upload failed'); } setUp(false);
      }} />{up && <span className="text-sm">Uploading…</span>}
    </div>);
  else el = <input className={base} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
  return <label className="block text-sm font-medium">{label}{el}</label>;
}

export function Resource({ name }) {
  const cfg = RES[name];
  const [rows, setRows] = useState([]); const [edit, setEdit] = useState(null); const [msg, setMsg] = useState('');
  const load = useCallback(() => api.get(`/admin/${name}`).then((r) => setRows(r.data)), [name]);
  useEffect(() => { setEdit(null); load(); }, [load]);
  async function save(e) {
    e.preventDefault(); setMsg('');
    try {
      const { _id, ...body } = edit;
      const r = _id ? await api.put(`/admin/${name}/${_id}`, body) : await api.post(`/admin/${name}`, body);
      setEdit(null); setMsg('Saved.'); load(); return r;
    } catch (er) { setMsg(er.response?.data?.error || 'Save failed'); }
  }
  async function del(r) {
    if (!confirm(['services', 'areas', 'blog', 'testimonials', 'gallery'].includes(name) ? 'Archive this item? (It is hidden, not deleted.)' : 'Delete permanently?')) return;
    try { await api.delete(`/admin/${name}/${r._id}`); load(); } catch (er) { setMsg(er.response?.data?.error || 'Failed (admin role required)'); }
  }
  if (edit) return (
    <form onSubmit={save} className="max-w-3xl space-y-4">
      <h1 className="text-2xl">{edit._id ? 'Edit' : 'New'} — {cfg.title}</h1>
      {cfg.fields.map((d) => <Field key={d[0] + (edit._id || 'new')} def={d} value={edit[d[0]]} onChange={(v) => setEdit((x) => ({ ...x, [d[0]]: v }))} />)}
      {msg && <p role="alert" className="text-sm text-red-600">{msg}</p>}
      <div className="flex gap-3"><button className="btn btn-primary">Save</button><button type="button" className="btn btn-ghost" onClick={() => setEdit(null)}>Cancel</button></div>
    </form>
  );
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="text-2xl">{cfg.title}</h1><button className="btn btn-primary" onClick={() => setEdit({})}>Add new</button></div>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm">
        <thead><tr className="border-b bg-slate-50">{cfg.cols.map((c) => <th key={c} className="p-3 capitalize">{c}</th>)}<th className="p-3" /></tr></thead>
        <tbody>{rows.map((r) => <tr key={r._id} className="border-b last:border-0">{cfg.cols.map((c) => <td key={c} className="p-3">{typeof r[c] === 'boolean' ? (r[c] ? 'yes' : 'no') : c.toLowerCase().includes('date') && r[c] ? dateIn(r[c]) : String(r[c] ?? '')}</td>)}
          <td className="whitespace-nowrap p-3 text-right"><button className="mr-3 text-brand" onClick={() => setEdit(r)}>Edit</button><button className="text-red-600" onClick={() => del(r)}>{['services', 'areas', 'blog', 'testimonials', 'gallery'].includes(name) ? 'Archive' : 'Delete'}</button></td></tr>)}
          {!rows.length && <tr><td className="p-4 text-slate-500" colSpan={cfg.cols.length + 1}>Nothing here yet.</td></tr>}</tbody></table></div>
    </div>
  );
}

export function Enquiries() {
  const [rows, setRows] = useState([]); const [q, setQ] = useState(''); const [status, setStatus] = useState(''); const [open, setOpen] = useState(null); const [note, setNote] = useState('');
  const load = useCallback(() => api.get('/admin/enquiries', { params: { q, status } }).then((r) => setRows(r.data)), [q, status]);
  useEffect(() => { load(); }, [load]);
  const upd = async (id, body) => { const r = await api.patch(`/admin/enquiries/${id}`, body); setRows((x) => x.map((y) => (y._id === id ? r.data : y))); setNote(''); };
  async function exportCsv() {
    try { const r = await api.get('/admin/enquiries-export.csv', { responseType: 'blob' }); const a = document.createElement('a'); a.href = URL.createObjectURL(r.data); a.download = 'enquiries.csv'; a.click(); } catch { alert('Export requires admin role'); }
  }
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl">Enquiries & bookings</h1><button className="btn btn-ghost" onClick={exportCsv}>Export CSV (admin)</button></div>
      <div className="mt-4 flex flex-wrap gap-3"><input className="input max-w-xs" placeholder="Search name, phone, email" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select className="input max-w-[180px]" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status filter"><option value="">All statuses</option>{['new', 'contacted', 'quoted', 'won', 'lost', 'spam'].map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="mt-4 space-y-3">{rows.map((r) => (
        <div key={r._id} className="card !p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <button className="text-left" onClick={() => setOpen(open === r._id ? null : r._id)}><p className="font-semibold text-navy-900">{r.name} <span className="text-xs font-normal text-slate-500">· {r.type} · {new Date(r.createdAt).toLocaleString('en-IN')}</span></p><p className="text-sm">{r.phone}{r.email && ` · ${r.email}`}{r.serviceSlug && ` · ${r.serviceSlug}`}</p></button>
            <select className="input !w-auto !py-1" value={r.status} onChange={(e) => upd(r._id, { status: e.target.value })} aria-label="Update status">{['new', 'contacted', 'quoted', 'won', 'lost', 'spam'].map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          {open === r._id && <div className="mt-3 border-t pt-3 text-sm"><p className="whitespace-pre-wrap">{r.message || 'No message.'}</p>{r.preferredDate && <p className="mt-1">Preferred date: {r.preferredDate}</p>}
            <ul className="mt-3 space-y-1">{r.notes?.map((n, i) => <li key={i} className="rounded bg-slate-50 p-2">{n.text} <span className="text-xs text-slate-500">— {n.by}</span></li>)}</ul>
            <div className="mt-2 flex gap-2"><input className="input" placeholder="Internal note" value={note} onChange={(e) => setNote(e.target.value)} /><button className="btn btn-primary" onClick={() => note && upd(r._id, { note })}>Add</button></div></div>}
        </div>))}{!rows.length && <p className="text-slate-500">No enquiries found.</p>}</div>
    </div>
  );
}

const SET = [['businessName', 'Business name'], ['tagline', 'Tagline / homepage headline'], ['phone', 'Phone'], ['whatsapp', 'WhatsApp number (with country code)'], ['email', 'Email'],
  ['addressLine', 'Public address (leave blank if service-area business)'], ['openingHours', 'Opening hours (only if real)'], ['mapEmbedUrl', 'Google Maps embed URL (only for a real location)'],
  ['logo', 'Logo', 'image'], ['defaultOgImage', 'Default social image', 'image'], ['homeMetaTitle', 'Homepage meta title'], ['homeMetaDescription', 'Homepage meta description', 'area']];
export function Settings() {
  const [s, setS] = useState(null); const [msg, setMsg] = useState('');
  useEffect(() => { api.get('/admin/settings').then((r) => setS(r.data)); }, []);
  if (!s) return <p>Loading…</p>;
  const nest = (g, k) => (e) => setS({ ...s, [g]: { ...(s[g] || {}), [k]: e.target.value } });
  async function save(e) { e.preventDefault(); try { const r = await api.put('/admin/settings', s); setS(r.data); setMsg('Saved.'); } catch (er) { setMsg(er.response?.data?.error || 'Save failed (admin role required)'); } }
  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      <h1 className="text-2xl">Site settings</h1>
      {SET.map((d) => <Field key={d[0]} def={d} value={s[d[0]]} onChange={(v) => setS({ ...s, [d[0]]: v })} />)}
      <h2 className="pt-4 text-lg">Social profiles</h2>
      {['facebook', 'instagram', 'linkedin', 'googleBusiness'].map((k) => <label key={k} className="block text-sm font-medium capitalize">{k}<input className="input mt-1" value={s.social?.[k] || ''} onChange={nest('social', k)} /></label>)}
      <h2 className="pt-4 text-lg">Analytics & verification</h2>
      <label className="block text-sm font-medium">GA4 measurement ID (G-XXXXXXX)<input className="input mt-1" value={s.analytics?.ga4Id || ''} onChange={nest('analytics', 'ga4Id')} /></label>
      <label className="block text-sm font-medium">Search Console verification token<input className="input mt-1" value={s.analytics?.gscVerification || ''} onChange={nest('analytics', 'gscVerification')} /></label>
      {msg && <p role="status" className="text-sm">{msg}</p>}
      <button className="btn btn-primary">Save settings</button>
    </form>
  );
}

export const resourceNames = Object.keys(RES);
