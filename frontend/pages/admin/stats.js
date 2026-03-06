import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../lib/api';
import toast from 'react-hot-toast';

const DEFAULT_STATS = [
  { key: 'stat_1_value', label: 'stat_1_label', defaultVal: '500+', defaultLabel: 'Happy Clients' },
  { key: 'stat_2_value', label: 'stat_2_label', defaultVal: '10+',  defaultLabel: 'Years in Business' },
  { key: 'stat_3_value', label: 'stat_3_label', defaultVal: '50+',  defaultLabel: 'Panel Designs' },
  { key: 'stat_4_value', label: 'stat_4_label', defaultVal: '5★',   defaultLabel: 'Average Rating' },
  { key: 'stat_5_value', label: 'stat_5_label', defaultVal: '3yr',  defaultLabel: 'Warranty Offered' },
  { key: 'stat_6_value', label: 'stat_6_label', defaultVal: '24hr', defaultLabel: 'Response Time' },
];

const DEFAULT_FEATURES = [
  { key: 'feature_1_icon', iconDef: '🏆', key2: 'feature_1_title', titleDef: 'Premium Quality Materials',  key3: 'feature_1_desc', descDef: 'We source only Grade-A PVC panels from certified manufacturers.' },
  { key: 'feature_2_icon', iconDef: '👷', key2: 'feature_2_title', titleDef: 'Expert Installation Team',    key3: 'feature_2_desc', descDef: '10+ years of installation experience for a flawless finish every time.' },
  { key: 'feature_3_icon', iconDef: '💰', key2: 'feature_3_title', titleDef: 'Transparent Pricing',         key3: 'feature_3_desc', descDef: 'No hidden costs. What we quote is exactly what you pay.' },
  { key: 'feature_4_icon', iconDef: '⏱️', key2: 'feature_4_title', titleDef: 'On-Time Delivery',            key3: 'feature_4_desc', descDef: 'Every project completed on schedule without compromising quality.' },
];

export default function AdminStats() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/settings')
      .then(r => setSettings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/settings', settings);
      toast.success('Stats & features updated! ✅');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const get = (key, def) => settings[key] !== undefined ? settings[key] : def;
  const set = (key, val) => setSettings({ ...settings, [key]: val });

  return (
    <>
      <Head><title>Stats & Features – Admin</title></Head>
      <AdminLayout title="Why Choose Us — Stats & Features">
        {loading ? (
          <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />)}</div>
        ) : (
          <form onSubmit={save} className="space-y-8 max-w-3xl">

            {/* STATS GRID */}
            <div className="bg-white rounded-2xl p-7 shadow-sm">
              <h3 className="font-bold text-navy text-lg mb-1">📊 Stats Numbers</h3>
              <p className="text-gray-400 text-sm mb-5">These appear in the "Why Choose Us" box on the right side</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEFAULT_STATS.map((s, i) => (
                  <div key={s.key} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Stat {i + 1}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="label">Value</label>
                        <input className="input text-center font-bold" value={get(s.key, s.defaultVal)} onChange={e => set(s.key, e.target.value)} placeholder={s.defaultVal} />
                      </div>
                      <div>
                        <label className="label">Label</label>
                        <input className="input" value={get(s.label, s.defaultLabel)} onChange={e => set(s.label, e.target.value)} placeholder={s.defaultLabel} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURES LIST */}
            <div className="bg-white rounded-2xl p-7 shadow-sm">
              <h3 className="font-bold text-navy text-lg mb-1">✅ Feature Points</h3>
              <p className="text-gray-400 text-sm mb-5">These appear in the left side list with icons</p>
              <div className="space-y-4">
                {DEFAULT_FEATURES.map((f, i) => (
                  <div key={f.key} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Feature {i + 1}</p>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <label className="label">Icon</label>
                        <input className="input text-center text-2xl" value={get(f.key, f.iconDef)} onChange={e => set(f.key, e.target.value)} placeholder={f.iconDef} />
                      </div>
                      <div className="col-span-4">
                        <label className="label">Title</label>
                        <input className="input" value={get(f.key2, f.titleDef)} onChange={e => set(f.key2, e.target.value)} placeholder={f.titleDef} />
                      </div>
                      <div className="col-span-6">
                        <label className="label">Description</label>
                        <input className="input" value={get(f.key3, f.descDef)} onChange={e => set(f.key3, e.target.value)} placeholder={f.descDef} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving} className="w-full btn-primary py-4 text-base disabled:opacity-60">
              {saving ? 'Saving...' : '💾 Save All Changes'}
            </button>
          </form>
        )}
      </AdminLayout>
    </>
  );
}
