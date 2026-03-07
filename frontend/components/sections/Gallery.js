import { useState, useEffect } from 'react';
import API from '../../lib/api';

const CATEGORIES = ['all', 'wall-panels', 'ceiling', 'flooring', '3d-panels', 'makeover', 'exterior'];
const LABELS = { all: 'All Projects', 'wall-panels': 'Wall Panels', ceiling: 'Ceiling', flooring: 'Flooring', '3d-panels': '3D Panels', makeover: 'Makeover', exterior: 'Exterior' };

const PLACEHOLDER_COLORS = [
  'from-amber-700 to-amber-300', 'from-slate-800 to-slate-500', 'from-gray-100 to-gray-300',
  'from-yellow-600 to-yellow-300', 'from-green-800 to-green-500', 'from-red-800 to-red-500',
  'from-blue-900 to-blue-500', 'from-gray-600 to-gray-300', 'from-blue-800 to-blue-400',
];

export default function Gallery() {
  const [items, setItems]         = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading]     = useState(true);
  const [lightbox, setLightbox]   = useState(null); // selected item for fullscreen

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '');

  useEffect(() => {
    setLoading(true);
    API.get(`/gallery?category=${activeCategory}`)
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const images = items.filter(i => i.media_type !== 'video');
  const videos = items.filter(i => i.media_type === 'video');

  return (
    <section id="gallery" className="py-24 px-[5%] bg-cream">
      <div className="text-center mb-16">
        <span className="section-tag">Our Work</span>
        <h2 className="font-serif text-4xl text-navy mb-3">Projects That Speak for Themselves</h2>
        <p className="text-gray-500 max-w-xl mx-auto">Browse completed projects across homes, offices, and commercial spaces.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${activeCategory === cat ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-gray-200 hover:border-navy'}`}>
            {LABELS[cat]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-[4/3]" />)}
        </div>
      ) : items.length === 0 ? (
        // Placeholder when no DB images
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLACEHOLDER_COLORS.map((colors, i) => (
            <div key={i} className={`rounded-2xl bg-gradient-to-br ${colors} aspect-[4/3] relative group cursor-pointer overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-semibold">Sample Project {i + 1}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* PHOTOS GRID */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {images.map((img) => (
                <div key={img.id} onClick={() => setLightbox(img)}
                  className="rounded-2xl overflow-hidden aspect-[4/3] relative group cursor-pointer">
                  <img src={img.image_url?.startsWith("http") ? img.image_url : `${API_BASE}${img.image_url}`} alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <p className="text-white font-semibold">{img.title}</p>
                      <p className="text-white/60 text-sm">{LABELS[img.category]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIDEOS SECTION */}
          {videos.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-sm font-medium px-3">🎥 Project Videos</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map(vid => (
                  <div key={vid.id} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                    <div className="aspect-video bg-black">
                      <video
                        src={vid.image_url?.startsWith("http") ? vid.image_url : `${API_BASE}${vid.image_url}`}
                        controls
                        className="w-full h-full object-contain"
                        preload="metadata"
                        poster=""
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-navy font-semibold">{vid.title}</p>
                      {vid.description && <p className="text-gray-500 text-sm mt-1">{vid.description}</p>}
                      <span className="inline-block mt-2 text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-medium">
                        🎥 {LABELS[vid.category] || vid.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* LIGHTBOX for images */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="max-w-4xl w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white text-4xl font-light">×</button>
            <img src={lightbox.image_url?.startsWith("http") ? lightbox.image_url : `${API_BASE}${lightbox.image_url}`} alt={lightbox.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl" />
            <div className="mt-4 text-center">
              <p className="text-white font-semibold text-lg">{lightbox.title}</p>
              {lightbox.description && <p className="text-white/60 text-sm mt-1">{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
