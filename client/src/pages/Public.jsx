import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  ClipboardList,
  CalendarCheck,
  SprayCan,
  BadgeCheck,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  Sparkles,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Check,
  Building2,
  Home as HomeIcon,
  Layers,
  Award,
  Users,
  CheckSquare,
  HelpCircle,
  Calendar,
  DollarSign,
  Calculator,
  Sliders,
  Wrench,
  Lock,
  Shield,
  Zap,
  FileText,
  Database,
  Search,
  Link2
} from 'lucide-react';
import { useApi, usePageMeta } from '../hooks.js';
import { useSettings } from '../components/Layout.jsx';
import { Loading, Missing, Breadcrumbs, Faqs, Checklist, Paragraphs, Img, EnquiryForm, StarRating } from '../components/Shared.jsx';

export const Hero = ({ h1, sub, badge, children }) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-brand text-white py-14 sm:py-20">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
      {badge && (
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-blue-100 backdrop-blur-md mb-4 border border-white/15">
          <Sparkles size={14} className="text-amber-300" />
          <span>{badge}</span>
        </div>
      )}
      <h1 className="max-w-3xl text-3xl font-extrabold text-white sm:text-4xl md:text-5xl tracking-tight leading-tight">{h1}</h1>
      {sub && <p className="mt-4 max-w-2xl text-base text-blue-100 sm:text-lg leading-relaxed">{sub}</p>}
      {children}
    </div>
  </section>
);

export const Ctas = () => (
  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
    <Link to="/book-cleaning" className="btn btn-primary shadow-lg shadow-brand/30">
      Book a Cleaning <ArrowRight size={16} />
    </Link>
    <Link to="/pricing" className="btn btn-outline">
      View Pricing & Packages
    </Link>
    <Link to="/get-a-quote" className="btn bg-white/10 hover:bg-white/20 text-white border-0">
      Get a Free Quote
    </Link>
  </div>
);

