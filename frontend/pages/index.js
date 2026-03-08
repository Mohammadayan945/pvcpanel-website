import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/layout/Navbar';
import ContactForm from '../components/sections/ContactForm';
import Gallery from '../components/sections/Gallery';
import QuoteForm from '../components/sections/QuoteForm';
import API from '../lib/api';

const SERVICES_DEFAULT = [
  { icon: '🏠', name: 'PVC Wall Panels', desc: 'Waterproof, low-maintenance panels in 50+ textures and finishes for any room.' },
  { icon: '✨', name: 'PVC Ceiling Panels', desc: 'Elegant ceiling solutions that hide imperfections and add a premium look.' },
  { icon: '🏢', name: 'WPC Flooring', desc: 'Wood-polymer composite flooring — the look of hardwood with extreme durability.' },
  { icon: '🎨', name: '3D Wall Panels', desc: 'Add depth and drama with stunning geometric and organic 3D patterns.' },
  { icon: '💡', name: 'False Ceiling', desc: 'Designer ceilings with integrated LED cove lighting and custom drops.' },
  { icon: '🛠️', name: 'Complete Makeover', desc: 'Full room transformation — walls, ceiling, flooring, and lighting.' },
];

const STEPS = [
  { n: '1', title: 'Contact Us', desc: 'Call, WhatsApp, or fill our form. We respond within 24 hours.' },
  { n: '2', title: 'Free Site Visit', desc: 'Our expert visits your space, takes measurements, and understands your vision.' },
  { n: '3', title: 'Design & Quote', desc: 'You receive a detailed design mockup and transparent cost breakdown.' },
  { n: '4', title: 'Installation', desc: 'Our team installs with precision. Clean site, zero mess, on-time delivery.' },
];

const FAQ = [
  { q: 'What is a PVC panel and what are its benefits?', a: 'PVC panels are waterproof wall/ceiling cladding. Benefits: 100% waterproof, termite-proof, easy to clean, low maintenance, 15–20 year lifespan.' },
  { q: 'How long does installation take?', a: 'Most single rooms are done in 1–2 days. Full home projects take 3–7 days.' },
  { q: 'Are PVC panels waterproof? Suitable for bathrooms?', a: 'Yes! 100% waterproof — ideal for bathrooms, kitchens, and wet areas.' },
  { q: 'What is the cost per square foot?', a: 'Starts from ₹35/sqft for basic panels, up to ₹120/sqft for premium 3D panels.' },
  { q: 'Do you provide warranty?', a: '1-year installation warranty + 3–5 year manufacturer warranty on panels.' },
  { q: 'Which cities do you serve?', a: 'Delhi NCR, Mumbai, Bangalore, Pune, Lucknow, Noida and surrounding areas.' },
];

const DEFAULT_SETTINGS = {
  business_name: 'PanelCraft Pro',
  business_phone: '+91 98765 43210',
  business_email: 'info@panelcraftpro.com',
  business_address: '123 Interior Hub, Sector 18, Noida',
  whatsapp_number: '919876543210',
  hero_title: 'Transform Your Space with Premium PVC Panels',
  hero_subtitle: 'Professional installation for homes, offices & commercial spaces',
  stat_1_value: '500+', stat_1_label: 'Happy Clients',
  stat_2_value: '10+',  stat_2_label: 'Years in Business',
  stat_3_value: '50+',  stat_3_label: 'Panel Designs',
  stat_4_value: '5★',   stat_4_label: 'Average Rating',
  stat_5_value: '3yr',  stat_5_label: 'Warranty Offered',
  stat_6_value: '24hr', stat_6_label: 'Response Time',
  feature_1_icon: '🏆', feature_1_title: 'Premium Quality Materials',  feature_1_desc: 'We source only Grade-A PVC panels from certified manufacturers.',
  feature_2_icon: '👷', feature_2_title: 'Expert Installation Team',   feature_2_desc: '10+ years of installation experience for a flawless finish every time.',
  feature_3_icon: '💰', feature_3_title: 'Transparent Pricing',        feature_3_desc: 'No hidden costs. What we quote is exactly what you pay.',
  feature_4_icon: '⏱️', feature_4_title: 'On-Time Delivery',           feature_4_desc: 'Every project completed on schedule without compromising quality.',
};

