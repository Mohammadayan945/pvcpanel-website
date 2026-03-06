import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookies from 'js-cookie';

const NAV = [
  { href: '/admin',              icon: '📊', label: 'Dashboard' },
  { href: '/admin/contacts',     icon: '📬', label: 'Contacts' },
  { href: '/admin/quotes',       icon: '📋', label: 'Quotes' },
  { href: '/admin/gallery',      icon: '🖼️', label: 'Gallery' },
  { href: '/admin/services',     icon: '🛠️', label: 'Services' },
  { href: '/admin/reviews',      icon: '⭐', label: 'Reviews' },
  { href: '/admin/stats',        icon: '📈', label: 'Stats & Features' },
  { href: '/admin/settings',     icon: '⚙️', label: 'Settings' },
  { href: '/admin/profile',      icon: '👤', label: 'Profile & Security' },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!Cookies.get('admin_token')) {
      router.replace('/admin/login');
    } else {
      setChecking(false);
    }
  }, []);

  const logout = () => {
    Cookies.remove('admin_token');
    router.push('/admin/login');
  };

  if (checking) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-navy flex flex-col fixed top-0 left-0 bottom-0 z-40">
        <div className="p-6 border-b border-white/10">
          <p className="font-serif text-xl font-black text-white">Panel<span className="text-gold">Craft</span></p>
          <p className="text-white/40 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${router.pathname === n.href ? 'bg-gold text-navy font-bold' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <span>{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm transition-all">
            🚪 Logout
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-8">
        {title && <h1 className="font-serif text-2xl font-bold text-navy mb-7">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
