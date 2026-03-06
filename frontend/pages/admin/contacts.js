import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../lib/api';
import toast from 'react-hot-toast';

const STATUSES = ['new', 'read', 'responded', 'closed'];
const STATUS_COLORS = { new: 'bg-blue-100 text-blue-700', read: 'bg-gray-100 text-gray-600', responded: 'bg-green-100 text-green-700', closed: 'bg-gray-200 text-gray-400' };

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    API.get(`/contacts${filter ? `?status=${filter}` : ''}`)
      .then(r => setContacts(r.data.contacts))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/contacts/${id}`, { status });
      setContacts(c => c.map(x => x.id === id ? { ...x, status } : x));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  const deleteContact = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await API.delete(`/contacts/${id}`);
      setContacts(c => c.filter(x => x.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <Head><title>Contacts – Admin</title></Head>
      <AdminLayout title="Contact Submissions">
        <div className="flex gap-3 mb-6 flex-wrap">
          <button onClick={() => setFilter('')} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filter === '' ? 'bg-navy text-white border-navy' : 'bg-white border-gray-200 text-gray-500'}`}>All</button>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${filter === s ? 'bg-navy text-white border-navy' : 'bg-white border-gray-200 text-gray-500'}`}>{s}</button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Name','Phone','Email','Service','Message','Status','Date','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan="8" className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
              ) : contacts.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-12 text-gray-400">No contacts found</td></tr>
              ) : contacts.map(c => (
                <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy text-sm">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.service || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-[150px] truncate">{c.message || '—'}</td>
                  <td className="px-4 py-3">
                    <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${STATUS_COLORS[c.status]}`}>
                      {STATUSES.map(s => <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteContact(c.id)} className="text-red-400 hover:text-red-600 text-sm">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </>
  );
}