export default function Home() {
  const [openFaq, setOpenFaq]     = useState(null);
  const [showQuote, setShowQuote] = useState(false);
  const [settings, setSettings]   = useState(DEFAULT_SETTINGS);
  const [services, setServices]   = useState([]);
  const [reviews, setReviews]     = useState([]);

  useEffect(() => {
    // Load settings
    API.get('/settings').then(r => setSettings({ ...DEFAULT_SETTINGS, ...r.data })).catch(() => {});
    // Load services from DB
    API.get('/services').then(r => setServices(r.data)).catch(() => {});
    // Load reviews from DB
    API.get('/testimonials').then(r => setReviews(r.data)).catch(() => {});
  }, []);

  const s = settings; // shorthand

  const STATS = [
    [s.stat_1_value, s.stat_1_label],
    [s.stat_2_value, s.stat_2_label],
    [s.stat_3_value, s.stat_3_label],
    [s.stat_4_value, s.stat_4_label],
    [s.stat_5_value, s.stat_5_label],
    [s.stat_6_value, s.stat_6_label],
  ];

  const FEATURES = [
    [s.feature_1_icon, s.feature_1_title, s.feature_1_desc],
    [s.feature_2_icon, s.feature_2_title, s.feature_2_desc],
    [s.feature_3_icon, s.feature_3_title, s.feature_3_desc],
    [s.feature_4_icon, s.feature_4_title, s.feature_4_desc],
  ];

  return (
    <>
      <Head>
        <title>{s.business_name} – Premium PVC Panel Contractors</title>
        <meta name="description" content={s.hero_subtitle} />
      </Head>

      <Navbar settings={settings} />

      {/* HERO */}
      <section id="home" className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#1B3F72] to-[#0D2A4A] flex items-center px-[5%] relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl pt-20 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-gold px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            ⭐ #1 PVC Panel Contractor
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-black leading-tight mb-6">
            Transform Your Space with <span className="text-gold">Premium PVC Panels</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-xl">{s.hero_subtitle}</p>
          <div className="flex gap-4 flex-wrap mb-12">
            <button onClick={() => setShowQuote(true)} className="btn-primary text-base">Get Free Quote</button>
            <a href="#gallery" className="btn-outline text-base">View Our Work</a>
          </div>
          <div className="flex gap-12">
            {[[settings.stat_1_value||'50+', settings.stat_1_label||'Projects Done'],[settings.stat_2_value||'4+', settings.stat_2_label||'Years Experience'],[settings.stat_3_value||'98%', settings.stat_3_label||'Client Satisfaction']].map(([n,l]) => (
              <div key={l}><p className="font-serif text-3xl text-gold font-bold">{n}</p><p className="text-white/50 text-sm">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES — loads from DB ✅ */}
      <section id="services" className="py-24 px-[5%] bg-white">
        <div className="text-center mb-16">
          <span className="section-tag">Our Services</span>
          <h2 className="font-serif text-4xl text-navy mb-3">Everything for a Perfect Interior</h2>
          <p className="text-gray-500 max-w-xl mx-auto">From walls to ceilings, we cover every surface with premium PVC panels and expert installation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {(services.length > 0 ? services : SERVICES_DEFAULT).map(sv => (
            <div key={sv.id || sv.name} className="card p-7 border-transparent hover:border-gold/30 hover:-translate-y-2">
              <div className="text-4xl mb-4">{sv.icon}</div>
              <h3 className="font-bold text-navy text-lg mb-2">{sv.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{sv.description || sv.desc}</p>
              {(sv.price_from || sv.price_to) && (
                <p className="text-gold font-semibold text-sm mt-3">₹{sv.price_from} – ₹{sv.price_to} /sqft</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* WHY US — loads from DB ✅ */}
      <section id="about" className="py-24 px-[5%] bg-navy">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-tag">Why Choose Us</span>
            <h2 className="font-serif text-4xl text-white font-bold mb-4">The {s.business_name} Difference</h2>
            <p className="text-white/60 leading-relaxed mb-8">We don't just install panels — we deliver a premium experience from consultation to completion.</p>
            <div className="space-y-5">
              {FEATURES.map(([icon, title, desc]) => (
                <div key={title} className="flex gap-4">
                  <div className="w-11 h-11 min-w-11 bg-gold/15 rounded-xl flex items-center justify-center text-xl">{icon}</div>
                  <div><h4 className="text-white font-semibold mb-1">{title}</h4><p className="text-white/50 text-sm">{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          {/* STATS — loads from DB ✅ */}
          <div className="grid grid-cols-2 gap-5 bg-white/5 border border-white/10 rounded-3xl p-8">
            {STATS.map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="font-serif text-3xl text-gold font-bold">{val}</p>
                <p className="text-white/50 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <Gallery />

      {/* PROCESS */}
      <section id="process" className="py-24 px-[5%] bg-white">
        <div className="text-center mb-16">
          <span className="section-tag">How It Works</span>
          <h2 className="font-serif text-4xl text-navy mb-3">From First Call to Final Finish</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Our streamlined 4-step process makes your renovation stress-free.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
          <div className="hidden lg:block absolute top-9 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-gold to-gold-light" />
          {STEPS.map(st => (
            <div key={st.n} className="text-center relative z-10">
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-navy to-blue flex items-center justify-center font-serif text-2xl font-black text-white mx-auto mb-5 border-[3px] border-gold">{st.n}</div>
              <h4 className="text-navy font-bold mb-2">{st.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS — loads from DB ✅ */}
      <section className="py-24 px-[5%] bg-navy">
        <div className="text-center mb-14">
          <span className="section-tag">Client Reviews</span>
          <h2 className="font-serif text-4xl text-white font-bold">What Our Clients Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {reviews.map(r => (
            <div key={r.id} className="bg-white/6 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className={i < r.rating ? 'text-gold' : 'text-white/20'}>★</span>)}
              </div>
              <p className="text-white/75 text-sm leading-relaxed italic mb-5">"{r.review}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy font-bold text-sm">
                  {r.client_name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{r.client_name}</p>
                  <p className="text-white/40 text-xs">{r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-[5%] bg-cream">
        <div className="text-center mb-14">
          <span className="section-tag">FAQ</span>
          <h2 className="font-serif text-4xl text-navy font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {FAQ.map((f, i) => (
            <div key={i} className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${openFaq === i ? 'border-gold' : 'border-gray-100'}`}>
              <button className="w-full flex justify-between items-center px-6 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="text-navy font-semibold text-sm">{f.q}</span>
                <span className={`text-gold text-2xl font-light transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-[5%] bg-white">
        <div className="text-center mb-14">
          <span className="section-tag">Get In Touch</span>
          <h2 className="font-serif text-4xl text-navy font-bold">Ready to Transform Your Space?</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">Get a free consultation. Our team will reach out within 24 hours.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 max-w-5xl mx-auto items-start">
          <ContactForm />
          <div>
            <h3 className="font-serif text-2xl text-navy font-bold mb-3">Let's Start Your Project</h3>
            <p className="text-gray-500 mb-7 leading-relaxed">Whether you're renovating one room or your entire home, our experts guide you every step of the way.</p>
            <div className="space-y-5 mb-7">
              {[['📞','Call Us', s.business_phone,'Mon–Sat, 9am–7pm'],['✉️','Email Us', s.business_email,'We reply within 24hr'],['📍','Visit Showroom', s.business_address,'Open Mon–Sat']].map(([icon,title,l1,l2]) => (
                <div key={title} className="flex gap-4">
                  <div className="w-11 h-11 min-w-11 bg-gradient-to-br from-navy to-blue rounded-xl flex items-center justify-center text-lg">{icon}</div>
                  <div><p className="text-navy font-semibold text-sm">{title}</p><p className="text-gray-500 text-sm">{l1}</p><p className="text-gray-400 text-xs">{l2}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080F1C] py-14 px-[5%]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 max-w-6xl mx-auto">
          <div className="md:col-span-2">
            <p className="font-serif text-2xl text-white font-black mb-3">{s.business_name}</p>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">Premium PVC panel installation for homes, offices, and commercial spaces.</p>
            <div className="mt-4 space-y-1">
              <p className="text-white/40 text-sm">📞 {s.business_phone}</p>
              <p className="text-white/40 text-sm">✉️ {s.business_email}</p>
              <p className="text-white/40 text-sm">📍 {s.business_address}</p>
            </div>
          </div>
          <div>
            <p className="text-white font-bold mb-4 text-sm">Quick Links</p>
            <ul className="space-y-2">
              {['Home','Services','Gallery','About','Contact'].map(l => (
                <li key={l}><a href={`#${l.toLowerCase()}`} className="text-white/40 hover:text-gold text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white font-bold mb-4 text-sm">Services</p>
            <ul className="space-y-2">
              {(services.length > 0 ? services : SERVICES_DEFAULT).slice(0,5).map(sv => (
                <li key={sv.name}><a href="#services" className="text-white/40 hover:text-gold text-sm transition-colors">{sv.name}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/8 pt-6 flex flex-wrap justify-between items-center gap-4 max-w-6xl mx-auto">
          <p className="text-white/25 text-sm">© 2025 {s.business_name}. All rights reserved.</p>
          <p className="text-white/25 text-sm">Privacy Policy · Terms of Service</p>
        </div>
      </footer>

      <a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noreferrer"
        className="fixed bottom-7 right-7 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-2xl shadow-lg shadow-green-500/40 z-50 hover:scale-110 transition-transform animate-pulse">
        💬
      </a>

      {showQuote && <QuoteForm onClose={() => setShowQuote(false)} />}
    </>
  );
}
