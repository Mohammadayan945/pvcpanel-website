import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../lib/api';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'contacted', 'quoted', 'won', 'lost'];
const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', contacted: 'bg-blue-100 text-blue-700', quoted: 'bg-purple-100 text-purple-700', won: 'bg-green-100 text-green-700', lost: 'bg-red-100 text-red-700' };

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState('');

  const load = () => {
    setLoading(true);
    API.get(`/quotes${filter ? `?status=${filter}` : ''}`)
      .then(r => setQuotes(r.data.quotes))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/quotes/${id}`, { status });
      setQuotes(q => q.map(x => x.id === id ? { ...x, status } : x));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const saveNotes = async () => {
    try {
      await API.patch(`/quotes/${selected.id}`, { notes, quote_amount: amount || null });
      setQuotes(q => q.map(x => x.id === selected.id ? { ...x, notes, quote_amount: amount } : x));
      toast.success('Saved');
      setSelected(null);
    } catch { toast.error('Failed'); }
  };

  return (
    <>
      <Head><title>Quote Requests – Admin</title></Head>
      <AdminLayout title="Quote Requests">
        <div className="flex gap-3 mb-6 flex-wrap">
          <button onClick={() => setFilter('')} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filter === '' ? 'bg-navy text-white border-navy' : 'bg-white border-gray-200 text-gray-500'}`}>All</button>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${filter === s ? 'bg-navy text-white border-navy' : 'bg-white border-gray-200 text-gray-500'}`}>{s}</button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Name','Phone','Service','City','Budget','Timeline','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan="8" className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
              ) : quotes.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-12 text-gray-400">No quotes found</td></tr>
              ) : quotes.map(q => (
                <tr key={q.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy text-sm">{q.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{q.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{q.service_type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{q.city || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{q.budget_range || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{q.timeline || '—'}</td>
                  <td className="px-4 py-3">
                    <select value={q.status} onChange={e => updateStatus(q.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${STATUS_COLORS[q.status]}`}>
                      {STATUSES.map(s => <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setSelected(q); setNotes(q.notes || ''); setAmount(q.quote_amount || ''); }} className="text-blue-500 hover:text-blue-700 text-sm">📝</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes Modal */}
        {selected && (
          <div className="fixed inset-0 bg-navy/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl p-7 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-navy text-lg mb-1">{selected.name}</h3>
              <p className="text-gray-400 text-sm mb-5">{selected.service_type} · {selected.phone}</p>
              <div className="mb-4">
                <label className="label">Quote Amount (₹)</label>
                <input className="input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter quoted amount" />
              </div>
              <div className="mb-5">
                <label className="label">Internal Notes</label>
                <textarea className="input h-28 resize-none" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about this lead..." />
              </div>
              <div className="flex gap-3">
                <button onClick={saveNotes} className="flex-1 btn-primary py-3">Save</button>
                <button onClick={() => setSelected(null)} className="flex-1 py-3 border border-gray-200 rounded-full text-gray-500 hover:border-gray-400 transition-all">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
