import { useState, useEffect } from 'react';
import { Home, Calendar, Users, Settings, PieChart, TrendingUp, Bell, Search, Menu, X, LucideIcon, Mail } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'termini' | 'stranke' | 'nastavitve'>('dashboard');
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
            { id: 'dashboard', name: 'Nadzorna plošča', icon: PieChart },
            { id: 'termini', name: 'Termini', icon: Calendar },
            { id: 'stranke', name: 'Stranke', icon: Users },
            { id: 'nastavitve', name: 'Nastavitve', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as 'dashboard' | 'termini' | 'stranke' | 'nastavitve'); setMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === item.id ? 'bg-teal-400 text-navy-500' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
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

        {/* Main Content Area Based on Tab */}
        <div className="p-6 md:p-8 flex-1 overflow-auto">
          {activeTab === 'dashboard' && (
            <>
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

              {/* Booking Management Table - Pending Only */}
              <PendingBookingsTable />

              {/* New Users Without Bookings */}
              <NewUsersTable />
            </>
          )}

          {activeTab === 'termini' && (
            <AllBookingsTable />
          )}

          {activeTab === 'stranke' && (
            <AllClientsTable />
          )}

          {activeTab === 'nastavitve' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <Settings size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-navy-500 mb-2">Nastavitve</h2>
              <p className="text-gray-500">Stran v izdelavi.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AllClientsTable() {
  const [clients, setClients] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: bookingsData } = await supabase
        .from('booking_inquiries')
        .select('user_id');

      if (profilesData && bookingsData) {
        const counts = bookingsData.reduce((acc: Record<string, number>, b) => {
          if (b.user_id) acc[b.user_id] = (acc[b.user_id] || 0) + 1;
          return acc;
        }, {});

        const combined = profilesData.map(p => ({
          ...p,
          total_bookings: counts[p.id] || 0
        }));

        setClients(combined);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-navy-500">Celoten seznam strank</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Datum registracije</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Skupno število rezervacij</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client) => (
              <tr key={client.id as string} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-navy-500 font-bold text-sm">
                  {client.email as string}
                </td>
                <td className="py-4 px-6 text-gray-600 text-sm">
                  {client.created_at ? new Date(client.created_at as string).toLocaleDateString('sl-SI') : 'N/A'}
                </td>
                <td className="py-4 px-6 font-bold text-teal-600 text-sm">
                  {client.total_bookings as number}
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">
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

function PendingBookingsTable() {
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('booking_inquiries')
        .select('*')
        .eq('status', 'V čakanju')
        .order('created_at', { ascending: false });

      if (data) {
        setBookings(data);
      }
    };
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, newStatus: string, email?: string) => {
    const { error } = await supabase
      .from('booking_inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setBookings(prev => prev.filter(b => b.id !== id));

      if (newStatus === 'Potrjeno' && email) {
        await supabase.functions.invoke('send-email', {
          body: { to: email }
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-navy-500">Nove prošnje (V čakanju)</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Stranka</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Storitev</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Datum in čas</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Kontakt</th>
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
                <td className="py-4 px-6 text-right space-x-2">
                  <button onClick={() => updateStatus(booking.id as string, 'Potrjeno', booking.email as string)} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors mr-2">
                    Potrdi
                  </button>
                  <button onClick={() => updateStatus(booking.id as string, 'Zavrnjeno')} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                    Zavrni
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  Ni novih prošenj za čiščenje.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewUsersTable() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    const fetchNewUsers = async () => {
      // Fetch all profiles
      const { data: profilesData } = await supabase.from('profiles').select('id, email, created_at');

      // Fetch all booking user_ids
      const { data: bookingsData } = await supabase.from('booking_inquiries').select('user_id');

      if (profilesData && bookingsData) {
        const bookedUserIds = new Set(bookingsData.map(b => b.user_id));
        const usersWithoutBookings = profilesData.filter(p => !bookedUserIds.has(p.id));
        setUsers(usersWithoutBookings);
      }
    };
    fetchNewUsers();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-navy-500">Novi uporabniki brez rezervacije</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Datum registracije</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id as string} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-navy-500 font-bold text-sm">
                  {u.email as string}
                </td>
                <td className="py-4 px-6 text-gray-600 text-sm">
                  {u.created_at ? new Date(u.created_at as string).toLocaleDateString('sl-SI') : 'N/A'}
                </td>
                <td className="py-4 px-6 text-right">
                  <a
                    href={`mailto:${u.email}?subject=Dobrodošli v S Cleaning&body=Pozdravljeni,%0A%0AVeseli nas, da ste se pridružili S Cleaning! Opazili smo, da še niste opravili nobene rezervacije. Ce potrebujete pomoc, smo tu za vas.%0A%0ALep pozdrav,%0AEkipa S Cleaning`}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Mail size={14} /> Pošlji mail
                  </a>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">
                  Vsi uporabniki imajo vsaj eno rezervacijo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AllBookingsTable() {
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('booking_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setBookings(data);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b =>
    (b.full_name as string)?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    'V čakanju': 'bg-amber-100 text-amber-700 border-amber-200',
    'Potrjeno': 'bg-blue-100 text-blue-700 border-blue-200',
    'Zaključeno': 'bg-green-100 text-green-700 border-green-200',
    'Zavrnjeno': 'bg-red-100 text-red-700 border-red-200',
    'Odpovedano': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-extrabold text-navy-500">Zgodovina terminov</h2>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Išči po imenu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all"
          />
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBookings.map((booking) => (
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
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  Noben termin ne ustreza iskanju.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
