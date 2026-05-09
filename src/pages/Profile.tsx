import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Home, Calendar, User as UserIcon } from 'lucide-react';

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        const { data, error } = await supabase
          .from('booking_inquiries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setBookings(data);
        }
        setFetching(false);
      };
      fetchBookings();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const cancelBooking = async (id: string) => {
    if (!confirm('Ali ste prepričani, da želite preklicati to rezervacijo?')) return;

    const { error } = await supabase
      .from('booking_inquiries')
      .update({ status: 'Odpovedano' })
      .eq('id', id)
      .eq('user_id', user?.id);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Odpovedano' } : b));
    } else {
      alert('Prišlo je do napake pri preklicu rezervacije.');
    }
  };

  if (loading || (fetching && user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null; // Prevent flicker while navigating

  const statusColors: Record<string, string> = {
    'V čakanju': 'bg-amber-100 text-amber-700 border-amber-200',
    'Potrjeno': 'bg-blue-100 text-blue-700 border-blue-200',
    'Zaključeno': 'bg-green-100 text-green-700 border-green-200',
    'Zavrnjeno': 'bg-red-100 text-red-700 border-red-200',
    'Odpovedano': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 h-20 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-navy-500 font-bold hover:text-teal-500 transition-colors">
            <Home size={20} />
            <span className="hidden sm:inline">Nazaj domov</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <img src="/SCleaning-logo.png" alt="S Cleaning Logo" className="h-10 object-contain" />
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500">
              <UserIcon size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-navy-500 mb-1">Vaš Profil</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors"
          >
            <LogOut size={16} />
            Odjavi se
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500">
              <Calendar size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-navy-500">Moji termini</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-navy-500 mb-2">Nimate še nobenih terminov</h3>
              <p className="text-gray-500 mb-6">Zakazite svoje prvo čiščenje in poskrbeli bomo za vaš prostor.</p>
              <Link to="/#booking" className="inline-block bg-teal-400 hover:bg-teal-300 text-navy-500 font-extrabold px-6 py-3 rounded-xl transition-colors">
                Zakazovanje
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Storitev</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Datum</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Naslov</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Akcije</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking: Record<string, unknown>) => (
                    <tr key={booking.id as string} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-6 font-bold text-navy-500 text-sm">
                        {booking.service_type === 'general' ? 'Splošno čiščenje' :
                         booking.service_type === 'deep' ? 'Globinsko čiščenje' :
                         booking.service_type === 'office' ? 'Pisarniško čiščenje' : 'Čiščenje ob odhodu'}
                      </td>
                      <td className="py-5 px-6 text-gray-600 text-sm">
                        <div className="flex flex-col">
                          <span>{booking.date ? new Date(booking.date as string).toLocaleDateString('sl-SI') : 'Ni izbrano'}</span>
                          <span className="text-xs text-gray-400 font-bold">{(booking.time as string) || 'Ni izbrano'}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-gray-600 text-sm max-w-[200px] truncate" title={booking.address as string}>
                        {booking.address as string}
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusColors[booking.status as string] || statusColors['V čakanju']}`}>
                          {booking.status as string || 'V čakanju'}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        {(booking.status === 'V čakanju' || booking.status === 'Potrjeno') && (
                          <button
                            onClick={() => cancelBooking(booking.id as string)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-colors"
                          >
                            Prekliči rezervacijo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
