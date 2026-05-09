import { useState, useEffect } from 'react';
import { Home, Calendar, Users, Settings, PieChart, TrendingUp, Bell, Search, Menu, X, LucideIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function StatCard({ title, value, trend, icon: Icon }: { title: string, value: string, trend: string, icon: LucideIcon }) {
  const positive = trend.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{title}</h3>
        <div className="text-3xl font-extrabold text-navy-500">{value}</div>
        <div className={`text-xs font-bold mt-2 ${positive ? 'text-teal-500' : 'text-red-500'}`}>
          {trend} ta mesec
        </div>
      </div>
      <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500">
        <Icon size={28} />
      </div>
    </div>
  );
}

export default function Admin() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-navy-500 w-64 text-white flex flex-col transition-transform duration-300 z-50 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <img src="/SCleaning-logo.png" alt="S Cleaning Logo" className="h-10 object-contain brightness-0 invert" />
          <button className="md:hidden" onClick={() => setMenuOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { name: 'Nadzorna plošča', icon: PieChart, active: true },
            { name: 'Termini', icon: Calendar },
            { name: 'Stranke', icon: Users },
            { name: 'Nastavitve', icon: Settings },
          ].map(item => (
            <a key={item.name} href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${item.active ? 'bg-teal-400 text-navy-500' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <item.icon size={18} />
              {item.name}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            <Home size={18} />
            Nazaj na stran
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white h-20 px-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-navy-500" onClick={() => setMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Iskanje..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-600">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-teal-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-navy-500">
              HS
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8 flex-1 overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-navy-500 mb-1">Pozdravljeni, Hristina!</h1>
            <p className="text-gray-500 text-sm">Tukaj je pregled vašega poslovanja za današnji dan.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Novi Termini" value="12" trend="+3" icon={Calendar} />
            <StatCard title="Prihodek" value="1,240 €" trend="+15%" icon={TrendingUp} />
            <StatCard title="Nove Stranke" value="8" trend="+2" icon={Users} />
            <StatCard title="Aktivna Opravila" value="5" trend="-1" icon={PieChart} />
          </div>

          {/* Booking Management Table */}
          <BookingTable />

          {/* Client List */}
          <ClientList />
        </div>
      </main>
    </div>
  );
}

function ClientList() {
  const [clients, setClients] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setClients(data);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-navy-500">Seznam strank</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Datum registracije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client: Record<string, unknown>) => (
              <tr key={client.id as string} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-navy-500 font-bold text-sm">
                  {client.email as string}
                </td>
                <td className="py-4 px-6 text-gray-600 text-sm">
                  {client.created_at ? new Date(client.created_at as string).toLocaleDateString('sl-SI') : 'N/A'}
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={2} className="py-8 text-center text-gray-500">
                  Trenutno ni registriranih strank.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingTable() {
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [filter, setFilter] = useState<'V čakanju' | 'all'>('V čakanju');

  useEffect(() => {
    const fetchBookings = async () => {
      let query = supabase
        .from('booking_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'V čakanju') {
        query = query.eq('status', 'V čakanju');
      }

      const { data } = await query;
      if (data) {
        setBookings(data);
      }
    };
    fetchBookings();
  }, [filter]);

  const updateStatus = async (id: string, newStatus: string, email?: string) => {
    const { error } = await supabase
      .from('booking_inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

      // Trigger email if confirmed
      if (newStatus === 'Potrjeno' && email) {
        await supabase.functions.invoke('send-email', {
          body: { to: email }
        });
      }
    }
  };

  const statusColors: Record<string, string> = {
    'V čakanju': 'bg-amber-100 text-amber-700 border-amber-200',
    'Potrjeno': 'bg-blue-100 text-blue-700 border-blue-200',
    'Zaključeno': 'bg-teal-100 text-teal-700 border-teal-200',
    'Zavrnjeno': 'bg-red-100 text-red-700 border-red-200',
    'Odpovedano': 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-navy-500">Termini</h2>
        <div className="flex bg-gray-50 p-1 rounded-xl">
          <button
            onClick={() => setFilter('V čakanju')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'V čakanju' ? 'bg-white shadow-sm text-navy-500' : 'text-gray-500 hover:text-navy-500'}`}
          >
            Na čakanju
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-white shadow-sm text-navy-500' : 'text-gray-500 hover:text-navy-500'}`}
          >
            Vsi termini
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Stranka</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Storitev</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Datum in čas</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Kontakt</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking: Record<string, unknown>) => (
              <tr key={booking.id as string} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-navy-500 text-sm">{booking.full_name as string}</td>
                <td className="py-4 px-6 text-gray-600 text-sm">
                  {booking.service_type === 'general' ? 'Splošno čiščenje' :
                   booking.service_type === 'deep' ? 'Globinsko čiščenje' :
                   booking.service_type === 'office' ? 'Pisarniško čiščenje' : 'Čiščenje ob odhodu'}
                </td>
                <td className="py-4 px-6 text-gray-600 text-sm">
                  <div className="flex flex-col">
                    <span>{booking.date ? new Date(booking.date as string).toLocaleDateString('sl-SI') : 'Ni izbrano'}</span>
                    <span className="text-xs text-gray-400 font-bold">{(booking.time as string) || 'Ni izbrano'}</span>
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-navy-500 text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs">{booking.email as string}</span>
                    <span className="text-xs font-normal text-gray-500">{booking.phone as string}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[booking.status as string] || statusColors['V čakanju']}`}>
                    {booking.status as string || 'V čakanju'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  {booking.status === 'V čakanju' && (
                    <>
                      <button onClick={() => updateStatus(booking.id as string, 'Potrjeno', booking.email as string)} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors mr-2">
                        Potrdi
                      </button>
                      <button onClick={() => updateStatus(booking.id as string, 'Zavrnjeno')} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                        Zavrni
                      </button>
                    </>
                  )}
                  {booking.status === 'Potrjeno' && (
                    <button onClick={() => updateStatus(booking.id as string, 'Zaključeno')} className="px-3 py-1 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg text-xs font-bold transition-colors">
                      Zaključi
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
