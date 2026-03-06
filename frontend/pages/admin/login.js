import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import API from '../../lib/api';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      Cookies.set('admin_token', res.data.token, { expires: 7 });
      toast.success(`Welcome back, ${res.data.user.name}!`);
      router.push('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Admin Login – PanelCraft Pro</title></Head>
      <div className="min-h-screen bg-gradient-to-br from-navy to-blue flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <p className="font-serif text-3xl font-black text-navy mb-1">Panel<span className="text-gold">Craft</span> Pro</p>
            <p className="text-gray-400 text-sm">Admin Dashboard</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="admin@panelcraftpro.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Your password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-4 disabled:opacity-60">
              {loading ? 'Signing in...' : '🔐 Sign In'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">
            First time? Run <code className="bg-gray-100 px-1 rounded">/api/auth/setup</code> to create admin account.
          </p>
        </div>
      </div>
    </>
  );
}
