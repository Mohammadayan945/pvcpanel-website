import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Services', 'Gallery', 'About', 'Process', 'Contact'];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 px-[5%] flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3 bg-navy/95 backdrop-blur-md shadow-lg' : 'py-5'}`}>
        <Link href="/" className="font-serif text-2xl font-black text-white">
          Panel<span className="text-gold">Craft</span> Pro
        </Link>
        <ul className="hidden md:flex gap-8 list-none">
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="text-white/80 hover:text-gold transition-colors text-sm font-medium">{l}</a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="hidden md:block btn-primary text-sm">Get Free Quote</a>
        <button className="md:hidden flex flex-col gap-1.5 cursor-pointer" onClick={() => setOpen(!open)}>
          <span className="w-6 h-0.5 bg-white rounded block"></span>
          <span className="w-6 h-0.5 bg-white rounded block"></span>
          <span className="w-6 h-0.5 bg-white rounded block"></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 bg-navy z-40 flex flex-col items-center justify-center gap-8" onClick={() => setOpen(false)}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-white font-serif text-3xl hover:text-gold transition-colors">{l}</a>
          ))}
        </div>
      )}
    </>
  );
}
