import { useState } from 'react';
import { Home, Calendar, Users, Settings, PieChart, TrendingUp, Bell, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { LucideIcon } from 'lucide-react';

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
  const clients = [
    { id: '1', name: 'Ana Novak', email: 'ana.novak@example.com', phone: '+386 31 123 456', totalBookings: 3, lastBooking: '2023-11-15' },
    { id: '2', name: 'Marko Kovač', email: 'marko.kovac@example.com', phone: '+386 41 987 654', totalBookings: 1, lastBooking: '2023-11-15' },
    { id: '3', name: 'Petra Zajc', email: 'petra.zajc@example.com', phone: '+386 51 234 567', totalBookings: 5, lastBooking: '2023-11-16' },
    { id: '4', name: 'Luka Horvat', email: 'luka.horvat@example.com', phone: '+386 31 345 678', totalBookings: 2, lastBooking: '2023-11-17' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-navy-500">Zadnje stranke</h2>
        <button className="text-teal-500 hover:text-teal-600 font-bold text-sm">Prikaži vse</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Ime</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Kontakt</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Št. rezervacij</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Zadnja rezervacija</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-navy-500 text-sm">{client.name}</td>
                <td className="py-4 px-6 text-gray-600 text-sm">
                  <div className="flex flex-col">
                    <span>{client.email}</span>
                    <span className="text-xs text-gray-400 font-bold">{client.phone}</span>
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-navy-500 text-sm">{client.totalBookings}</td>
                <td className="py-4 px-6 text-gray-600 text-sm">
                  {new Date(client.lastBooking).toLocaleDateString('sl-SI')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingTable() {
  const [bookings, setBookings] = useState([
    { id: '1', client: 'Ana Novak', service: 'Globinsko čiščenje', date: '2023-11-15', time: '09:00', price: '85 €', status: 'Pending' },
    { id: '2', client: 'Marko Kovač', service: 'Splošno čiščenje', date: '2023-11-15', time: '13:00', price: '45 €', status: 'Confirmed' },
    { id: '3', client: 'Petra Zajc', service: 'Čiščenje ob odhodu', date: '2023-11-16', time: '08:00', price: '120 €', status: 'Completed' },
    { id: '4', client: 'Luka Horvat', service: 'Pisarniško čiščenje', date: '2023-11-17', time: '17:00', price: '60 €', status: 'Cancelled' },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const statusColors: Record<string, string> = {
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
    'Completed': 'bg-teal-100 text-teal-700 border-teal-200',
    'Cancelled': 'bg-red-100 text-red-700 border-red-200',
  };

  const statusTranslations: Record<string, string> = {
    'Pending': 'Na čakanju',
    'Confirmed': 'Potrjeno',
    'Completed': 'Zaključeno',
    'Cancelled': 'Odpovedano',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-navy-500">Zadnji termini</h2>
        <button className="text-teal-500 hover:text-teal-600 font-bold text-sm">Prikaži vse</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Stranka</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Storitev</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Datum in čas</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Cena</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-navy-500 text-sm">{booking.client}</td>
                <td className="py-4 px-6 text-gray-600 text-sm">{booking.service}</td>
                <td className="py-4 px-6 text-gray-600 text-sm">
                  <div className="flex flex-col">
                    <span>{new Date(booking.date).toLocaleDateString('sl-SI')}</span>
                    <span className="text-xs text-gray-400 font-bold">{booking.time}</span>
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-navy-500 text-sm">{booking.price}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[booking.status]}`}>
                    {statusTranslations[booking.status]}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  {booking.status === 'Pending' && (
                    <button onClick={() => updateStatus(booking.id, 'Confirmed')} className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors">
                      Potrdi
                    </button>
                  )}
                  {booking.status === 'Confirmed' && (
                    <button onClick={() => updateStatus(booking.id, 'Completed')} className="px-3 py-1 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg text-xs font-bold transition-colors">
                      Zaključi
                    </button>
                  )}
                  {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <button onClick={() => updateStatus(booking.id, 'Cancelled')} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                      Odpovej
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
