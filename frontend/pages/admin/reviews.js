import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../lib/api';
import toast from 'react-hot-toast';

const EMPTY = { client_name: '', city: '', rating: 5, review: '', service_used: '' };
const SERVICES = ['PVC Wall Panels','PVC Ceiling Panels','WPC Flooring','3D Wall Panels','False Ceiling','Complete Makeover'];

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    API.get('/testimonials')
      .then(r => setReviews(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.client_name || !form.review) return toast.error('Name and review are required');
    setSaving(true);
    try {
      await API.post('/testimonials', form);
      toast.success('Review added! ✅');
      load();
      setShowForm(false);
      setForm(EMPTY);
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (r) => {
    try {
      await API.patch(`/testimonials/${r.id}`, { is_active: r.is_active ? 0 : 1 });
      setReviews(reviews.map(x => x.id === r.id ? { ...x, is_active: x.is_active ? 0 : 1 } : x));
      toast.success(r.is_active ? '🙈 Hidden from website' : '👁️ Now visible on website');
    } catch { toast.error('Failed'); }
  };

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await API.delete(`/testimonials/${id}`);
      setReviews(reviews.filter(x => x.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const StarPicker = () => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })}
          className={`text-2xl transition-transform hover:scale-110 ${n <= form.rating ? 'text-gold' : 'text-gray-300'}`}>★</button>
      ))}
    </div>
  );

  return (
    <>
      <Head><title>Reviews – Admin</title></Head>
      <AdminLayout title="Manage Reviews">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 text-sm">{reviews.length} reviews · {reviews.filter(r => r.is_active).length} visible on website</p>
          <button onClick={() => { setForm(EMPTY); setShowForm(true); }} className="btn-primary py-2 px-6 text-sm">+ Add New Review</button>
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />)}</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">⭐</p>
            <p>No reviews yet. Add your first client review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(r => (
              <div key={r.id} className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all ${r.is_active ? 'border-transparent' : 'border-gray-100 opacity-60'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < r.rating ? 'text-gold' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleVisible(r)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${r.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {r.is_active ? '👁️ Visible' : '🙈 Hidden'}
                    </button>
                    <button onClick={() => deleteReview(r.id)} className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition-all">🗑️</button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic mb-3">"{r.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy font-bold text-xs">
                    {r.client_name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <p className="text-navy font-semibold text-sm">{r.client_name}</p>
                    <p className="text-gray-400 text-xs">{r.city} · {r.service_used}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD REVIEW MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-navy/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-navy text-xl">Add Client Review</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 text-2xl">×</button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Client Name *</label>
                    <input className="input" value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} placeholder="Rahul Kumar" />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Delhi" />
                  </div>
                </div>
                <div>
                  <label className="label">Rating</label>
                  <StarPicker />
                </div>
                <div>
                  <label className="label">Review *</label>
                  <textarea className="input h-28 resize-none" value={form.review} onChange={e => setForm({ ...form, review: e.target.value })} placeholder="What did the client say about your work?" />
                </div>
                <div>
                  <label className="label">Service Used</label>
                  <select className="input" value={form.service_used} onChange={e => setForm({ ...form, service_used: e.target.value })}>
                    <option value="">Select service</option>
                    {SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={saving} className="w-full btn-primary py-4 disabled:opacity-60">
                  {saving ? 'Saving...' : '⭐ Add Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