// -------------------------------------------------------------
// SECTION 1: INTERACTIVE PRICE CALCULATOR
// -------------------------------------------------------------
export function InteractivePriceCalculator() {
  const [beds, setBeds] = useState('2');
  const [cleanType, setCleanType] = useState('standard');
  const [freq, setFreq] = useState('biweekly');
  const [addons, setAddons] = useState(['oven']);

  const propertyOptions = {
    '1': { label: '1 Bed / Studio', duration: '2 - 3 Hours', team: '1-2 Technicians' },
    '2': { label: '2 Bedrooms', duration: '3 - 4 Hours', team: '2 Technicians' },
    '3': { label: '3 Bedrooms', duration: '3.5 - 5 Hours', team: '2-3 Technicians' },
    '4': { label: '4+ Bedrooms', duration: '4.5 - 6.5 Hours', team: '3 Technicians' },
    'office': { label: 'Commercial Office', duration: 'Custom / After-Hours', team: 'Commercial Crew' }
  };

  const typeDetails = {
    standard: {
      label: 'Standard Maintenance',
      desc: 'Systematic upkeep of daily living areas, kitchen sanitization, bathrooms & HEPA floor vacuuming.'
    },
    deep: {
      label: 'Intensive Deep Clean',
      desc: 'Detailed scrub targeting baseboards, door frames, stove degreasing & heavy bathroom tile descaling.'
    },
    moveout: {
      label: 'Move-In / Move-Out',
      desc: 'Guaranteed lease-inspection standard. Includes inside empty kitchen cabinets, oven, fridge & deposit coverage.'
    }
  };

  const freqDetails = {
    onetime: { label: 'One-Time Visit', note: 'Flexible single session with no ongoing commitment' },
    monthly: { label: 'Monthly Care', note: 'Consistent monthly deep maintenance refresh' },
    biweekly: { label: 'Bi-Weekly Care', note: 'Most popular for busy households; dedicated primary cleaner' },
    weekly: { label: 'Weekly Care', note: 'Maximum pristine upkeep with priority recurring scheduling' }
  };

  const addonOptions = [
    { id: 'oven', label: 'Inside Oven Detailing', desc: 'Baked grease & rack degreasing' },
    { id: 'fridge', label: 'Inside Refrigerator', desc: 'Sanitizing shelves, crispers & interior walls' },
    { id: 'windows', label: 'Interior Window Panes', desc: 'Streak-free glass & sill detailing' },
    { id: 'carpet', label: 'Carpet Steam Extraction', desc: 'Hot water fiber extraction & allergen removal' }
  ];

  const toggleAddon = (id) => {
    setAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <section className="section !py-16">
      <div className="rounded-3xl border-2 border-brand/20 bg-gradient-to-b from-brand-50/60 to-white p-6 sm:p-10 shadow-xl">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold text-brand uppercase tracking-wider mb-2">
            <Calculator size={14} /> Interactive Scope & Quote Builder
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-1">Configure Your Cleaning Scope</h2>
          <p className="mt-2 text-slate-600 text-sm">Select your property size, clean depth, and custom requirements to receive an accurate, transparent written quotation with zero obligation.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Controls Left */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Property Size */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                1. Select Property Size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(propertyOptions).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setBeds(k)}
                    className={`rounded-xl border p-3 text-left transition font-medium text-xs sm:text-sm ${
                      beds === k
                        ? 'border-brand bg-brand text-white shadow-md font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand/40'
                    }`}
                  >
                    <p className="font-bold">{v.label}</p>
                    <p className={`text-[11px] mt-1 ${beds === k ? 'text-blue-100' : 'text-slate-500'}`}>{v.team}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Cleaning Depth */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                2. Cleaning Depth
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                {Object.entries(typeDetails).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCleanType(k)}
                    className={`rounded-xl border p-3 text-left transition ${
                      cleanType === k
                        ? 'border-brand bg-brand-50 border-2 text-navy-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-brand/30'
                    }`}
                  >
                    <p className="font-bold text-xs sm:text-sm text-navy-900">{v.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{v.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Frequency */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                3. Service Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(freqDetails).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFreq(k)}
                    className={`rounded-xl border p-2.5 text-center transition ${
                      freq === k
                        ? 'border-brand bg-brand text-white font-bold shadow-md'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand/30'
                    }`}
                  >
                    <p className="text-xs font-bold">{v.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Optional Add-ons */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                4. Optional Add-On Services
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {addonOptions.map((o) => {
                  const active = addons.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleAddon(o.id)}
                      className={`flex items-start justify-between rounded-xl border p-3 text-left transition ${
                        active
                          ? 'border-brand bg-brand-50 text-navy-900 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-brand/30'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-navy-900">{o.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{o.desc}</p>
                      </div>
                      <span className={`text-xs font-bold ${active ? 'text-brand' : 'text-slate-400'}`}>
                        {active ? '✓ Added' : '+ Add'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Estimate Summary Right */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-brand/20 bg-white p-6 shadow-lg">
              <h3 className="text-lg font-bold text-navy-900">Custom Scope Summary</h3>
              <p className="text-xs text-slate-500 mt-0.5">All supplies, HEPA equipment & insurance included</p>

              <div className="mt-5 space-y-3 divide-y divide-slate-100 text-xs">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Property Layout:</span>
                  <span className="font-bold text-navy-900">{propertyOptions[beds].label}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Cleaning Level:</span>
                  <span className="font-bold text-navy-900">{typeDetails[cleanType].label}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Service Cadence:</span>
                  <span className="font-bold text-navy-900">{freqDetails[freq].label}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Estimated Duration:</span>
                  <span className="font-bold text-brand">{propertyOptions[beds].duration}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Assigned Team:</span>
                  <span className="font-bold text-navy-900">{propertyOptions[beds].team}</span>
                </div>
                {addons.length > 0 && (
                  <div className="pt-2">
                    <span className="text-slate-500 block mb-1">Selected Add-Ons:</span>
                    <div className="flex flex-wrap gap-1">
                      {addons.map((a) => (
                        <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                          {addonOptions.find((o) => o.id === a)?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Every property is uniquely evaluated so you receive an upfront, transparent quote with zero hidden travel charges or arrival surprises.
                </p>
              </div>

              <div className="mt-6 space-y-2.5">
                <Link
                  to={`/get-a-quote?service=${cleanType === 'moveout' ? 'move-in-out-cleaning' : cleanType === 'deep' ? 'deep-cleaning' : 'home-cleaning'}&beds=${beds}&freq=${freq}`}
                  className="btn btn-primary w-full text-center text-xs sm:text-sm shadow-md"
                >
                  Request Free Written Quotation →
                </Link>
                <Link
                  to="/book-cleaning"
                  className="btn btn-ghost w-full text-center text-xs text-slate-600"
                >
                  Book Direct Consultation Window
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 2: REAL TRANSFORMATIONS (BEFORE & AFTER SHOWCASE)
// -------------------------------------------------------------
export function BeforeAfterShowcase() {
  const [activeTab, setActiveTab] = useState('kitchen');

  const cases = {
    kitchen: {
      title: 'Kitchen & Cooktop Degreasing',
      room: 'Gourmet Kitchen Reset',
      desc: 'Heavy burnt-on oil and grease deposits across commercial gas burners and marble backsplash removed without scratching enamel.',
      time: '2.5 Hours',
      method: 'Citrus-based bio-enzyme degreaser + 0000 bronze wool polishing',
      result: 'Mirrored finish with 100% degreased surfaces & sealed grout',
      image: '/images/gallery-kitchen-1.jpg',
      beforeTag: 'Baked grease, cloudy granite & dirty burner caps',
      afterTag: 'Sanitized marble, polished chrome & spotless range'
    },
    bathroom: {
      title: 'Shower Glass & Tile Descaling',
      room: 'Master Bathroom Spa Clean',
      desc: 'Thick white calcium water rings and soap scum etched into frameless glass shower walls descaled to absolute transparency.',
      time: '3.0 Hours',
      method: 'Organic citric descaler + non-abrasive diamond glass pads',
      result: 'Streak-free clarity with water-repellent protective barrier',
      image: '/images/gallery-bath-1.jpg',
      beforeTag: 'Cloudy glass, discolored grout & mineral stained faucets',
      afterTag: 'Crystal-clear glass enclosure & mirror-shine fixtures'
    },
    living: {
      title: 'Hardwood Conditioning & Living Space',
      room: 'Open-Concept Living Room',
      desc: 'High-traffic scuffs, pet hair embedded in floor seams, and dull finish revitalized with hospital-grade HEPA vacuuming and pH-neutral polish.',
      time: '2.0 Hours',
      method: 'Dual-action HEPA extraction + natural botanical floor conditioner',
      result: 'Gleaming, non-slippery satin sheen with zero sticky residue',
      image: '/images/gallery-living-1.jpg',
      beforeTag: 'Dull traffic lanes, pet dander & dusty baseboard edges',
      afterTag: 'Restored natural wood luster & allergen-free air'
    },
    moveout: {
      title: 'End-of-Tenancy Apartment Reset',
      room: 'Full 2-Bedroom Rental Handover',
      desc: 'Exhaustive top-to-bottom clean of an empty rental unit including inside all cabinets, drawers, closets, and appliances.',
      time: '5.0 Hours',
      method: '50-Point Deposit-Guarantee Inspection Protocol',
      result: '100% full deposit returned on first landlord walkthrough',
      image: '/images/gallery-kitchen-2.jpg',
      beforeTag: 'Empty unit dust, marked walls & dirty appliance interiors',
      afterTag: 'Showroom condition ready for next tenant inspection'
    }
  };

  const curr = cases[activeTab];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-brand font-semibold text-xs uppercase tracking-wider">Proof of Craftsmanship</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-1">Real Transformations: Before & After</h2>
          <p className="mt-2 text-slate-600 text-sm">See the tangible difference our certified technicians deliver in actual homes and commercial offices.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Object.entries(cases).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => setActiveTab(k)}
              className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
                activeTab === k
                  ? 'bg-navy-900 text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {v.title}
            </button>
          ))}
        </div>

        {/* Card Showcase */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden grid lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-100">
            <img
              src={curr.image}
              alt={curr.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-navy-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md">
              AFTER · SparkleClean Standard
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-md flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-600">Before: {curr.beforeTag}</span>
              <span className="font-semibold text-emerald-600">After: {curr.afterTag}</span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-bold text-brand uppercase tracking-wider">{curr.room}</span>
              <h3 className="text-2xl font-black text-navy-900 mt-1">{curr.title}</h3>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">{curr.desc}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-navy-900">Duration: </span>
                  <span className="text-slate-600">{curr.time} dedicated detailing</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Wrench size={16} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-navy-900">Technique: </span>
                  <span className="text-slate-600">{curr.method}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-navy-900">Result: </span>
                  <span className="text-slate-600">{curr.result}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/book-cleaning" className="btn btn-primary text-xs w-full text-center">
                Book a Similar Transformation →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 3: INSIDE OUR CLEANING TOOLKIT (GREEN SCIENCE & GEAR)
// -------------------------------------------------------------
export function CleaningToolkit() {
  const tools = [
    {
      icon: Sparkles,
      title: 'Commercial Multi-Cyclonic HEPA Vacuums',
      specs: '0.3 Micron Filtration · 99.97% Efficiency',
      desc: 'Unlike standard household vacuums that exhaust microscopic dust back into the room, our commercial systems seal in allergens, pollen, and pet dander.'
    },
    {
      icon: Layers,
      title: '4-Zone Color-Coded Microfiber Weave',
      specs: 'Zero Cross-Contamination Guarantee',
      desc: 'We enforce strict medical-standard color coding: Red for toilets, Yellow for washbasins, Blue for mirrors/glass, and Green for food preparation counters.'
    },
    {
      icon: ShieldCheck,
      title: 'Zero-VOC Plant-Derived Enzyme Formulas',
      specs: '100% Biodegradable · Pet & Infant Safe',
      desc: 'Our specialized cleaning solutions break down organic grime naturally without harsh chlorine bleach, caustic ammonia, or toxic artificial fragrances.'
    },
    {
      icon: SprayCan,
      title: '212°F High-Temperature Steam Systems',
      specs: 'Thermal Sanitization · Kills 99.9% Bacteria',
      desc: 'Commercial dry-steam dissolves hardened bathroom grime, sanitizes grout lines, and revitalizes high-traffic floor areas without heavy chemicals.'
    }
  ];

  return (
    <section className="bg-navy-900 text-white py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-brand-100 font-semibold text-xs uppercase tracking-wider bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
            Engineering a Deeper Clean
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">Inside Our Professional Cleaning Toolkit</h2>
          <p className="mt-3 text-blue-100 text-sm">We don’t rely on generic grocery store sprays. Here is the hospital-grade equipment and green chemistry our specialists bring to your property.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between hover:bg-white/10 transition-colors">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand/20 text-brand-100 flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{t.title}</h3>
                  <p className="text-xs font-semibold text-amber-300 mt-1 mb-3">{t.specs}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 4: 50-POINT ROOM-BY-ROOM CHECKLIST EXPLORER
// -------------------------------------------------------------
export function RoomChecklistExplorer() {
  const [room, setRoom] = useState('kitchen');
  const rooms = {
    kitchen: {
      name: 'Kitchen',
      icon: '🍳',
      items: [
        'Degrease range hood exterior, filter screens & stovetop burners',
        'Scrub, disinfect and polish stainless steel or porcelain sink',
        'Wipe all countertop perimeters, stone backsplashes & grout lines',
        'Wipe exterior of all appliances (refrigerator, dishwasher, oven)',
        'Thoroughly clean inside microwave ceiling, turntable & walls',
        'Hand-wipe cabinet exterior faces, drawer handles & pulls',
        'Sanitize small appliances (toaster, coffee station, kettle)',
        'Vacuum baseboards, sweep and damp-mop tile or hardwood floors',
        'Empty kitchen waste & recycling receptacles, reline with fresh bags',
        'Detail wipe window sills, switch plates & breakfast bar stools'
      ]
    },
    bath: {
      name: 'Bathrooms',
      icon: '🚿',
      items: [
        'Descale wall tiles, grout lines, and frameless shower glass doors',
        'Scrub, sanitize and polish porcelain bathtubs and shower basins',
        'Disinfect toilet bowl interior, seat, base, hinges, and exterior tank',
        'Clean vanity sinks, mirrors, and shine all chrome faucets',
        'Sanitize soap dispensers, toothbrush holders, and accessories',
        'Dust exhaust fan vent covers, light bars, and shelving',
        'Vacuum bathroom floor mats and damp-mop tile with hospital disinfectant',
        'Wipe down towel bars, door handles, and privacy locks',
        'Empty wastebaskets and sanitize interior bin',
        'Neatly fold clean towels and arrange toiletries'
      ]
    },
    living: {
      name: 'Living & Dining',
      icon: '🛋️',
      items: [
        'Dust all accessible surfaces, coffee tables, consoles & bookcases',
        'HEPA vacuum sofas, fabric chairs, and underneath cushions',
        'Edge-to-edge vacuuming along baseboards, carpet perimeters & area rugs',
        'Damp-mop hardwood, laminate, or tile with pH-neutral conditioner',
        'Dust high ceiling fan blades, light fixtures & crown moldings',
        'Wipe down door frames, handles, and electrical switch plates',
        'Neatly arrange throw blankets, pillows, and media remotes',
        'Dust blinds, window sills, and patio sliding door tracks'
      ]
    },
    bed: {
      name: 'Bedrooms',
      icon: '🛏️',
      items: [
        'Dust all bedside tables, dressers, headboards & decor items',
        'Make beds neatly and change linens upon request',
        'HEPA vacuum carpets, area rugs, and under accessible bed frames',
        'Wipe baseboards, door moldings, and closet door handles',
        'Dust mirrors, lampshades, and picture frames',
        'Empty bedroom wastebaskets and replace liners',
        'Damp-mop hard surface floors and check closet door tracks',
        'Wipe all light switches and wall scuffs with non-abrasive sponge'
      ]
    },
    hygiene: {
      name: 'Hygiene & Air Quality',
      icon: '🌿',
      items: [
        'Double-filtered HEPA air purification during entire vacuuming pass',
        'Disinfection of high-frequency touchpoints (handles, remotes, phones)',
        'Zero cross-contamination 4-color microfiber cloth separation',
        'Plant-based hypoallergenic products with zero artificial fragrances',
        'Damp-dusting method prevents airborne particulate recirculation',
        'Sanitization of cleaning tools between every client property'
      ]
    }
  };

  const current = rooms[room];

  return (
    <section className="section !py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-brand font-semibold text-xs uppercase tracking-wider">Methodical Quality</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-1">Our 50-Point Room-by-Room Standard</h2>
        <p className="mt-2 text-slate-600 text-sm">Every visit is guided by an exhaustive room checklist so no corner or baseboard is ever overlooked.</p>
      </div>

      {/* Room Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {Object.entries(rooms).map(([k, v]) => (
          <button
            key={k}
            type="button"
            onClick={() => setRoom(k)}
            className={`rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              room === k
                ? 'bg-brand text-white shadow-lg shadow-brand/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{v.icon}</span>
            <span>{v.name} Checklist</span>
          </button>
        ))}
      </div>

      {/* Checklist Content Card */}
      <div className="card !p-8 border-2 border-brand/20 bg-white shadow-lg max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{current.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-navy-900">{current.name} Standards</h3>
              <p className="text-xs text-slate-500">{current.items.length} verified inspection points</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-bold">
            <CheckCircle2 size={14} /> Passed Every Visit
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {current.items.map((item) => (
            <div key={item} className="flex items-start gap-2.5 rounded-xl bg-slate-50/70 p-3 text-xs sm:text-sm text-slate-700">
              <Check size={16} className="text-brand shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 5: CLEANER VETTING & SECURITY STANDARDS
// -------------------------------------------------------------
export function CleanerVettingProcess() {
  const steps = [
    {
      step: '01',
      title: 'Triple-Layer Background Screening',
      desc: 'Every prospective cleaner undergoes federal, state, and county criminal background checks, identity confirmation, and professional reference verification.'
    },
    {
      step: '02',
      title: 'Practical Hands-on Skill Evaluation',
      desc: 'Applicants must pass timed, rigorous practical examinations in our simulated training space, evaluating speed, thoroughness, and gentle surface care.'
    },
    {
      step: '03',
      title: '40 Hours of Supervised Mentorship',
      desc: 'New hires shadow master trainers on live jobs, mastering fine materials like Carrera marble, untreated hardwoods, quartzite, and brushed nickel.'
    },
    {
      step: '04',
      title: 'Bonded, Fully Insured & Continually Audited',
      desc: 'We carry comprehensive liability insurance. Unannounced supervisor audits and continuous 5-star customer review benchmarks ensure unwavering quality.'
    }
  ];

  return (
    <section className="bg-brand-50 py-16 sm:py-20 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-brand font-semibold text-xs uppercase tracking-wider">Uncompromising Trust</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-1">Only the Top 2% of Applicants Clean Your Home</h2>
          <p className="mt-2 text-slate-600 text-sm">We know inviting someone into your personal living space requires complete confidence. Here is our 4-stage vetting framework.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="card !p-6 bg-white relative flex flex-col justify-between">
              <span className="text-4xl font-black text-brand/15 absolute top-4 right-4">{s.step}</span>
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm mb-4">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-navy-900">{s.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 6: COMMERCIAL & OFFICE SPECIALIZATION
// -------------------------------------------------------------
export function CommercialOfficeFocus() {
  return (
    <section className="bg-navy-900 text-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="text-brand-100 font-semibold text-xs uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
              Corporate & Facility Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 leading-tight">
              Discreet, Dependable Commercial Office Janitorial Contracts
            </h2>
            <p className="mt-4 text-blue-100 text-base leading-relaxed">
              We understand that a clean workplace boosts productivity, reduces team sick days, and leaves a memorable impression on visiting clients. Our commercial crews operate silently around your business hours.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ['After-Hours Access', 'Key, lockbox, and alarm code protocols. Cleaned while your staff rests.'],
                ['Signed Employee NDAs', 'All commercial staff sign strict confidentiality and non-disclosure agreements.'],
                ['Digital Inspection Logs', 'Time-stamped audit reports and checklists emailed to your office manager.'],
                ['Restocking & Supplies', 'We manage and restock hand soaps, paper towels, and bin liners automatically.']
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="font-bold text-white text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-brand-100" /> {t}
                  </p>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/get-a-quote?service=office-cleaning" className="btn btn-primary">
                Schedule Facility Walkthrough
              </Link>
              <Link to="/services/office-cleaning" className="btn btn-outline">
                Office Service Details
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10">
              <img
                src="/images/service-office.jpg"
                alt="Spotless corporate office conference room"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-brand p-5 text-white shadow-xl max-w-xs hidden sm:block">
              <p className="text-2xl font-black">45+ Companies</p>
              <p className="text-xs text-blue-100 mt-1">Trust SparkleClean Pro for nightly & weekly facility maintenance.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// SECTION 7: 24-HOUR GUARANTEE & INTERACTIVE TOP FAQS
// -------------------------------------------------------------
export function SatisfactionGuaranteeSection() {
  const topFaqs = [
    {
      q: 'What exactly does the 24-Hour Clean Guarantee cover?',
      a: 'If any surface or room included in your service scope was not cleaned to our promised standard, contact us within 24 hours. We will dispatch a technician to re-clean that specific area for free with zero hassle.'
    },
    {
      q: 'Do I need to be home while your cleaners are working?',
      a: 'Not at all. Over 70% of our recurring residential clients provide key lockbox codes, smart lock access, or building concierge authorization. Our staff are fully bonded, insured, and background-verified.'
    },
    {
      q: 'Are your cleaning supplies truly safe for pets and children?',
      a: 'Yes, 100%. We use plant-derived, biodegradable formulas with zero chlorine bleach, ammonia, or artificial scents. Your floors and surfaces are completely safe to touch immediately after cleaning.'
    },
    {
      q: 'Can I request the exact same cleaner for every recurring visit?',
      a: 'Yes! For weekly and bi-weekly clients, we assign a primary dedicated cleaner to your property so they become familiar with your exact preferences and layout.'
    },
    {
      q: 'How does rescheduling or cancellation work?',
      a: 'Life happens! You can reschedule or cancel any appointment free of charge up to 24 hours prior to your scheduled arrival window.'
    }
  ];

  return (
    <section className="section !py-16">
      <div className="grid gap-12 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-blue-50 border-2 border-brand/20 p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center mb-4 shadow-md">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-navy-900">Our Ironclad 24-Hour Guarantee</h3>
            <p className="mt-3 text-slate-700 text-sm leading-relaxed">
              We stand by our craftsmanship. If you notice any area that was not thoroughly cleaned according to our checklist, notify us within 24 hours and we return to re-clean it free of charge.
            </p>
            <div className="mt-6 pt-4 border-t border-brand/20 flex items-center gap-3">
              <div className="text-xs font-bold text-navy-900">
                <p>✓ 100% Free Re-Clean</p>
                <p className="text-slate-500 font-normal">No debates, no hidden fees.</p>
              </div>
            </div>
          </div>

          <div className="card !p-6 bg-slate-50 border-slate-200">
            <h4 className="font-bold text-navy-900 text-sm mb-2">Have a Custom Question?</h4>
            <p className="text-xs text-slate-600 mb-4">Our friendly support desk is available via phone and WhatsApp 6 days a week.</p>
            <div className="flex gap-2">
              <Link to="/contact" className="btn btn-primary !py-2 text-xs flex-1">
                Contact Desk
              </Link>
              <Link to="/faqs" className="btn btn-ghost !py-2 text-xs flex-1">
                View All FAQs
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <span className="text-brand font-semibold text-xs uppercase tracking-wider">Quick Answers</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1 mb-6">Frequently Asked Questions</h2>
          <Faqs items={topFaqs} />
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// HOW IT WORKS: 3 EASY STEPS
// -------------------------------------------------------------
export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Book in 60 Seconds',
      desc: 'Pick your property size, cleaning depth, and preferred arrival slot with transparent upfront pricing.',
      icon: CalendarCheck
    },
    {
      num: '02',
      title: 'Certified Technicians Arrive',
      desc: 'Our vetted, bonded specialists arrive fully equipped with hospital-grade HEPA systems & eco-friendly supplies.',
      icon: ShieldCheck
    },
    {
      num: '03',
      title: 'Spotless Guarantee Walkthrough',
      desc: 'Inspect your sparkling space. If anything was missed, our 24-hour free re-clean guarantee has you covered.',
      icon: Sparkles
    }
  ];

  return (
    <section className="section !py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-brand font-semibold text-xs uppercase tracking-wider bg-brand-50 border border-brand/20 px-3.5 py-1.5 rounded-full">
          Effortless Experience
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-4">How SparkleClean Pro Works</h2>
        <p className="mt-2 text-slate-600 text-sm">Three straightforward steps to an immaculate, healthier home or office.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3 relative">
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={st.num} className="card relative !p-8 border-2 border-slate-100 hover:border-brand/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center font-bold">
                    <Icon size={24} />
                  </div>
                  <span className="text-3xl font-black text-slate-200">{st.num}</span>
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{st.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-brand">
                <span>Step {i + 1} of 3</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// HOMEPAGE SERVICE PACKAGES & SCOPES (NO FAKE PRICES)
// -------------------------------------------------------------
export function HomePricingPackages() {
  const plans = [
    {
      name: 'Standard Home Clean',
      slug: 'home-cleaning',
      badge: 'Popular for Homes',
      quoteNote: 'Custom quote based on bedrooms & bathrooms',
      desc: 'Regular scheduled care for apartments, condos, and single-family houses.',
      features: [
        'Dusting all reachable surfaces, tables & shelves',
        'Hospital-grade HEPA vacuuming of floors & rugs',
        'Damp-mopping hardwood, tile & laminate floors',
        'Complete bathroom sanitization & mirror shine',
        'Kitchen countertops, sink & stove exterior scrub',
        'Emptying trash receptacles & replacing liners'
      ]
    },
    {
      name: 'Intensive Deep Clean',
      slug: 'deep-cleaning',
      badge: 'Recommended 1st Clean',
      quoteNote: 'Custom quote based on square footage & condition',
      desc: 'Meticulous top-to-bottom scrub targeting hardened grime and neglected corners.',
      features: [
        'Everything in Standard Home Clean',
        'Hand-wiping baseboards, door moldings & switch plates',
        'Heavy stove & range hood grease removal',
        'Deep bathroom tile grout descaling & shower scrub',
        'Ceiling fan blades, light fixtures & air vent detail',
        'Under and behind accessible light furniture'
      ]
    },
    {
      name: 'Move-In / Move-Out Clean',
      slug: 'move-in-out-cleaning',
      badge: '100% Deposit Guarantee',
      quoteNote: 'Tailored quote covering all appliances & cabinets',
      desc: 'Designed specifically to satisfy strict landlord and leasing office standards.',
      features: [
        'Deep cleaning inside all empty kitchen cabinets & drawers',
        'Inside oven & refrigerator degreasing & sanitize',
        'Detailed wall scuff wipe-down & switch plates',
        'Inside all bedroom closets, shelves & hangers',
        'Window sills, window tracks & sliding door tracks',
        'Free 24-hr re-clean if your landlord has notes'
      ]
    }
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand font-semibold text-xs uppercase tracking-wider bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
            Simple & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-4">
            Cleaning Packages & Service Scope
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            All services include verified background-checked cleaners, hospital-grade HEPA vacuums, non-toxic plant supplies, and our 24-hour satisfaction guarantee.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className="card relative flex flex-col justify-between !p-8 bg-white border-2 hover:border-brand transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              {p.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-md">
                  {p.badge}
                </span>
              )}
              <div>
                <h3 className="text-2xl font-extrabold text-navy-900">{p.name}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                <div className="mt-5 rounded-xl bg-brand-50/60 border border-brand/20 p-3">
                  <p className="text-xs font-bold text-brand">{p.quoteNote}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Transparent written quotation · No obligation</p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">Included in this clean:</p>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={14} className="text-brand shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link to={`/get-a-quote?service=${p.slug}`} className="btn btn-primary w-full text-center text-xs sm:text-sm">
                  Request Quote for {p.name.split(' ')[0]}
                </Link>
                <Link to={`/services/${p.slug}`} className="btn btn-ghost !py-2 text-xs text-center text-slate-600">
                  View Full Service Inclusions →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <CalendarCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-navy-900 text-sm sm:text-base">Need regular weekly or bi-weekly maintenance?</h4>
              <p className="text-xs sm:text-sm text-slate-500">Recurring clients receive preferred booking windows, dedicated staff, and loyalty quotation rates.</p>
            </div>
          </div>
          <Link to="/get-a-quote" className="btn btn-primary whitespace-nowrap text-xs sm:text-sm">
            Get Recurring Quote →
          </Link>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// WHY CHOOSE US COMPARISON MATRIX
// -------------------------------------------------------------
export function WhyChooseUsComparison() {
  const comparisons = [
    {
      feature: 'Bonded & Comprehensive Liability Insured',
      pro: true,
      gig: false,
      franchise: true,
      note: 'Comprehensive property damage & theft protection.'
    },
    {
      feature: '100% Criminal Background Checked & W-2 Staff',
      pro: true,
      gig: false,
      franchise: 'Varies',
      note: 'We never hire anonymous gig workers or subcontractors.'
    },
    {
      feature: 'Commercial 0.3-Micron HEPA Cyclonic Vacuums',
      pro: true,
      gig: false,
      franchise: false,
      note: 'Traps 99.97% allergens; does not exhaust dust back into room.'
    },
    {
      feature: '4-Zone Color-Coded Microfiber Protocol',
      pro: true,
      gig: false,
      franchise: false,
      note: 'Strict zero cross-contamination between bathrooms & kitchens.'
    },
    {
      feature: '100% Non-Toxic Green Plant Enzyme Formulas',
      pro: true,
      gig: 'Bring Your Own',
      franchise: false,
      note: 'Zero toxic chlorine or harsh synthetic fragrances.'
    },
    {
      feature: 'Ironclad 24-Hour Free Re-Clean Guarantee',
      pro: true,
      gig: false,
      franchise: 'Complex Policy',
      note: 'Unsatisfied? We return within 24 hours free of charge.'
    },
    {
      feature: 'Dedicated Primary Cleaner for Recurring Visits',
      pro: true,
      gig: false,
      franchise: false,
      note: 'Same familiar technician who knows your home layout.'
    }
  ];

  return (
    <section className="section !py-16 sm:!py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-brand font-semibold text-xs uppercase tracking-wider bg-brand-50 border border-brand/20 px-3.5 py-1.5 rounded-full">
          The SparkleClean Pro Difference
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-4">
          Why Over 1,500 Clients Choose Us Over The Rest
        </h2>
        <p className="mt-3 text-slate-600 text-sm">
          See how our certified hospital-standard protocols compare against gig marketplaces and old-school maid companies.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 sm:p-5 text-sm font-bold text-navy-900">Standard / Feature</th>
              <th className="p-4 sm:p-5 text-sm font-extrabold text-white bg-brand text-center min-w-[160px]">
                SparkleClean Pro
              </th>
              <th className="p-4 sm:p-5 text-sm font-semibold text-slate-600 text-center min-w-[140px]">
                Gig Apps / Classifieds
              </th>
              <th className="p-4 sm:p-5 text-sm font-semibold text-slate-600 text-center min-w-[140px]">
                Traditional Franchises
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {comparisons.map((c, i) => (
              <tr key={c.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="p-4 sm:p-5">
                  <p className="font-bold text-navy-900">{c.feature}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.note}</p>
                </td>
                <td className="p-4 sm:p-5 text-center bg-brand-50/40">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white font-bold">
                    ✓
                  </span>
                </td>
                <td className="p-4 sm:p-5 text-center text-slate-500">
                  {typeof c.gig === 'boolean' ? (
                    c.gig ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : (
                      <span className="text-rose-400 font-bold">✕</span>
                    )
                  ) : (
                    <span className="text-xs font-medium text-slate-500">{c.gig}</span>
                  )}
                </td>
                <td className="p-4 sm:p-5 text-center text-slate-500">
                  {typeof c.franchise === 'boolean' ? (
                    c.franchise ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : (
                      <span className="text-rose-400 font-bold">✕</span>
                    )
                  ) : (
                    <span className="text-xs font-medium text-slate-500">{c.franchise}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <Link to="/why-choose-us" className="btn btn-ghost font-semibold text-sm">
          Read All 6 Core Pillars & Cleaning Standards →
        </Link>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// OPERATIONS & ADMIN CONTROL CENTER
// -------------------------------------------------------------
export function AdminPanelSection() {
  const [activeTab, setActiveTab] = useState('crm');

  const modules = [
    {
      id: 'crm',
      title: 'Leads & Enquiries CRM',
      badge: 'Real-Time Sync',
      icon: Users,
      desc: 'Centralized customer inquiry & booking dispatch engine. Instant lead capture, status tracking (new, contacted, quoted, won), and verified customer logs.',
      metrics: [
        { label: 'Booking Requests', val: 'Direct Pipeline' },
        { label: 'Status Controls', val: 'New / Quoted / Won' },
        { label: 'Response Target', val: '< 15 mins' }
      ],
      link: '/admin/enquiries',
      linkText: 'Open Enquiries CRM'
    },
    {
      id: 'cms',
      title: 'Content & Services CMS',
      badge: 'Live MongoDB',
      icon: Layers,
      desc: 'Instant editorial control over residential & commercial service pages, service areas, project photo galleries, and customer FAQs without touching code.',
      metrics: [
        { label: 'Catalog Items', val: 'Services & Areas' },
        { label: 'Asset Management', val: 'Local CDN Images' },
        { label: 'Publishing', val: 'Zero Code Required' }
      ],
      link: '/admin/services',
      linkText: 'Manage Service Catalog'
    },
    {
      id: 'seo',
      title: 'Technical SEO & Audit Suite',
      badge: '0 Errors Verified',
      icon: Search,
      desc: 'Automated 100% on-page compliance engine. Real-time meta title/description checks, canonical URL enforcement, XML sitemaps, and 301 redirects.',
      metrics: [
        { label: 'Audit Status', val: '100% Passing' },
        { label: 'Sitemap XML', val: 'Auto-Generated' },
        { label: '301 Engine', val: 'Live Redirects' }
      ],
      link: '/admin/seo',
      linkText: 'View SEO Health Monitor'
    },
    {
      id: 'outreach',
      title: 'Local Citations & Outreach CRM',
      badge: 'Active Tracking',
      icon: Link2,
      desc: 'Google Business Profile citation tracker, NAP consistency monitor, directory listings, and high-domain authority backlink outreach pipeline.',
      metrics: [
        { label: 'NAP Consistency', val: 'Verified 100%' },
        { label: 'Directory Citations', val: 'Top Local Tiers' },
        { label: 'Verification', val: 'Live URL Crawler' }
      ],
      link: '/admin/citations',
      linkText: 'Explore Citations & Backlinks'
    }
  ];

  const currentModule = modules.find((m) => m.id === activeTab) || modules[0];
  const IconComp = currentModule.icon;

  return (
    <section id="admin-panel" className="bg-gradient-to-b from-slate-900 via-navy-900 to-slate-900 py-16 sm:py-20 text-white relative overflow-hidden border-t border-slate-800">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 blur-3xl pointer-events-none rounded-full" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-brand-300 font-semibold text-xs uppercase tracking-wider bg-brand-500/15 border border-brand-400/30 px-3.5 py-1.5 rounded-full mb-4">
            <Lock size={12} className="text-brand-300" />
            Operations Command Center
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Integrated Admin & Operations Panel
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            The full-stack management hub powering SparkleClean Pro. Control client bookings, edit services in real-time, monitor technical SEO performance, and orchestrate backlink campaigns from one secure dashboard.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {modules.map((m) => {
            const TabIcon = m.icon;
            const isSelected = activeTab === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveTab(m.id)}
                className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-600/20 border-brand-400 text-white shadow-lg shadow-brand-500/10 -translate-y-0.5'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-300'}`}>
                    <TabIcon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-brand-400/20 text-brand-300 border border-brand-400/30' : 'bg-white/10 text-slate-400'
                  }`}>
                    {m.badge}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{m.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tab Preview Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <ShieldCheck size={14} /> Production Enterprise Control
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                <IconComp size={28} className="text-brand-400" />
                {currentModule.title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentModule.desc}
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {currentModule.metrics.map((met, idx) => (
                  <div key={idx} className="bg-navy-950/70 border border-slate-700/60 p-3 rounded-xl text-center">
                    <p className="text-xs text-slate-400 font-medium">{met.label}</p>
                    <p className="text-sm sm:text-base font-bold text-white mt-1 text-brand-300">{met.val}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  to={currentModule.link}
                  className="btn btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2 shadow-lg shadow-brand-500/25"
                >
                  {currentModule.linkText} <ArrowRight size={15} />
                </Link>
                <Link
                  to="/admin"
                  className="px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <Sliders size={15} /> Launch Main Dashboard
                </Link>
                <Link
                  to="/admin/login"
                  className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 underline decoration-slate-600 underline-offset-4"
                >
                  <Lock size={12} /> Sign In with Credentials
                </Link>
              </div>
            </div>

            {/* Visual Control Mockup / Live State */}
            <div className="lg:col-span-5 bg-navy-950 rounded-xl border border-slate-700/80 p-5 shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-slate-300">sparkleclean-admin // live</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">Auth: JWT Session</span>
              </div>

              {/* Dynamic preview details based on active tab */}
              {activeTab === 'crm' && (
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">Deep Clean (3-Bed / 2-Bath)</p>
                      <p className="text-[11px] text-slate-400">sarah.m@example.com · Downtown</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">NEW INQUIRY</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">Commercial Office Weekly</p>
                      <p className="text-[11px] text-slate-400">facility@techhub.io · West End</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">QUOTED</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">Move-In Disinfection</p>
                      <p className="text-[11px] text-slate-400">david.k@example.com · Suburbs</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">BOOKED</span>
                  </div>
                </div>
              )}

              {activeTab === 'cms' && (
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-white">Services: Deep Cleaning</span>
                    <span className="text-emerald-400 text-[11px]">Published (Mongoose)</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-white">Service Area: Downtown Metro</span>
                    <span className="text-emerald-400 text-[11px]">Published (Mongoose)</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-white">Blog: Seasonal Allergies Guide</span>
                    <span className="text-emerald-400 text-[11px]">Published (Mongoose)</span>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-white">On-Page Compliance</span>
                    <span className="text-emerald-400 font-bold">100% Score</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-white">Sitemap Index</span>
                    <span className="text-emerald-400">/sitemap.xml (Active)</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-white">Schema.org LocalBusiness</span>
                    <span className="text-emerald-400">JSON-LD Injected</span>
                  </div>
                </div>
              )}

              {activeTab === 'outreach' && (
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-white">Google Business Profile</span>
                    <span className="text-emerald-400">NAP 100% Match</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-white">Local Chamber Directory</span>
                    <span className="text-emerald-400">Verified Citation</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-white">Property Mgmt Alliance</span>
                    <span className="text-brand-300">In Outreach Review</span>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5"><Database size={13} className="text-brand-400" /> MongoDB 8.2 Connected</span>
                <span className="flex items-center gap-1.5"><Shield size={13} className="text-emerald-400" /> Role: System Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Footer Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Direct Admin Navigation:</span>
            <span className="hidden sm:inline">Access backend control views directly</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin" className="hover:text-brand-300 transition-colors bg-white/5 px-2.5 py-1 rounded border border-white/10">Dashboard</Link>
            <Link to="/admin/enquiries" className="hover:text-brand-300 transition-colors bg-white/5 px-2.5 py-1 rounded border border-white/10">Enquiries CRM</Link>
            <Link to="/admin/seo" className="hover:text-brand-300 transition-colors bg-white/5 px-2.5 py-1 rounded border border-white/10">SEO Engine</Link>
            <Link to="/admin/services" className="hover:text-brand-300 transition-colors bg-white/5 px-2.5 py-1 rounded border border-white/10">Services CMS</Link>
            <Link to="/admin/areas" className="hover:text-brand-300 transition-colors bg-white/5 px-2.5 py-1 rounded border border-white/10">Areas CMS</Link>
            <Link to="/admin/settings" className="hover:text-brand-300 transition-colors bg-white/5 px-2.5 py-1 rounded border border-white/10">Site Settings</Link>
            <Link to="/admin/login" className="text-brand-300 hover:text-white font-semibold transition-colors flex items-center gap-1">
              <Lock size={11} /> Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// RECENT BLOG & EXPERT GUIDES
// -------------------------------------------------------------
export function RecentBlogSection({ blogs }) {
  const articles = blogs && blogs.length > 0 ? blogs.slice(0, 3) : [
    {
      slug: 'deep-clean-checklist-for-allergies',
      title: 'The Ultimate Deep Cleaning Checklist for Seasonal Allergy Relief',
      excerpt: 'Discover the exact room-by-room dusting and HEPA filtration steps needed to eliminate pollen, pet dander, and dust mites.',
      heroImage: '/images/blog-deepclean.jpg',
      author: 'SparkleClean Team',
      publishedAt: '2026-10-15'
    },
    {
      slug: 'tenant-move-out-cleaning-guide',
      title: 'Tenant Guide: How to Guarantee Your 100% Security Deposit Return',
      excerpt: 'The critical kitchen appliance, bathroom limescale, and baseboard items that landlord inspection audits scrutinize.',
      heroImage: '/images/blog-moveout.jpg',
      author: 'Sarah Jenkins',
      publishedAt: '2026-10-02'
    },
    {
      slug: 'green-cleaning-science',
      title: 'The Science of Green Chemistry: Why Plant Enzymes Outperform Bleach',
      excerpt: 'How modern plant-derived biosurfactants dissolve hardened oils and protein grime without caustic VOC vapors.',
      heroImage: '/images/blog-ecoclean.jpg',
      author: 'Marcus Chen',
      publishedAt: '2026-09-24'
    }
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-brand font-semibold text-xs uppercase tracking-wider bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
              Cleaning Insights & Checklists
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mt-4">
              Latest Cleaning Guides & Tips
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Expert advice from our master technicians on maintenance, stain removal, and hygiene.
            </p>
          </div>
          <Link to="/blog" className="btn btn-ghost whitespace-nowrap self-start sm:self-auto font-semibold text-sm">
            Browse All Guides →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {articles.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="card group overflow-hidden !p-0 transition hover:shadow-xl hover:-translate-y-1 bg-white"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={p.heroImage || '/images/blog-deepclean.jpg'}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <p className="text-[11px] font-semibold text-brand uppercase tracking-wider">
                  {p.author || 'SparkleClean Team'} · {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Guide'}
                </p>
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand transition-colors mt-2 line-clamp-2">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {p.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  Read Article <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export const ServiceCard = ({ s }) => (
  <Link
    to={`/services/${s.slug}`}
    className="card group flex flex-col justify-between overflow-hidden !p-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
  >
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
      <img
        src={s.heroImage || '/images/service-home.jpg'}
        alt={s.heroImageAlt || s.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        width="600"
        height="375"
      />
      <div className="absolute top-3 left-3">
        <span className="rounded-full bg-navy-900/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white capitalize">
          {s.category}
        </span>
      </div>
    </div>
    <div className="flex flex-1 flex-col justify-between p-6">
      <div>
        <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand transition-colors">{s.name}</h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">{s.summary}</p>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {s.priceNote?.split('.')[0] || 'Custom quotation available'}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
          Details <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  </Link>
);

export function Home() {
  const st = useSettings();
  const { data: services } = useApi('/public/services');
  const { data: areas } = useApi('/public/areas');
  const { data: reviews } = useApi('/public/testimonials');
  const { data: gallery } = useApi('/public/gallery');
  const { data: blogs } = useApi('/public/blog');
  usePageMeta(st.homeMetaTitle || `${st.businessName || 'SparkleClean Pro'} | ${st.tagline || ''}`, st.homeMetaDescription || st.tagline);

  return (
    <>
      <Hero
        badge="✨ Top-Rated Residential & Commercial Cleaning"
        h1={st.tagline || 'Flawless Cleaning for Homes & Workplaces'}
        sub="Experience spotless, healthy living spaces with our bonded, background-checked cleaning specialists. 100% eco-friendly, hospital-grade equipment, and a 24-hour satisfaction guarantee."
      >
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-blue-100">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="font-semibold text-white">Licensed, Bonded & Insured</span>
          </div>
          <span className="hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-300" />
            <span>100% Non-Toxic Green Products</span>
          </div>
          <span className="hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-blue-300" />
            <span>24-Hour Re-Clean Guarantee</span>
          </div>
        </div>
        <Ctas />
      </Hero>

      {/* Trust Stats Bar */}
      <section className="border-y border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-center">
            <div className="p-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy-900">1,500+</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Properties Cleaned</p>
            </div>
            <div className="p-2 border-l border-slate-200">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand">Upfront</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Written Quotations</p>
            </div>
            <div className="p-2 border-l border-slate-200">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy-900">100%</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Vetted & Bonded Staff</p>
            </div>
            <div className="p-2 border-l border-slate-200">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand">24-Hour</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Re-Clean Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process: How SparkleClean Pro Works */}
      <HowItWorksSection />

      {/* Services Grid */}
      <section className="section">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-brand font-semibold text-sm tracking-wide uppercase">What We Offer</span>
          <h2 className="text-3xl sm:text-4xl mt-1">Tailored Cleaning Solutions</h2>
          <p className="mt-3 text-slate-600">From recurring weekly maintenance to intensive deep cleans and corporate offices, choose the service that fits your schedule.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(services || []).map((s) => (
            <ServiceCard key={s.slug} s={s} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/services" className="btn btn-ghost font-semibold">
            View All Services & Inclusions →
          </Link>
        </div>
      </section>

      {/* SECTION 2: Real Transformations (Before & After Showcase) */}
      <BeforeAfterShowcase />

      {/* SECTION 3: Cleaning Toolkit (Engineering Clean & Green Science) */}
      <CleaningToolkit />

      {/* The SparkleClean Pro Difference: Comparison Matrix */}
      <WhyChooseUsComparison />

      {/* SECTION 4: 50-Point Room-by-Room Checklist Explorer */}
      <RoomChecklistExplorer />

      {/* SECTION 5: Cleaner Vetting & Security Standards */}
      <CleanerVettingProcess />

      {/* Integrated Admin & Operations Control Center */}
      <AdminPanelSection />

      {/* SECTION 6: Commercial & Office Specialization Hub */}
      <CommercialOfficeFocus />

      {/* Latest Cleaning Guides & Blog Articles */}
      <RecentBlogSection blogs={blogs} />

      {/* Areas We Serve */}
      {areas?.length > 0 && (
        <section className="bg-brand-50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-brand font-semibold text-sm tracking-wide uppercase">Local Service Areas</span>
              <h2 className="text-3xl sm:text-4xl mt-1">Where We Clean</h2>
              <p className="mt-2 text-slate-600">Providing prompt, reliable residential and commercial cleaning across key metropolitan sectors.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {areas.map((a) => (
                <Link
                  key={a.slug}
                  to={`/service-areas/${a.slug}`}
                  className="card group overflow-hidden !p-0 transition hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-200">
                    <img
                      src={a.heroImage || '/images/area-downtown.jpg'}
                      alt={a.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-navy-900 group-hover:text-brand transition-colors flex items-center gap-1.5 text-base">
                      <MapPin size={16} className="text-brand" /> {a.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.intro}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 7: 24-Hour Guarantee & Interactive FAQs */}
      <SatisfactionGuaranteeSection />

      {/* Free Quote Banner */}
      <section className="bg-navy-900 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="text-white">
              <span className="text-brand-100 font-semibold text-sm uppercase tracking-wider">Fast & Free</span>
              <h2 className="text-3xl sm:text-4xl text-white font-extrabold mt-1">Ready for a Sparkling Clean Space?</h2>
              <p className="mt-4 text-blue-100 leading-relaxed text-base">
                Tell us about your property size and cleaning needs. We’ll prepare an upfront, transparent quote with zero obligation.
              </p>
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/10 p-2 text-brand-100">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-sm text-slate-200">No lock-in contracts for recurring cleans</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/10 p-2 text-brand-100">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-sm text-slate-200">All supplies and commercial equipment included</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/10 p-2 text-brand-100">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-sm text-slate-200">24-hour quality guarantee on every visit</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/15">
                <ContactLines light />
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-navy-900 mb-1">Get an Instant Quote</h3>
              <p className="text-xs text-slate-500 mb-6">Takes less than 60 seconds</p>
              <EnquiryForm type="quote" services={services || []} compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ContactLines({ light = false }) {
  const s = useSettings();
  const c = light ? 'text-white' : 'text-navy-900';
  const sub = light ? 'text-blue-100' : 'text-slate-600';
  return (
    <ul className={`space-y-3 text-sm ${c}`}>
      {s.phone && (
        <li className="flex items-center gap-3">
          <Phone size={18} className="text-brand shrink-0" />
          <a href={`tel:${s.phone}`} className="font-semibold hover:underline">{s.phone}</a>
        </li>
      )}
      {s.whatsapp && (
        <li className="flex items-center gap-3">
          <MessageCircle size={18} className="text-emerald-500 shrink-0" />
          <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
            Chat on WhatsApp
          </a>
        </li>
      )}
      {s.email && (
        <li className="flex items-center gap-3">
          <Mail size={18} className="text-brand shrink-0" />
          <a href={`mailto:${s.email}`} className="font-semibold hover:underline break-all">{s.email}</a>
        </li>
      )}
      {s.addressLine && (
        <li className="flex items-center gap-3">
          <MapPin size={18} className="text-brand shrink-0" />
          <span className={sub}>{s.addressLine}</span>
        </li>
      )}
    </ul>
  );
}

// -------------------------------------------------------------
// ABOUT US PAGE
// -------------------------------------------------------------
export function AboutPage() {
  const st = useSettings();
  usePageMeta('About SparkleClean Pro', 'Learn about our team, standards, eco-friendly philosophy, and cleaning guarantees.');

  return (
    <>
      <Hero
        badge="About SparkleClean Pro"
        h1="Setting the Standard in Clean Living & Working Spaces"
        sub="We founded SparkleClean Pro with a singular conviction: home and office cleaning should be dependable, non-toxic, and executed to perfection every single time."
      />

      {/* Story & Philosophy */}
      <section className="section">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="text-brand font-semibold text-sm tracking-wide uppercase">Our Story</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Built on Trust, Attention to Detail & Green Science</h2>
            <div className="mt-6 space-y-4 text-slate-700 leading-relaxed text-base">
              <p>
                Too many property owners have experienced the frustration of inconsistent cleaners, missed baseboards, toxic chemical fumes, and broken promises. SparkleClean Pro was born to replace uncertainty with certified excellence.
              </p>
              <p>
                From day one, we committed to a 100% green standard. We use hospital-grade HEPA filtration and plant-derived, biodegradable formulas that effectively sanitize surfaces without leaving harsh volatile organic compounds (VOCs) that irritate children, pets, or allergy sufferers.
              </p>
              <p>
                Today, our team cleans over 1,500 residential and commercial spaces across the metropolitan area, maintaining a 99.4% client satisfaction rating and an unwavering 24-hour satisfaction guarantee.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/book-cleaning" className="btn btn-primary">Book an Appointment</Link>
              <Link to="/why-choose-us" className="btn btn-ghost">Our 50-Point Standard</Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/images/cleaning-team.jpg"
                alt="SparkleClean Pro cleaner thoroughly sanitizing kitchen island"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-navy-900 text-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block">
              <p className="text-2xl font-extrabold text-brand-100">100%</p>
              <p className="text-xs text-slate-300 mt-1 font-medium">Satisfaction Guaranteed. If it’s not right, we re-clean within 24 hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-brand font-semibold text-sm tracking-wide uppercase">Core Pillars</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">What We Stand For</h2>
            <p className="mt-3 text-slate-600">Our values guide every vacuum pass, kitchen degreasing, and client interaction.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [ShieldCheck, 'Integrity & Security', 'All cleaners undergo criminal background checks, in-person interviews, and continuous supervision.'],
              [Sparkles, 'Eco-Friendly Health', 'Zero chlorine bleach, zero harsh synthetic fumes. Pure plant-derived power safe for all occupants.'],
              [Clock, 'Punctuality & Reliability', 'We arrive on time, respect your schedule, and follow systematic checklists to ensure no detail is skipped.'],
              [HeartHandshake, '100% Client Care', 'Transparent billing, responsive customer support, and an ironclad 24-hour free re-clean guarantee.']
            ].map(([Icon, title, desc]) => (
              <div key={title} className="card !p-6">
                <div className="p-3 bg-white text-brand rounded-xl w-fit shadow-sm mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff & Equipment Standards */}
      <section className="section">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/service-deep.jpg"
                alt="Bathroom descaling"
                className="rounded-2xl object-cover aspect-square shadow-md"
              />
              <img
                src="/images/service-office.jpg"
                alt="Office cleaning"
                className="rounded-2xl object-cover aspect-square shadow-md mt-6"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-brand font-semibold text-sm tracking-wide uppercase">Professional Protocols</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Equipment That Makes a Measurable Difference</h2>
            <div className="mt-6 space-y-4 text-slate-700 text-sm leading-relaxed">
              <div className="flex gap-3">
                <CheckCircle2 className="text-brand shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-navy-900 text-base">Hospital-Grade HEPA Filtration</h4>
                  <p className="mt-1 text-slate-600">Our commercial vacuums trap 99.97% of airborne dust, pollen, and pet dander down to 0.3 microns rather than blowing them back into your rooms.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="text-brand shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-navy-900 text-base">Color-Coded Microfiber System</h4>
                  <p className="mt-1 text-slate-600">Separate microfiber cloths for bathrooms, kitchens, and living areas guarantee zero cross-contamination between rooms.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="text-brand shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-navy-900 text-base">40+ Hours of Supervised Training</h4>
                  <p className="mt-1 text-slate-600">Every cleaner trains on delicate marble, hardwood finishing, granite sealing, and high-end stainless steel care before ever entering a client property.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// -------------------------------------------------------------
// PRICING & PACKAGES PAGE
// -------------------------------------------------------------
export function PricingPage() {
  usePageMeta('Transparent Cleaning Quotations & Packages | SparkleClean Pro', 'View our honest, upfront cleaning service packages and request a tailored quote for your home or commercial office.');

  const plans = [
    {
      name: 'Standard Home Clean',
      slug: 'home-cleaning',
      badge: 'Most Popular for Homes',
      summary: 'Ideal for recurring upkeep of apartments, lofts, and family homes.',
      quoteBasis: 'Quoted per visit based on bedroom & bathroom layout',
      features: [
        'Dusting all reachable surfaces & shelves',
        'HEPA vacuuming of carpets & rugs',
        'Sweeping & damp mopping hard floors',
        'Full bathroom cleaning & sanitizing',
        'Kitchen counters, sink, & stovetop degreasing',
        'Trash collection & bin relining'
      ]
    },
    {
      name: 'Intensive Deep Clean',
      slug: 'deep-cleaning',
      badge: 'Best for First Visit',
      summary: 'Top-to-bottom reset for homes not professionally cleaned in 3+ months.',
      quoteBasis: 'Priced per property after square footage & condition review',
      features: [
        'Everything in Standard Home Clean',
        'Hand-wiping all baseboards & door frames',
        'Tile grout descaling & shower glass scrub',
        'Heavy stove & range hood grease removal',
        'Ceiling fans & air vent detail dusting',
        'Behind & under light furniture cleaning'
      ]
    },
    {
      name: 'Move-In / Move-Out Clean',
      slug: 'move-in-out-cleaning',
      badge: '100% Deposit Guarantee',
      summary: 'End-of-tenancy clean designed to satisfy strict landlord inspections.',
      quoteBasis: 'Fixed-scope quote covering all interior cabinets & appliances',
      features: [
        'Complete inside cabinet & drawer cleaning',
        'Interior oven & refrigerator scrub',
        'Wall scuff mark & switch plate wipedown',
        'Inside all closets & shelf wipedown',
        'Window sills, tracks & frames',
        'Complimentary 24-hr re-clean if landlord has notes'
      ]
    }
  ];

  return (
    <>
      <Hero
        badge="Transparent Quotations"
        h1="Clear, Honest Service Packages with No Hidden Fees"
        sub="Choose the level of cleaning you need. Every package includes verified bonded staff, eco-friendly green supplies, and commercial HEPA equipment."
      />

      {/* Plans Grid */}
      <section className="section">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className="card relative flex flex-col justify-between !p-8 border-2 hover:border-brand transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              {p.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-md">
                  {p.badge}
                </span>
              )}
              <div>
                <h3 className="text-2xl font-extrabold text-navy-900">{p.name}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.summary}</p>
                
                <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                  <p className="text-xs font-bold text-brand">{p.quoteBasis}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Written quotation · All supplies & labor included</p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">What’s Included:</p>
                  <ul className="space-y-2.5 text-sm text-slate-700">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={16} className="text-brand shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link
                  to={`/get-a-quote?service=${p.slug}`}
                  className="btn btn-primary w-full text-center"
                >
                  Request Quote for This Package →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Custom Callout */}
        <div className="mt-12 rounded-3xl bg-navy-900 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-100">Business & Facility Care</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Commercial & Office Cleaning Contracts</h3>
            <p className="mt-2 text-blue-100 text-sm max-w-xl">
              Flexible daily, weekly, or evening schedules for corporate offices, medical clinics, and retail storefronts. Includes custom scope, itemized invoicing, and dedicated supervisor.
            </p>
          </div>
          <Link to="/get-a-quote?service=office-cleaning" className="btn btn-primary whitespace-nowrap shadow-lg">
            Request Commercial Walkthrough
          </Link>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Package Feature Comparison</h2>
            <p className="mt-2 text-slate-600 text-sm">See exactly how our standard, deep, and move-out cleans compare side by side.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-navy-900">Cleaning Task</th>
                  <th className="p-4 font-bold text-navy-900 text-center">Standard</th>
                  <th className="p-4 font-bold text-navy-900 text-center">Deep Clean</th>
                  <th className="p-4 font-bold text-navy-900 text-center">Move-Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  ['HEPA vacuuming all rugs & carpets', true, true, true],
                  ['Sweeping and mopping all hard floors', true, true, true],
                  ['Sanitizing sinks, faucets & counters', true, true, true],
                  ['Cleaning bathroom toilets, tubs & showers', true, true, true],
                  ['Emptying trash & replacing liners', true, true, true],
                  ['Hand-wiping baseboards & door frames', false, true, true],
                  ['Descaling hard water buildup on shower glass', false, true, true],
                  ['Deep stovetop & range hood degreasing', false, true, true],
                  ['Detailing air vents, switch plates & high dusting', false, true, true],
                  ['Cleaning interior kitchen cabinets & drawers', false, false, true],
                  ['Interior oven and refrigerator deep clean', false, false, true],
                  ['Closet shelves & window tracks wiped', false, false, true],
                  ['24-Hour Landlord Inspection Guarantee', false, false, true]
                ].map(([task, std, deep, move]) => (
                  <tr key={task} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-navy-900">{task}</td>
                    <td className="p-4 text-center">{std ? <Check size={18} className="text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
                    <td className="p-4 text-center">{deep ? <Check size={18} className="text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
                    <td className="p-4 text-center">{move ? <Check size={18} className="text-emerald-600 mx-auto" /> : <span className="text-slate-300">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="section max-w-3xl">
        <h2 className="text-2xl font-bold text-navy-900 text-center mb-8">Pricing Questions & Answers</h2>
        <Faqs
          items={[
            { q: 'Are there any hidden travel or supply fees?', a: 'None. Our quotes include all labor, eco-friendly cleaning formulas, and commercial equipment. Parking fees apply only if no free visitor parking is available on-site.' },
            { q: 'Can I cancel or reschedule my appointment?', a: 'Yes. You can cancel or reschedule free of charge up to 24 hours before your scheduled appointment time.' },
            { q: 'Do you charge by the hour or flat-rate?', a: 'Most residential cleans are flat-rate based on bedrooms and bathrooms, so you know the exact price beforehand even if the job takes our crew longer.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, bank transfers, and corporate invoicing for business accounts.' }
          ]}
        />
      </section>
    </>
  );
}

// -------------------------------------------------------------
// WHY CHOOSE US & GUARANTEE PAGE
// -------------------------------------------------------------
export function WhyChooseUsPage() {
  usePageMeta('Why Choose Us & Our 100% Clean Guarantee', 'Discover our 50-point cleaning checklist, vetted staff protocol, and 24-hour satisfaction guarantee.');

  return (
    <>
      <Hero
        badge="Our Guarantee"
        h1="Why Over 1,500 Homes and Offices Trust SparkleClean Pro"
        sub="We hold ourselves to a standard that leaves nothing to chance. Discover our 50-point cleaning checklist, stringent background vetting, and ironclad 24-hour guarantee."
      />

      {/* 100% Guarantee Banner */}
      <section className="section !pb-4">
        <div className="rounded-3xl bg-gradient-to-r from-brand-50 to-blue-50 border-2 border-brand/20 p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <div className="inline-flex p-4 rounded-full bg-brand text-white mb-4 shadow-lg shadow-brand/20">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-navy-900">Our 100% Clean Guarantee</h2>
          <p className="mt-4 text-slate-700 text-base max-w-2xl mx-auto leading-relaxed">
            If you ever find an area or surface that does not meet our high standards, simply let us know within <strong>24 hours</strong> of your appointment. We will dispatch a senior technician to re-clean that specific area completely free of charge. No debates, no hassle.
          </p>
        </div>
      </section>

      {/* The 50-Point Checklist */}
      <section className="section">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand font-semibold text-sm tracking-wide uppercase">Methodology</span>
          <h2 className="text-3xl font-extrabold text-navy-900 mt-1">Our 50-Point Room-by-Room Standard</h2>
          <p className="mt-3 text-slate-600">Every home visit follows our comprehensive inspection framework.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card !p-6 border-l-4 border-l-brand">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-brand" size={22} />
              <h3 className="text-xl font-bold text-navy-900">Kitchen Checklist</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {[
                'Degrease range hood exterior and stovetop burners',
                'Scrub, sanitize and polish sink basin and faucet',
                'Wipe countertop perimeter and backsplash grout',
                'Clean appliance exteriors (refrigerator, microwave, dishwasher)',
                'Clean inside microwave ceiling and turntable',
                'Wipe down cabinet doors and hardware handles',
                'Empty waste bins and replace liners',
                'Vacuum and damp-mop tile or hardwood floors'
              ].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <Check size={16} className="text-brand shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card !p-6 border-l-4 border-l-brand">
            <div className="flex items-center gap-2 mb-4">
              <SprayCan className="text-brand" size={22} />
              <h3 className="text-xl font-bold text-navy-900">Bathroom Checklist</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {[
                'Descale shower tiles, shower head, and sliding glass',
                'Scrub, disinfect and polish bathtub surface',
                'Disinfect toilet bowl interior, seat, base, and flush handle',
                'Clean vanity counters, mirrors, and chrome fixtures',
                'Sanitize soap dispensers and toothbrush holders',
                'Dust exhaust fan vent covers and light fixtures',
                'Vacuum bathroom mats and mop tile with disinfectant',
                'Restock and neatly fold fresh towels upon request'
              ].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <Check size={16} className="text-brand shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card !p-6 border-l-4 border-l-brand">
            <div className="flex items-center gap-2 mb-4">
              <HomeIcon className="text-brand" size={22} />
              <h3 className="text-xl font-bold text-navy-900">Living Areas & Bedrooms</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {[
                'Dust all accessible surfaces, nightstands, and consoles',
                'HEPA vacuum upholstery, couches, and underneath cushions',
                'Dust ceiling fans, high crown moldings, and blinds',
                'Wipe all interior door handles and light switch plates',
                'Neatly arrange throw pillows and make beds',
                'Edge-to-edge vacuuming along baseboards',
                'Damp-mop hardwood, tile, and laminate floors with neutral cleaner'
              ].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <Check size={16} className="text-brand shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card !p-6 border-l-4 border-l-brand">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-brand" size={22} />
              <h3 className="text-xl font-bold text-navy-900">Staff Screening & Safety</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {[
                'Comprehensive federal & state criminal background checks',
                'In-person multi-stage practical cleaning evaluation',
                'Fully bonded and insured under comprehensive liability',
                'Signed non-disclosure & strict client privacy agreements',
                'Color-coded microfiber cross-contamination protocol',
                'Eco-friendly non-toxic supplies with zero harmful vapors',
                'Continuous supervisor spot checks and quality audits'
              ].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <Check size={16} className="text-brand shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-navy-900 py-16 text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-white">Experience the Difference for Yourself</h2>
          <p className="mt-3 text-blue-100 max-w-xl mx-auto">Book your first cleaning today and enjoy a spotless space backed by our 24-hour guarantee.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/book-cleaning" className="btn btn-primary">Book a Cleaning</Link>
            <Link to="/pricing" className="btn btn-outline">Check Pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}

// -------------------------------------------------------------
// SERVICES & SERVICE DETAIL
// -------------------------------------------------------------
export function Services() {
  const { data, loading } = useApi('/public/services');
  const [cat, setCat] = useState('all');
  usePageMeta('Cleaning Services | Residential, Commercial & Specialist', 'Browse all professional cleaning services offered by SparkleClean Pro.');

  const filtered = (data || []).filter((s) => (cat === 'all' ? true : s.category === cat));

  return (
    <>
      <Hero
        badge="Professional Services"
        h1="Our Cleaning Services"
        sub="Comprehensive residential, commercial, and specialty cleaning backed by our 50-point standard and 100% satisfaction guarantee."
      />
      <div className="section">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[['all', 'All Services'], ['residential', 'Residential'], ['commercial', 'Commercial'], ['specialist', 'Specialist Care']].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                cat === k ? 'bg-brand text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <ServiceCard key={s.slug} s={s} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function ServiceDetail() {
  const { slug } = useParams();
  const { data: s, loading, error } = useApi(`/public/services/${slug}`);
  const { data: all } = useApi('/public/services');
  const { data: areas } = useApi('/public/areas');
  usePageMeta(s?.metaTitle || (s && s.name), s?.metaDescription || s?.summary);

  if (loading) return <Loading />;
  if (error === 'notfound' || !s) return <Missing />;
  const related = (all || []).filter((x) => s.relatedServices?.includes(x.slug));
  const rareas = (areas || []).filter((a) => s.areas?.includes(a.slug) || a.services?.includes(s.slug));

  return (
    <>
      <Breadcrumbs items={[['/services', 'Services'], [null, s.name]]} />
      <Hero badge={`Category: ${s.category}`} h1={s.name} sub={s.summary}>
        <Ctas />
      </Hero>
      <div className="section grid gap-10 lg:grid-cols-3">
        <article className="lg:col-span-2 space-y-10">
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg bg-slate-100">
            <img
              src={s.heroImage || '/images/service-home.jpg'}
              alt={s.heroImageAlt || s.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">About This Service</h2>
            <div className="mt-4 text-slate-700 leading-relaxed text-base space-y-4">
              <Paragraphs text={s.content} />
            </div>
          </div>

          {s.inclusions?.length > 0 && (
            <div className="rounded-2xl bg-brand-50 p-6 border border-brand/20">
              <h2 className="text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-brand" size={22} /> What’s Included in Every Visit
              </h2>
              <Checklist items={s.inclusions} />
            </div>
          )}

          {s.suitableFor?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">Who This Service is Best For</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {s.suitableFor.map((x) => (
                  <div key={x} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                    <Check size={16} className="text-brand shrink-0" />
                    <span>{x}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {s.process?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-4">Step-by-Step Cleaning Process</h2>
              <ol className="space-y-3">
                {s.process.map((p, i) => (
                  <li key={p} className="flex gap-4 items-start card !p-4">
                    <span className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700 font-medium pt-1">{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {s.safetyNotes && (
            <div className="rounded-2xl border border-slate-200 p-5 bg-white">
              <h3 className="font-bold text-navy-900 text-base mb-1 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={20} /> Safety & Environmental Standards
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{s.safetyNotes}</p>
            </div>
          )}

          {s.priceNote && (
            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
              <h3 className="font-bold text-navy-900 text-base mb-1 flex items-center gap-2">
                <ClipboardList className="text-brand" size={20} /> Transparent Quotation Scope
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{s.priceNote}</p>
            </div>
          )}

          {s.faqs?.length > 0 && (
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy-900">Frequently Asked Questions</h2>
              <Faqs items={s.faqs} />
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="card sticky top-24">
            <h3 className="text-xl font-bold text-navy-900">Request a Free Quote</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">We confirm the price with you before any work starts.</p>
            <EnquiryForm type="quote" serviceSlug={s.slug} services={all || []} compact />
          </div>

          {related.length > 0 && (
            <div className="card">
              <h3 className="text-base font-bold text-navy-900 mb-3">Related Services</h3>
              <ul className="space-y-2 text-sm">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link className="text-brand hover:underline font-medium flex items-center gap-1.5" to={`/services/${r.slug}`}>
                      <ArrowRight size={14} /> {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rareas.length > 0 && (
            <div className="card">
              <h3 className="text-base font-bold text-navy-900 mb-3">Available In These Areas</h3>
              <ul className="space-y-2 text-sm">
                {rareas.map((r) => (
                  <li key={r.slug}>
                    <Link className="text-slate-700 hover:text-brand font-medium flex items-center gap-1.5" to={`/service-areas/${r.slug}`}>
                      <MapPin size={14} className="text-brand" /> {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// SERVICE AREAS & AREA DETAIL
// -------------------------------------------------------------
export function Areas() {
  const { data, loading } = useApi('/public/areas');
  usePageMeta('Service Areas | SparkleClean Pro', 'View the metropolitan areas and suburban neighborhoods where we provide cleaning services.');

  return (
    <>
      <Hero
        badge="Local Coverage"
        h1="Areas We Serve"
        sub="Punctual, professional residential and commercial cleaning services across key metropolitan districts."
      />
      <div className="section">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {data?.map((a) => (
              <Link
                key={a.slug}
                to={`/service-areas/${a.slug}`}
                className="card group overflow-hidden !p-0 transition hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={a.heroImage || '/images/area-downtown.jpg'}
                    alt={a.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand transition-colors flex items-center gap-2">
                    <MapPin className="text-brand" size={20} /> {a.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.intro}</p>
                  <p className="mt-3 text-xs font-semibold text-brand">Explore local services & coverage →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function AreaDetail() {
  const { slug } = useParams();
  const { data: a, loading, error } = useApi(`/public/areas/${slug}`);
  const { data: svcs } = useApi('/public/services');
  const { data: areas } = useApi('/public/areas');
  usePageMeta(a?.metaTitle || (a && `Cleaning Services in ${a.name}`), a?.metaDescription || a?.intro);

  if (loading) return <Loading />;
  if (error === 'notfound' || !a) return <Missing />;
  const here = (svcs || []).filter((s) => a.services?.includes(s.slug));
  const near = (areas || []).filter((x) => a.nearbyAreas?.includes(x.slug));

  return (
    <>
      <Breadcrumbs items={[['/service-areas', 'Service Areas'], [null, a.name]]} />
      <Hero badge="Local Coverage Area" h1={`Cleaning Services in ${a.name}`} sub={a.intro}>
        <Ctas />
      </Hero>
      <div className="section grid gap-10 lg:grid-cols-3">
        <article className="lg:col-span-2 space-y-8">
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg bg-slate-100">
            <img
              src={a.heroImage || '/images/area-downtown.jpg'}
              alt={a.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-900">Local Service Overview</h2>
            <div className="mt-4 text-slate-700 leading-relaxed text-base space-y-4">
              <Paragraphs text={a.localContent} />
            </div>
          </div>

          {a.coverageNote && (
            <div className="rounded-2xl bg-brand-50 p-5 border border-brand/20">
              <h3 className="font-bold text-navy-900 text-base mb-1 flex items-center gap-2">
                <MapPin className="text-brand" size={18} /> Coverage Boundaries
              </h3>
              <p className="text-sm text-slate-600 mt-1">{a.coverageNote}</p>
            </div>
          )}

          {here.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Services Available in {a.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {here.map((s) => (
                  <ServiceCard key={s.slug} s={s} />
                ))}
              </div>
            </div>
          )}

          {a.faqs?.length > 0 && (
            <div>
              <h2 className="mb-4 text-2xl font-bold text-navy-900">Local Questions for {a.name}</h2>
              <Faqs items={a.faqs} />
            </div>
          )}

          {near.length > 0 && (
            <div className="rounded-2xl bg-slate-50 p-5 text-sm">
              <span className="font-semibold text-navy-900">We also serve adjacent areas: </span>
              {near.map((n, i) => (
                <span key={n.slug}>
                  {i > 0 && ', '}
                  <Link className="text-brand hover:underline font-medium" to={`/service-areas/${n.slug}`}>
                    {n.name}
                  </Link>
                </span>
              ))}
            </div>
          )}
        </article>
        <aside className="space-y-6">
          <div className="card sticky top-24">
            <h3 className="text-xl font-bold text-navy-900">Get a Quote in {a.name}</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Fast local quotes with transparent rates.</p>
            <EnquiryForm type="quote" areaSlug={a.slug} services={svcs || []} compact />
          </div>
        </aside>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// GALLERY PAGE
// -------------------------------------------------------------
export function Gallery() {
  const { data, loading } = useApi('/public/gallery');
  const [filter, setFilter] = useState('all');
  usePageMeta('Project Gallery | Real Cleaning Results', 'Browse photos of our residential, deep clean, and commercial projects.');

  const items = data || [];
  const filtered = filter === 'all' ? items : items.filter((x) => x.serviceSlug === filter);

  return (
    <>
      <Hero
        badge="Real Work Showcase"
        h1="Project Gallery"
        sub="Browse high-resolution photographs from our residential deep cleans, apartment resets, and commercial office contracts."
      />
      <div className="section">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            ['all', 'All Projects'],
            ['home-cleaning', 'Home Cleaning'],
            ['deep-cleaning', 'Deep Cleaning'],
            ['move-in-out-cleaning', 'Move-Out Cleans'],
            ['office-cleaning', 'Commercial Offices'],
            ['carpet-upholstery-cleaning', 'Carpet & Upholstery'],
            ['window-glass-cleaning', 'Windows & Glass']
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                filter === k ? 'bg-brand text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((g) => (
              <figure key={g._id} className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-lg transition">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={g.image}
                    alt={g.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {g.caption && (
                  <figcaption className="p-4 text-xs sm:text-sm font-medium text-navy-900 border-t border-slate-100">
                    {g.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// -------------------------------------------------------------
// REVIEWS & TESTIMONIALS PAGE
// -------------------------------------------------------------
export function Reviews() {
  const { data, loading } = useApi('/public/testimonials');
  usePageMeta('Client Reviews & Satisfaction Standards | SparkleClean Pro', 'Learn about our client satisfaction standards and read verified customer experiences.');

  return (
    <>
      <Hero
        badge="Client Feedback"
        h1="Verified Customer Experiences"
        sub="Read feedback shared by homeowners and commercial managers who trust SparkleClean Pro with their spaces."
      />
      <div className="section">
        {loading ? (
          <Loading />
        ) : (data || []).length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((r) => (
              <figure key={r._id} className="card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <StarRating rating={5} size={16} />
                    {r.source && <span className="text-[11px] font-semibold text-slate-400">{r.source}</span>}
                  </div>
                  <blockquote className="mt-4 text-sm text-slate-700 leading-relaxed italic">
                    “{r.text}”
                  </blockquote>
                </div>
                <figcaption className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-navy-900 text-sm">{r.name}</p>
                    {r.location && <p className="text-xs text-slate-500">{r.location}</p>}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={12} /> Verified Client
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-navy-900">Our Genuine Feedback Policy</h2>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              We stand for 100% honesty. We never publish fabricated testimonials or unverified third-party ratings. All reviews published here come directly from verified residential and commercial clients who have granted permission to share their experience.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Have you recently experienced a cleaning by SparkleClean Pro? We welcome your thoughts!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary text-xs sm:text-sm">
                Share Your Feedback
              </Link>
              <Link to="/get-a-quote" className="btn btn-ghost text-xs sm:text-sm">
                Request a Cleaning Quote
              </Link>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-navy-900">Ready for a Spotless Space?</h3>
          <p className="text-slate-600 text-sm mt-2">Experience our 50-point cleaning standard and 24-hour guarantee.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/book-cleaning" className="btn btn-primary">Book Your Clean</Link>
            <Link to="/contact" className="btn btn-ghost">Contact Us</Link>
          </div>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// BLOG & BLOG POST
// -------------------------------------------------------------
export function Blog() {
  const { data, loading } = useApi('/public/blog');
  usePageMeta('Cleaning Tips, Checklists & Guides | SparkleClean Pro', 'Expert advice on deep cleaning, move-out inspections, stain removal, and eco-friendly home care.');

  return (
    <>
      <Hero
        badge="Advice & Checklists"
        h1="Cleaning Guides & Insights"
        sub="Practical cleaning tips, landlord checklist guides, and sustainable home care advice from our professional technicians."
      />
      <div className="section">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {(data || []).map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="card group overflow-hidden !p-0 transition hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={p.heroImage || '/images/blog-moveout.jpg'}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold text-brand uppercase tracking-wider">
                    {p.author || 'SparkleClean Team'} · {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Article'}
                  </p>
                  <h2 className="text-xl font-bold text-navy-900 group-hover:text-brand transition-colors mt-2">{p.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                    Read Guide <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const { data: p, loading, error } = useApi(`/public/blog/${slug}`);
  const { data: svcs } = useApi('/public/services');
  usePageMeta(p?.metaTitle || p?.title, p?.metaDescription || p?.excerpt);

  if (loading) return <Loading />;
  if (error === 'notfound' || !p) return <Missing />;
  const rel = (svcs || []).filter((s) => p.relatedServices?.includes(s.slug));

  return (
    <>
      <Breadcrumbs items={[['/blog', 'Blog'], [null, p.title]]} />
      <article className="section max-w-3xl">
        <span className="text-xs font-bold text-brand uppercase tracking-wider">Expert Guide</span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 mt-2 leading-tight">{p.title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          By {p.author || 'SparkleClean Team'} · {p.publishedAt && new Date(p.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
        </p>

        {p.heroImage && (
          <div className="my-8 aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg">
            <img src={p.heroImage} alt={p.heroImageAlt || p.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="text-slate-700 leading-relaxed text-base space-y-4 border-t border-slate-100 pt-6">
          <Paragraphs text={p.content} />
        </div>

        {rel.length > 0 && (
          <div className="mt-12 rounded-3xl bg-brand-50 p-6 sm:p-8 border border-brand/20">
            <h3 className="font-bold text-navy-900 text-lg">Need Professional Help with This?</h3>
            <p className="text-sm text-slate-600 mt-1">Our certified team handles the heavy lifting so you don’t have to.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {rel.map((s) => (
                <Link key={s.slug} className="btn btn-primary text-xs" to={`/services/${s.slug}`}>
                  Book {s.name} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

// -------------------------------------------------------------
// FAQS PAGE
// -------------------------------------------------------------
export function FaqsPage() {
  const { data } = useApi('/public/services');
  usePageMeta('Frequently Asked Questions | SparkleClean Pro', 'Find answers to common questions regarding booking, cleaning products, cancellations, and guarantees.');

  const generalFaqs = [
    { q: 'How do I book an appointment?', a: 'You can book directly through our online booking page, request a quotation, or call our team. We confirm the appointment and send email/SMS confirmation.' },
    { q: 'Do I need to supply any equipment or cleaning products?', a: 'No! Our specialists arrive with hospital-grade HEPA vacuum cleaners, microfiber mops, and non-toxic, eco-friendly cleaning formulations.' },
    { q: 'What is your 24-hour guarantee?', a: 'If you are dissatisfied with any area cleaned, contact us within 24 hours of your appointment and we will send a technician to re-clean that specific spot free of charge.' },
    { q: 'Are your cleaners bonded and insured?', a: 'Yes. All our cleaners undergo strict criminal background vetting, in-person training, and are fully insured against accidental property damage.' },
    { q: 'What is your cancellation policy?', a: 'You can reschedule or cancel any appointment with no fee up to 24 hours prior to the scheduled service.' }
  ];

  return (
    <>
      <Hero
        badge="Got Questions?"
        h1="Frequently Asked Questions"
        sub="Everything you need to know about our services, safety standards, pricing, and 100% clean guarantee."
      />
      <div className="section max-w-3xl space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">General & Booking Questions</h2>
          <Faqs items={generalFaqs} />
        </div>

        {(data || []).filter((s) => s.faqs?.length).map((s) => (
          <div key={s.slug}>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">{s.name} FAQs</h2>
            <Faqs items={s.faqs} />
          </div>
        ))}
      </div>
    </>
  );
}

// -------------------------------------------------------------
// CONTACT PAGE
// -------------------------------------------------------------
export function Contact() {
  const { data: svcs } = useApi('/public/services');
  const s = useSettings();
  usePageMeta('Contact SparkleClean Pro', 'Get in touch with our team via phone, WhatsApp, or email to schedule a cleaning or request a custom quote.');

  return (
    <>
      <Hero
        badge="We’re Here to Help"
        h1="Contact Our Cleaning Team"
        sub="Call, message on WhatsApp, or send an enquiry. Our local coordinators respond promptly to confirm availability and quotes."
      />
      <div className="section grid gap-10 lg:grid-cols-2 items-start">
        <div className="space-y-6">
          <div className="card !p-8">
            <h2 className="text-2xl font-bold text-navy-900">Direct Contact Information</h2>
            <p className="text-sm text-slate-600 mt-1 mb-6">Our phone lines and WhatsApp desk are open Monday through Saturday.</p>
            <ContactLines />
            {s.openingHours && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">Business Operating Hours</span>
                <p className="text-sm text-slate-600 mt-1">{s.openingHours}</p>
              </div>
            )}
          </div>

          <div className="card !p-6 bg-brand-50 border-brand/20">
            <h3 className="font-bold text-navy-900 text-base mb-2 flex items-center gap-2">
              <ShieldCheck className="text-brand" size={20} /> Guaranteed Quick Response
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enquiries submitted during business hours receive an estimate and time availability within 30 minutes.
            </p>
          </div>
        </div>

        <div className="card !p-8 shadow-md">
          <h2 className="text-2xl font-bold text-navy-900">Send an Enquiry</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">Tell us about your space and preferred date</p>
          <EnquiryForm type="contact" services={svcs || []} />
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// FORM PAGE (BOOKING / QUOTE)
// -------------------------------------------------------------
export function FormPage({ type }) {
  const { data: svcs } = useApi('/public/services');
  const t = type === 'booking'
    ? ['Book a Cleaning Service', 'Select your desired service, date, and details. We will confirm your time slot promptly.']
    : ['Request a Free Quote', 'Provide property details and scope. We will prepare an upfront quotation with zero obligation.'];

  usePageMeta(t[0], t[1]);

  return (
    <>
      <Hero badge={type === 'booking' ? 'Easy Scheduling' : 'No Obligation'} h1={t[0]} sub={t[1]} />
      <div className="section max-w-2xl">
        <div className="card !p-8 shadow-lg">
          <EnquiryForm type={type} services={svcs || []} />
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// PRIVACY POLICY & TERMS PAGES
// -------------------------------------------------------------
export function PrivacyPolicyPage() {
  usePageMeta('Privacy Policy | SparkleClean Pro', 'How SparkleClean Pro protects and respects your personal information.');

  return (
    <>
      <Hero badge="Legal" h1="Privacy Policy" sub="Last Updated: October 2026. How we handle and protect your personal information." />
      <div className="section max-w-3xl text-slate-700 space-y-6 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-navy-900">1. Information We Collect</h2>
        <p>When you request a quote, book a cleaning, or contact us, we collect basic contact information including your full name, telephone number, email address, physical service address, and specific instructions relating to your property.</p>

        <h2 className="text-xl font-bold text-navy-900">2. How We Use Your Information</h2>
        <p>We use your information exclusively to: (a) schedule and coordinate cleaning visits; (b) provide accurate pricing estimates; (c) communicate appointment reminders; and (d) process service payments and quality follow-ups.</p>

        <h2 className="text-xl font-bold text-navy-900">3. Non-Disclosure & Data Protection</h2>
        <p>We never sell, trade, or rent client personal data to third parties. Customer contact details are accessible strictly by authorized scheduling personnel and assigned cleaning staff for the purpose of completing your visit.</p>

        <h2 className="text-xl font-bold text-navy-900">4. Payment Security</h2>
        <p>Credit card transactions are processed through encrypted, PCI-compliant payment gateways. We do not store raw credit card numbers on our local web servers.</p>

        <h2 className="text-xl font-bold text-navy-900">5. Contact Information</h2>
        <p>If you have any questions or wish to request data deletion, contact our privacy desk at privacy@sparklecleanpro.com.</p>
      </div>
    </>
  );
}

export function TermsConditionsPage() {
  usePageMeta('Terms & Conditions | SparkleClean Pro', 'Read the service terms, cancellation policies, and guarantee details for SparkleClean Pro.');

  return (
    <>
      <Hero badge="Service Agreement" h1="Terms and Conditions" sub="Last Updated: October 2026. Standard policies governing our cleaning appointments." />
      <div className="section max-w-3xl text-slate-700 space-y-6 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-navy-900">1. Service Scope & Quotations</h2>
        <p>All cleaning appointments are conducted according to the confirmed scope and package selected (Standard Home Clean, Deep Clean, Move-In/Out, or Commercial). Scope adjustments requested on-site will be discussed and agreed upon before work begins.</p>

        <h2 className="text-xl font-bold text-navy-900">2. 24-Hour Satisfaction Guarantee</h2>
        <p>We take pride in our work. If any surface included in your service scope was not cleaned to your satisfaction, notify our management within 24 hours of service completion, and we will send a technician to re-clean the disputed area at no charge.</p>

        <h2 className="text-xl font-bold text-navy-900">3. Cancellations & Rescheduling</h2>
        <p>You may reschedule or cancel appointments free of charge up to 24 hours prior to the scheduled start time. Cancellations made with less than 24 hours notice may be subject to a nominal cancellation fee.</p>

        <h2 className="text-xl font-bold text-navy-900">4. Property Access & Utilities</h2>
        <p>Clients agree to provide safe access to the property at the scheduled appointment time. Working electricity and hot water must be available on-site for equipment operation.</p>

        <h2 className="text-xl font-bold text-navy-900">5. Liability & Breakage</h2>
        <p>SparkleClean Pro is fully bonded and insured. In the rare event of accidental property damage caused by our staff, notice must be given within 24 hours. Our insurance covers certified claims subject to standard policy conditions.</p>
      </div>
    </>
  );
}
