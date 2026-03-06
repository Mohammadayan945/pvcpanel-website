import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../lib/api';
import toast from 'react-hot-toast';

const ICONS = ['🏠','✨','🏢','🎨','💡','🛠️','🪟','🚿','🛁','🏗️','🔨','⚡','🪴','🏛️','💎'];

const EMPTY = { name: '', description: '', icon: '🏠', price_from: '', price_to: '', is_active: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    API.get('/services')
      .then(r => setServices(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (s) => { setForm({ name: s.name, description: s.description||'', icon: s.icon||'🏠', price_from: s.price_from||'', price_to: s.price_to||'', is_active: s.is_active }); setEditing(s.id); setShowForm(true); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Service name is required');
    setSaving(true);
    try {
      if (editing) {
        await API.patch(`/services/${editing}`, form);
        toast.success('Service updated! ✅');
      } else {
        const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        await API.post('/services', { ...form, slug });
        toast.success('Service added! ✅');
      }
      load();
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (s) => {
    try {
      await API.patch(`/services/${s.id}`, { is_active: !s.is_active });
      setServices(services.map(x => x.id === s.id ? { ...x, is_active: !s.is_active } : x));
      toast.success(s.is_active ? 'Service hidden from website' : 'Service shown on website');
    } catch { toast.error('Failed'); }
  };

  return (
    <>
      <Head><title>Services – Admin</title></Head>
      <AdminLayout title="Manage Services">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 text-sm">{services.length} services total</p>
          <button onClick={openAdd} className="btn-primary py-2 px-6 text-sm">+ Add New Service</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(s => (
              <div key={s.id} className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all ${s.is_active ? 'border-transparent' : 'border-gray-200 opacity-60'}`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-4xl">{s.icon}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(s)} className="text-blue-400 hover:text-blue-600 text-sm px-2 py-1 rounded-lg hover:bg-blue-50 transition-all">✏️ Edit</button>
                    <button onClick={() => toggleActive(s)} className={`text-sm px-2 py-1 rounded-lg transition-all ${s.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}>
                      {s.is_active ? '👁️ Visible' : '🙈 Hidden'}
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-navy text-base mb-1">{s.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{s.description}</p>
                {(s.price_from || s.price_to) && (
                  <p className="text-gold font-semibold text-sm">
                    ₹{s.price_from} – ₹{s.price_to} /sqft
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ADD / EDIT MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-navy/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-navy text-xl">{editing ? 'Edit Service' : 'Add New Service'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 text-2xl">×</button>
              </div>
              <form onSubmit={save} className="space-y-4">
                {/* Icon Picker */}
                <div>
                  <label className="label">Choose Icon</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ICONS.map(ic => (
                      <button type="button" key={ic} onClick={() => setForm({ ...form, icon: ic })}
                        className={`text-2xl p-2 rounded-xl border-2 transition-all ${form.icon === ic ? 'border-gold bg-gold/10' : 'border-gray-100 hover:border-gray-300'}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Service Name *</label>
                  <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. PVC Wall Panels" />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea className="input h-24 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this service..." />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Price From (₹/sqft)</label>
                    <input className="input" type="number" value={form.price_from} onChange={e => setForm({ ...form, price_from: e.target.value })} placeholder="35" />
                  </div>
                  <div>
                    <label className="label">Price To (₹/sqft)</label>
                    <input className="input" type="number" value={form.price_to} onChange={e => setForm({ ...form, price_to: e.target.value })} placeholder="90" />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-gold" />
                  <span className="text-sm text-navy font-medium">Show on website</span>
                </label>

                <button type="submit" disabled={saving} className="w-full btn-primary py-4 disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? '💾 Update Service' : '➕ Add Service'}
                </button>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
