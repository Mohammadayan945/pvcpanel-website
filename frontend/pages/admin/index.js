import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../lib/api';

const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', contacted: 'bg-blue-100 text-blue-700', quoted: 'bg-purple-100 text-purple-700', won: 'bg-green-100 text-green-700', lost: 'bg-red-100 text-red-700', new: 'bg-blue-100 text-blue-700', read: 'bg-gray-100 text-gray-600', responded: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-400' };

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/stats')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = data ? [
    { label: 'Total Contacts', value: data.stats.total_contacts, sub: `${data.stats.new_contacts} new`, color: 'from-blue-500 to-blue-700', icon: '📬' },
    { label: 'Quote Requests', value: data.stats.total_quotes, sub: `${data.stats.pending_quotes} pending`, color: 'from-gold to-gold-light', icon: '📋' },
    { label: 'Projects Won', value: data.stats.won_quotes, sub: 'Confirmed projects', color: 'from-green-500 to-green-700', icon: '✅' },
    { label: 'Gallery Images', value: data.stats.gallery_images, sub: 'Portfolio items', color: 'from-purple-500 to-purple-700', icon: '🖼️' },
  ] : [];

  return (
    <>
      <Head><title>Dashboard – PanelCraft Pro Admin</title></Head>
      <AdminLayout title="Dashboard Overview">
        {loading ? (
          <div className="grid grid-cols-4 gap-5 mb-8">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />)}</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {STAT_CARDS.map(s => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white`}>
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-white/80 text-sm font-medium">{s.label}</p>
                    <span className="text-2xl">{s.icon}</span>
                  </div>
                  <p className="text-3xl font-bold font-serif">{s.value}</p>
                  <p className="text-white/70 text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Contacts */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-navy mb-4">Recent Contacts</h3>
                <div className="space-y-3">
                  {data.recent_contacts.map(c => (
                    <div key={c.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-navy font-medium text-sm">{c.name}</p>
                        <p className="text-gray-400 text-xs">{c.phone} · {c.service || 'General'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Quotes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-navy mb-4">Recent Quote Requests</h3>
                <div className="space-y-3">
                  {data.recent_quotes.map(q => (
                    <div key={q.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-navy font-medium text-sm">{q.name}</p>
                        <p className="text-gray-400 text-xs">{q.phone} · {q.service_type}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[q.status]}`}>{q.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </AdminLayout>
    </>
  );
}
