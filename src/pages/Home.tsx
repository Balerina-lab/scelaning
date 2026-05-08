import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, Star, Shield, Sparkles, ChevronDown, Menu, X, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

type CleaningType = 'general' | 'deep' | 'move_out' | 'office';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  rooms: number;
  sqft: number;
  cleaning_type: CleaningType;
  preferred_date: string;
  preferred_time: string;
  special_requests: string;
}

const TIME_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const CLEANING_TYPES: { value: CleaningType; label: string; coefficient: number }[] = [
  { value: 'general', label: 'Splošno čiščenje', coefficient: 0.08 },
  { value: 'deep', label: 'Globinsko čiščenje', coefficient: 0.14 },
  { value: 'move_out', label: 'Čiščenje ob odhodu', coefficient: 0.18 },
  { value: 'office', label: 'Pisarniško čiščenje', coefficient: 0.1 },
];

function estimatePrice(rooms: number, sqft: number, type: CleaningType): { min: number; max: number } | null {
  if (!rooms || !sqft) return null;
  const typeConfig = CLEANING_TYPES.find(t => t.value === type)!;
  const base = 25 + rooms * 8;
  const area = sqft * typeConfig.coefficient;
  const mid = base + area;
  return {
    min: Math.round(mid * 0.85),
    max: Math.round(mid * 1.15),
  };
}

function SCleaningLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const heightClass = size === 'sm' ? 'h-10' : size === 'lg' ? 'h-24' : 'h-12';
  return (
    <div className="flex items-center">
      <img src="/SCleaning-logo.png" alt="S Cleaning Logo" className={`${heightClass} object-contain`} />
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { user } = useAuth();
  const navLinks = [
    { href: '#about', label: 'O nas' },
    { href: '#services', label: 'Storitve' },
    { href: '#booking', label: 'Rezervacija' },
    { href: '#contact', label: 'Kontakt' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-500 shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <SCleaningLogo size="sm" />
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="text-white/80 hover:text-teal-400 font-semibold text-sm tracking-wide transition-colors duration-200">
              {l.label}
            </a>
          ))}
          {user ? (
            <Link to="/profile" className="text-white/80 hover:text-teal-400 font-bold text-sm transition-colors flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-teal-400/20 text-teal-400 flex items-center justify-center font-black">
                {user.email?.charAt(0)?.toUpperCase()}
              </span>
              Profil
            </Link>
          ) : (
            <Link to="/login" className="text-white/80 hover:text-teal-400 font-semibold text-sm transition-colors">
              Prijava
            </Link>
          )}
          <a href="#booking" className="bg-teal-400 hover:bg-teal-300 text-navy-500 font-bold text-sm px-5 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-teal-400/30">
            Zakazivanje
          </a>
        </nav>
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-navy-500 border-t border-navy-400 px-4 pb-4 pt-2">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-2 text-white/80 hover:text-teal-400 font-semibold text-sm transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#booking" onClick={() => setMenuOpen(false)} className="mt-3 block text-center bg-teal-400 text-navy-500 font-bold text-sm px-5 py-2 rounded-full">
            Zakazivanje
          </a>
          {user ? (
            <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-2 text-teal-400 font-bold text-sm transition-colors">
              Moj Profil
            </Link>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-white/80 hover:text-teal-400 font-semibold text-sm transition-colors">
              Prijava / Registracija
            </Link>
          )}
          <a href="#booking" onClick={() => setMenuOpen(false)} className="mt-3 block text-center bg-teal-400 text-navy-500 font-bold text-sm px-5 py-2 rounded-full">
            Zakazivanje
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen bg-navy-500 flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #1ABC9C 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }} />
      </div>
      {/* Gradient overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/5 rounded-full blur-2xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-400/10 border border-teal-400/30 rounded-full px-4 py-2 mb-6">
              <Sparkles size={14} className="text-teal-400" />
              <span className="text-teal-400 text-sm font-semibold">Profesionalne čistilne storitve</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Profesionalno čiščenje za <span className="text-teal-400">vaš dom</span> in <span className="text-teal-400">poslovni prostor</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
              Zaupajte čiščenje vašega prostora strokovnjakinjam. S Cleaning zagotavlja brezhibno čistoč, prilagojeno točno vašim potrebam – z zanesljivostjo in osebnim pristopom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking" className="inline-flex items-center justify-center gap-2 bg-teal-400 hover:bg-teal-300 text-navy-500 font-extrabold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-teal-400/40 hover:-translate-y-0.5">
                <Sparkles size={18} />
                Zakazivanje Termina
              </a>
              <a href="#about" className="inline-flex items-center justify-center gap-2 border-2 border-white/20 hover:border-teal-400/60 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:bg-teal-400/5">
                Več o nas
                <ChevronDown size={18} />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6">
              {[['200+', 'Zadovoljnih strank'], ['5★', 'Povprečna ocena'], ['3 leta', 'Izkušenj']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-extrabold text-teal-400">{val}</div>
                  <div className="text-white/50 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="w-80 h-80 bg-teal-400/10 rounded-full flex items-center justify-center border border-teal-400/20">
                <div className="w-56 h-56 bg-teal-400/15 rounded-full flex items-center justify-center border border-teal-400/30">
                  <SCleaningLogo size="lg" />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <span className="text-navy-500 text-xs font-bold">5.0</span>
                </div>
                <p className="text-navy-400 text-xs mt-1">Top ocenjena storitev</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-teal-400 rounded-xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-navy-500" />
                  <span className="text-navy-500 text-xs font-bold">100% Zanesljivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={24} className="text-teal-400/60" />
      </div>
    </section>
  );
}

function About() {
  const features = [
    { icon: Shield, title: 'Zanesljivost', desc: 'Točnost in doslednost pri vsakem obisku. Vaš urnik je naš urnik.' },
    { icon: Sparkles, title: 'Osebni pristop', desc: 'Vsako čiščenje prilagodimo točno vašim željam in prostoru.' },
    { icon: Star, title: 'Kakovost', desc: 'Profesionalna sredstva in preizkušene metode za brezhibne rezultate.' },
    { icon: Clock, title: 'Fleksibilnost', desc: 'Prilagodimo se vašemu urniku – zjutraj, popoldne ali ob vikendih.' },
  ];
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-teal-400 font-bold text-sm tracking-widest uppercase">O nas</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-500 mt-3 mb-6 leading-tight">
              Čiščenje z dušo in<br /><span className="text-teal-400">strokovnim znanjem</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              S Cleaning je čistilni servis, ki ga vodi Hristina Savić s.p. – strokovnjakinja z dolgoletnimi izkušnjami in strastjo do brezhibno čistih prostorov. Verjamemo, da čist dom ali pisarna prinaša mir, produktivnost in dobro počutje.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Vsaki stranki posvečamo polno pozornost. Ne delamo po šabloni – prisluhnemo vašim željam in ustvarimo čistilni načrt, ki ustreza točno vam. Naše stranke se k nam vračajo, ker zaupajo v kakovost in diskretnost naše ekipe.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Ekološka čistila', 'Zavarovana storitev', 'Preizkušena ekipa', 'Brez skritih stroškov'].map(tag => (
                <span key={tag} className="bg-teal-50 text-teal-600 border border-teal-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all duration-200 group">
                <div className="w-10 h-10 bg-teal-400/15 rounded-xl flex items-center justify-center mb-3 group-hover:bg-teal-400/25 transition-colors">
                  <Icon size={20} className="text-teal-500" />
                </div>
                <h3 className="font-bold text-navy-500 text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      title: 'Splošno čiščenje',
      desc: 'Redno vzdrževalno čiščenje za stalno svežino vašega doma ali pisarne.',
      items: ['Pometanje in sesanje', 'Brisanje prahu', 'Čiščenje kopalnice', 'Čiščenje kuhinje'],
      price: 'Od 35€',
    },
    {
      title: 'Globinsko čiščenje',
      desc: 'Temeljito čiščenje vsakega kotička – idealno za sezonsko ali priložnostno čiščenje.',
      items: ['Vse iz splošnega', 'Čiščenje oken', 'Čiščenje pohištva', 'Dezinfekcija površin'],
      price: 'Od 65€',
      featured: true,
    },
    {
      title: 'Čiščenje ob odhodu',
      desc: 'Popolno čiščenje nepremičnine pri selitvi ali predaji najema.',
      items: ['Globinsko čiščenje', 'Čiščenje aparatov', 'Čiščenje omar', 'Poročilo o stanju'],
      price: 'Od 90€',
    },
  ];
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-teal-400 font-bold text-sm tracking-widest uppercase">Naše storitve</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-500 mt-3">Čiščenje po vaši meri</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">Izberite vrsto čiščenja, ki ustreza vašim potrebam, ali pa nas kontaktirajte za individualno ponudbo.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.title} className={`rounded-2xl p-8 border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${s.featured ? 'bg-navy-500 border-navy-400 shadow-navy-500/20 shadow-lg' : 'bg-white border-gray-100 hover:border-teal-200'}`}>
              {s.featured && (
                <div className="inline-flex items-center gap-1 bg-teal-400/20 text-teal-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  <Star size={10} className="fill-teal-400" />
                  Najpopularnejše
                </div>
              )}
              <h3 className={`text-xl font-extrabold mb-3 ${s.featured ? 'text-white' : 'text-navy-500'}`}>{s.title}</h3>
              <p className={`text-sm leading-relaxed mb-5 ${s.featured ? 'text-white/70' : 'text-gray-500'}`}>{s.desc}</p>
              <ul className="space-y-2 mb-6">
                {s.items.map(item => (
                  <li key={item} className={`flex items-center gap-2 text-sm ${s.featured ? 'text-white/80' : 'text-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${s.featured ? 'bg-teal-400/20' : 'bg-teal-100'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${s.featured ? 'bg-teal-400' : 'bg-teal-500'}`} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className={`text-2xl font-extrabold mb-4 ${s.featured ? 'text-teal-400' : 'text-navy-500'}`}>{s.price}</div>
              <a href="#booking" className={`block text-center text-sm font-bold py-3 rounded-xl transition-all duration-200 ${s.featured ? 'bg-teal-400 text-navy-500 hover:bg-teal-300' : 'border-2 border-navy-200 text-navy-500 hover:border-teal-400 hover:text-teal-500'}`}>
                Rezerviraj termin
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalendarPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const adjustedFirst = (firstDay + 6) % 7; // Monday first

  const selectedDate = value ? new Date(value) : null;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const monthNames = ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'];
  const dayNames = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];

  const isToday = (d: number) => {
    return d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  };
  const isPast = (d: number) => {
    const date = new Date(viewYear, viewMonth, d);
    const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
    return date < todayMidnight;
  };
  const isSelected = (d: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === d && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-gray-600">
          <ChevronDown size={16} className="rotate-90" />
        </button>
        <span className="font-bold text-navy-500 text-sm">{monthNames[viewMonth]} {viewYear}</span>
        <button type="button" onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors text-gray-600">
          <ChevronDown size={16} className="-rotate-90" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map(d => (
          <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {[...Array(adjustedFirst)].map((_, i) => <div key={`e${i}`} />)}
        {[...Array(daysInMonth)].map((_, i) => {
          const d = i + 1;
          const past = isPast(d);
          const selected = isSelected(d);
          const tod = isToday(d);
          return (
            <button
              type="button"
              key={d}
              disabled={past}
              onClick={() => {
                const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                onChange(iso);
              }}
              className={`w-full aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition-all duration-150
                ${selected ? 'bg-teal-400 text-white shadow-md' : ''}
                ${!selected && tod ? 'bg-navy-100 text-navy-500 ring-2 ring-teal-400/50' : ''}
                ${!selected && !tod && !past ? 'hover:bg-teal-100 hover:text-teal-600 text-gray-700' : ''}
                ${past ? 'text-gray-300 cursor-not-allowed' : ''}
              `}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PriceEstimate({ rooms, sqft, cleaningType }: { rooms: number; sqft: number; cleaningType: CleaningType }) {
  const estimate = estimatePrice(rooms, sqft, cleaningType);
  if (!estimate) {
    return (
      <div className="bg-gray-50 rounded-2xl p-5 border border-dashed border-gray-300 text-center">
        <Sparkles size={24} className="text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Vnesite podatke o prostoru za okvirno oceno cene</p>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-2xl p-5 border border-teal-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-teal-500" />
        <span className="text-teal-700 font-bold text-sm">Okvirna ocena cene</span>
      </div>
      <div className="text-3xl font-extrabold text-navy-500 mb-1">
        {estimate.min}€ – {estimate.max}€
      </div>
      <p className="text-teal-600/80 text-xs leading-relaxed">
        Končna cena bo poslana po pregledu zahteve. Ocena je okvirna in se lahko razlikuje glede na dejansko stanje prostora.
      </p>
      <div className="mt-3 pt-3 border-t border-teal-200 flex flex-wrap gap-3 text-xs">
        <span className="text-gray-500">Sobe: <strong className="text-navy-500">{rooms}</strong></span>
        <span className="text-gray-500">Površina: <strong className="text-navy-500">{sqft} m²</strong></span>
        <span className="text-gray-500">Vrsta: <strong className="text-navy-500">{CLEANING_TYPES.find(t => t.value === cleaningType)?.label}</strong></span>
      </div>
    </div>
  );
}

function BookingForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    name: '', email: user?.email || '', phone: '', address: '',
    rooms: 1, sqft: 0, cleaning_type: 'general',
    preferred_date: '', preferred_time: '',
    special_requests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBookings, setConfirmedBookings] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const fetchConfirmed = async () => {
      const { data } = await supabase
        .from('booking_inquiries')
        .select('date, time')
        .eq('status', 'confirmed');
      if (data) {
        setConfirmedBookings(data);
      }
    };
    fetchConfirmed();
  }, []);

  useEffect(() => {
    if (user?.email && !form.email) {
      setForm(prev => ({ ...prev, email: user.email as string }));
    }
  }, [user, form.email]);

  const set = (field: keyof FormData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError(null);
    const { error: dbError } = await supabase.from('booking_inquiries').insert({
      user_id: user.id,
      full_name: form.name,
      email: user.email,
      phone: form.phone,
      address: form.address,
      service_type: form.cleaning_type,
      rooms: form.rooms,
      area: form.sqft,
      date: form.preferred_date || null,
      time: form.preferred_time,
      special_requests: form.special_requests,
    });
    setSubmitting(false);
    if (dbError) {
      setError('Prišlo je do napake. Prosimo, poskusite znova ali nas kontaktirajte neposredno.');
    } else {
      navigate('/profile');
    }
  };

  const currentStep = (!form.rooms || !form.sqft || !form.cleaning_type) ? 1 :
                      (!form.preferred_date || !form.preferred_time) ? 2 :
                      (!form.name || !form.email || !form.phone || !form.address) ? 3 : 4;


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
          {[1, 2, 3, 4].map(step => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black transition-all duration-300 ${
                step < currentStep ? 'bg-teal-400 text-white shadow-md' :
                step === currentStep ? 'bg-teal-400 text-white shadow-md ring-4 ring-teal-400/20' :
                'bg-gray-100 text-gray-400'
              }`}>
                {step < currentStep ? <CheckCircle size={16} /> : step}
              </div>
              <div className={`hidden sm:block absolute top-12 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                step <= currentStep ? 'text-navy-500' : 'text-gray-400'
              }`}>
                {step === 1 ? 'Storitve' : step === 2 ? 'Termin' : step === 3 ? 'Podatki' : 'Zahteve'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details */}
      <div className={`transition-opacity duration-300 ${currentStep < 1 ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-xl font-extrabold text-navy-500 mb-5 flex items-center gap-3">
          <span className="w-8 h-8 bg-teal-400 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-sm">1</span>
          Podrobnosti storitve
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Število sob</label>
            <input
              type="number" min="1" max="20" required
              value={form.rooms}
              onChange={e => set('rooms', parseInt(e.target.value) || 1)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-navy-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Površina (m²)</label>
            <input
              type="number" min="10" max="1000" required
              value={form.sqft || ''}
              onChange={e => set('sqft', parseFloat(e.target.value) || 0)}
              placeholder="npr. 75"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-navy-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all placeholder:font-normal placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Vrsta čiščenja</label>
            <select
              value={form.cleaning_type}
              onChange={e => set('cleaning_type', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-navy-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all bg-white"
            >
              {CLEANING_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price Estimate */}
      <PriceEstimate rooms={form.rooms} sqft={form.sqft} cleaningType={form.cleaning_type} />

      {/* DateTime */}
      <div className={`transition-opacity duration-300 ${currentStep < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-xl font-extrabold text-navy-500 mb-5 flex items-center gap-3">
          <span className="w-8 h-8 bg-teal-400 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-sm">2</span>
          Datum in čas
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Izberi datum</label>
            <CalendarPicker value={form.preferred_date} onChange={v => set('preferred_date', v)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Izberi čas</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(slot => {
                const isBooked = confirmedBookings.some(
                  b => b.date === form.preferred_date && b.time === slot
                );

                return (
                  <button
                    type="button"
                    key={slot}
                    disabled={isBooked}
                    onClick={() => set('preferred_time', slot)}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all duration-150 border
                      ${isBooked ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' :
                        form.preferred_time === slot
                        ? 'bg-teal-400 text-white border-teal-400 shadow-md'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50'
                      }`}
                  >
                    {isBooked ? <span className="text-xs">Zasedeno</span> : slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className={`transition-opacity duration-300 ${currentStep < 3 ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-xl font-extrabold text-navy-500 mb-5 flex items-center gap-3">
          <span className="w-8 h-8 bg-teal-400 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-sm">3</span>
          Vaši podatki
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Ime in priimek *</label>
            <input
              type="text" required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Ana Novak"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">E-pošta *</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="ana@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Telefon *</label>
            <input
              type="tel" required
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+386 31 123 456"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Naslov čiščenja *</label>
            <input
              type="text" required
              value={form.address}
              onChange={e => set('address', e.target.value)}
              placeholder="Slovenska cesta 1, 1000 Ljubljana"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div className={`transition-opacity duration-300 ${currentStep < 4 ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-xl font-extrabold text-navy-500 mb-5 flex items-center gap-3">
          <span className="w-8 h-8 bg-teal-400 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-sm">4</span>
          Posebne zahteve
        </h3>
        <textarea
          rows={4}
          value={form.special_requests}
          onChange={e => set('special_requests', e.target.value)}
          placeholder="Opišite natanko, kaj potrebujete – posebna območja, alergije, dostop do prostorov, posebni materiali ali karkoli drugega, kar bi morali vedeti..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all placeholder:text-gray-400 resize-none"
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-teal-400 hover:bg-teal-300 disabled:opacity-60 disabled:cursor-not-allowed text-navy-500 font-extrabold text-base py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-teal-400/30 flex items-center justify-center gap-2"
      >
        {!user ? (
          <><Lock size={18} /> Prijava potrebna za rezervacijo</>
        ) : submitting ? (
          <><div className="w-5 h-5 border-2 border-navy-500/30 border-t-navy-500 rounded-full animate-spin" /> Pošiljam...</>
        ) : (
          <><Sparkles size={18} /> Pošlji Upit</>
        )}
      </button>
    </form>
  );
}

function TrustElements() {
  return (
    <section className="py-16 bg-teal-50/50 border-y border-teal-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-500 mb-4">Zakaj nam zaupajo?</h2>
          <p className="text-gray-500">Kakovost, zanesljivost in brezhibna čistoča, ki govori sama zase.</p>
        </div>

        {/* Badges/Certificates */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-500">
              <Shield size={24} />
            </div>
            <div>
              <div className="font-extrabold text-navy-500">100% Zanesljivo</div>
              <div className="text-xs text-gray-500">Preverjena storitev</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-500">
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="font-extrabold text-navy-500">Zavarovana storitev</div>
              <div className="text-xs text-gray-500">Brez skrbi pri delu</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-500">
              <Star size={24} />
            </div>
            <div>
              <div className="font-extrabold text-navy-500">5★ Ocena</div>
              <div className="text-xs text-gray-500">Zadovoljne stranke</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Maja K.', text: 'Izjemno natančno čiščenje! Moje stanovanje še nikoli ni tako sijalo. Zagotovo vas še pokličem.', type: 'Globinsko čiščenje' },
            { name: 'Tomaž H.', text: 'Zelo profesionalen pristop. Prišli so pravočasno in očistili vse kotičke. Priporočam!', type: 'Splošno čiščenje' },
            { name: 'Ana Z.', text: 'Selitev je bila veliko manj stresna zahvaljujoč odličnemu čiščenju ob odhodu. Top storitev!', type: 'Čiščenje ob odhodu' },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-gray-600 text-sm italic mb-4">"{t.text}"</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="font-bold text-navy-500 text-sm">{t.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-teal-500 font-bold bg-teal-50 px-2 py-1 rounded-md">{t.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking() {
  const formRef = useRef<HTMLDivElement>(null);
  return (
    <section id="booking" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-teal-400 font-bold text-sm tracking-widest uppercase">Rezervacija</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-500 mt-3">Zakazivanje Termina</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">Izpolnite obrazec in prejmite okvirno ceno. Hristina vas bo kontaktirala za potrditev in končno ponudbo.</p>
        </div>
        <div ref={formRef} className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 p-8 sm:p-10">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-navy-500 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <SCleaningLogo size="sm" />
            <p className="text-white/60 text-sm leading-relaxed mt-4 max-w-xs">
              Profesionalne čistilne storitve za domove in poslovne prostore v Sloveniji. Zanesljivo, skrbno in po vaši meri.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-widest text-teal-400 mb-5">Kontakt</h4>
            <div className="space-y-3">
              <a href="tel:+38631000000" className="flex items-center gap-3 text-white/70 hover:text-teal-400 text-sm transition-colors">
                <Phone size={14} className="text-teal-400 flex-shrink-0" />
                +386 31 000 000
              </a>
              <a href="mailto:info@scleaning.si" className="flex items-center gap-3 text-white/70 hover:text-teal-400 text-sm transition-colors">
                <Mail size={14} className="text-teal-400 flex-shrink-0" />
                info@scleaning.si
              </a>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <MapPin size={14} className="text-teal-400 flex-shrink-0" />
                Ljubljana, Slovenija
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Clock size={14} className="text-teal-400 flex-shrink-0" />
                Pon–Sob: 07:00–19:00
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-widest text-teal-400 mb-5">Storitve</h4>
            <ul className="space-y-2">
              {['Splošno čiščenje', 'Globinsko čiščenje', 'Čiščenje ob odhodu', 'Pisarniško čiščenje', 'Sezonsko čiščenje'].map(s => (
                <li key={s}>
                  <a href="#services" className="text-white/60 hover:text-teal-400 text-sm transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} S Cleaning – Hristina Savić s.p. Vse pravice pridržane.</p>
          <p className="text-white/40 text-xs">Registrirana dejavnost v Republiki Sloveniji</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="font-sans antialiased">
      <Header />
      <Hero />
      <About />
      <Services />
      <TrustElements />
      <Booking />
      <Footer />
    </div>
  );
}
