import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../lib/api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function AdminProfile() {
  const router = useRouter();
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  // Email form
  const [emailForm, setEmailForm] = useState({ new_email: '', password: '' });
  const [savingEmail, setSavingEmail] = useState(false);

  // Password form
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [savingPass, setSavingPass] = useState(false);

  // Show/hide passwords
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    API.get('/auth/me')
      .then(r => { setAdmin(r.data); setEmailForm(f => ({ ...f, new_email: r.data.email })); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Change Email ───────────────────────────────
  const changeEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.new_email || !emailForm.password) return toast.error('All fields are required');
    setSavingEmail(true);
    try {
      await API.post('/auth/change-email', emailForm);
      toast.success('✅ Email updated! Please login again.');
      setTimeout(() => { Cookies.remove('admin_token'); router.push('/admin/login'); }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update email');
    } finally {
      setSavingEmail(false);
    }
  };

  // ── Change Password ────────────────────────────
  const changePassword = async (e) => {
    e.preventDefault();
    if (!passForm.current_password || !passForm.new_password || !passForm.confirm_password)
      return toast.error('All fields are required');
    if (passForm.new_password.length < 6)
      return toast.error('New password must be at least 6 characters');
    if (passForm.new_password !== passForm.confirm_password)
      return toast.error('New passwords do not match!');
    if (passForm.current_password === passForm.new_password)
      return toast.error('New password must be different from current');
    setSavingPass(true);
    try {
      await API.post('/auth/change-password', passForm);
      toast.success('✅ Password changed! Please login again.');
      setTimeout(() => { Cookies.remove('admin_token'); router.push('/admin/login'); }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSavingPass(false);
    }
  };

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors text-lg">
      {show ? '🙈' : '👁️'}
    </button>
  );

  return (
    <>
      <Head><title>Profile & Security – Admin</title></Head>
      <AdminLayout title="Profile & Security">
        {loading ? (
          <div className="space-y-4 max-w-xl">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="max-w-xl space-y-6">

            {/* PROFILE INFO CARD */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy to-blue-light flex items-center justify-center text-white font-serif text-2xl font-black">
                  {admin.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-bold text-navy text-lg">{admin.name}</p>
                  <p className="text-gray-400 text-sm">{admin.email}</p>
                  <span className="inline-block bg-gold/15 text-gold text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                    Administrator
                  </span>
                </div>
              </div>
            </div>

            {/* CHANGE EMAIL CARD */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">✉️</div>
                <div>
                  <h3 className="font-bold text-navy">Change Email Address</h3>
                  <p className="text-gray-400 text-xs">You will be logged out after changing email</p>
                </div>
              </div>
              <form onSubmit={changeEmail} className="space-y-4">
                <div>
                  <label className="label">New Email Address</label>
                  <input
                    className="input"
                    type="email"
                    value={emailForm.new_email}
                    onChange={e => setEmailForm({ ...emailForm, new_email: e.target.value })}
                    placeholder="newemail@gmail.com"
                  />
                </div>
                <div>
                  <label className="label">Confirm with Current Password</label>
                  <div className="relative">
                    <input
                      className="input pr-10"
                      type={showCurrent ? 'text' : 'password'}
                      value={emailForm.password}
                      onChange={e => setEmailForm({ ...emailForm, password: e.target.value })}
                      placeholder="Enter your current password"
                    />
                    <EyeBtn show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
                  </div>
                </div>
                <button type="submit" disabled={savingEmail}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60">
                  {savingEmail ? 'Updating...' : '✉️ Update Email'}
                </button>
              </form>
            </div>

            {/* CHANGE PASSWORD CARD */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-xl">🔐</div>
                <div>
                  <h3 className="font-bold text-navy">Change Password</h3>
                  <p className="text-gray-400 text-xs">You will be logged out after changing password</p>
                </div>
              </div>
              <form onSubmit={changePassword} className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <div className="relative">
                    <input
                      className="input pr-10"
                      type={showCurrent ? 'text' : 'password'}
                      value={passForm.current_password}
                      onChange={e => setPassForm({ ...passForm, current_password: e.target.value })}
                      placeholder="Your current password"
                    />
                    <EyeBtn show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
                  </div>
                </div>
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <input
                      className="input pr-10"
                      type={showNew ? 'text' : 'password'}
                      value={passForm.new_password}
                      onChange={e => setPassForm({ ...passForm, new_password: e.target.value })}
                      placeholder="Min 6 characters"
                    />
                    <EyeBtn show={showNew} toggle={() => setShowNew(!showNew)} />
                  </div>
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <div className="relative">
                    <input
                      className="input pr-10"
                      type={showConfirm ? 'text' : 'password'}
                      value={passForm.confirm_password}
                      onChange={e => setPassForm({ ...passForm, confirm_password: e.target.value })}
                      placeholder="Repeat new password"
                    />
                    <EyeBtn show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
                  </div>
                </div>

                {/* Password strength indicator */}
                {passForm.new_password && (
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(4)].map((_, i) => {
                        const strength = passForm.new_password.length >= 12 ? 4
                          : passForm.new_password.length >= 8 ? 3
                          : passForm.new_password.length >= 6 ? 2 : 1;
                        return <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < strength
                          ? strength === 1 ? 'bg-red-400'
                          : strength === 2 ? 'bg-yellow-400'
                          : strength === 3 ? 'bg-blue-400'
                          : 'bg-green-400' : 'bg-gray-200'}`} />;
                      })}
                    </div>
                    <p className="text-xs text-gray-400">
                      {passForm.new_password.length < 6 ? '⚠️ Too short'
                        : passForm.new_password.length < 8 ? '🟡 Weak'
                        : passForm.new_password.length < 12 ? '🔵 Good'
                        : '🟢 Strong'}
                    </p>
                  </div>
                )}

                {/* Match indicator */}
                {passForm.confirm_password && (
                  <p className={`text-xs font-medium ${passForm.new_password === passForm.confirm_password ? 'text-green-500' : 'text-red-400'}`}>
                    {passForm.new_password === passForm.confirm_password ? '✅ Passwords match!' : '❌ Passwords do not match'}
                  </p>
                )}

                <button type="submit" disabled={savingPass}
                  className="w-full btn-primary py-3 disabled:opacity-60">
                  {savingPass ? 'Changing...' : '🔐 Change Password'}
                </button>
              </form>
            </div>

          </div>
        )}
      </AdminLayout>
    </>
  );
}
