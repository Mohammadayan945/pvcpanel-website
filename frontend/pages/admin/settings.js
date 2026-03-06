import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../lib/api';
import toast from 'react-hot-toast';

const FIELDS = [
  { key: 'business_name', label: 'Business Name' },
  { key: 'business_phone', label: 'Phone Number' },
  { key: 'business_email', label: 'Email Address' },
  { key: 'business_address', label: 'Address' },
  { key: 'whatsapp_number', label: 'WhatsApp Number (with country code)' },
  { key: 'hero_title', label: 'Hero Title' },
  { key: 'hero_subtitle', label: 'Hero Subtitle' },
];

export default function AdminSettings() {
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
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head><title>Settings – Admin</title></Head>
      <AdminLayout title="Site Settings">
        <div className="max-w-2xl">
          {loading ? (
            <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse" />)}</div>
          ) : (
            <form onSubmit={save} className="bg-white rounded-2xl p-8 shadow-sm space-y-5">
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input className="input" value={settings[f.key] || ''} onChange={e => setSettings({ ...settings, [f.key]: e.target.value })} />
                </div>
              ))}
              <button type="submit" disabled={saving} className="w-full btn-primary py-4 disabled:opacity-60">
                {saving ? 'Saving...' : '💾 Save Settings'}
              </button>
            </form>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
