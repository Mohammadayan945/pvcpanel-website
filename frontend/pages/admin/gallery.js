import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['wall-panels', 'ceiling', 'flooring', '3d-panels', 'makeover', 'exterior'];
const CAT_LABELS = { 'wall-panels': 'Wall Panels', ceiling: 'Ceiling', flooring: 'Flooring', '3d-panels': '3D Panels', makeover: 'Makeover', exterior: 'Exterior' };

export default function AdminGallery() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ title: '', category: 'wall-panels', description: '', is_featured: false });
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [fileType, setFileType] = useState('image'); // 'image' or 'video'
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  const load = () => {
    API.get('/gallery').then(r => setItems(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const isVideo = f.type.startsWith('video/');
    setFileType(isVideo ? 'video' : 'image');
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    if (!form.title) return toast.error('Please enter a title');
    setUploading(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append('image', file); // backend accepts 'image' field for both
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await API.post('/gallery', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      load();
      setShowForm(false);
      setFile(null);
      setPreview(null);
      setProgress(0);
      setForm({ title: '', category: 'wall-panels', description: '', is_featured: false });
      toast.success(`${fileType === 'video' ? '🎥 Video' : '📸 Image'} uploaded successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await API.delete(`/gallery/${id}`);
      setItems(items.filter(i => i.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '');
  const images = items.filter(i => i.media_type !== 'video');
  const videos = items.filter(i => i.media_type === 'video');

  return (
    <>
      <Head><title>Gallery – Admin</title></Head>
      <AdminLayout title="Gallery Management">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 text-sm text-gray-500">
            <span>📸 {images.length} images</span>
            <span>🎥 {videos.length} videos</span>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary py-2 px-6 text-sm">+ Upload Image / Video</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse" />)}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🖼️</p>
            <p>No media yet. Upload your first project photo or video!</p>
          </div>
        ) : (
          <>
            {/* IMAGES */}
            {images.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-navy mb-4">📸 Photos ({images.length})</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map(img => (
                    <div key={img.id} className="rounded-2xl overflow-hidden bg-white shadow-sm group relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={img.image_url?.startsWith("http") ? img.image_url : `${API_BASE}${img.image_url}`} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3">
                        <p className="text-navy font-semibold text-sm truncate">{img.title}</p>
                        <p className="text-gray-400 text-xs capitalize">{CAT_LABELS[img.category] || img.category}</p>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => deleteItem(img.id)} className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-sm shadow">×</button>
                      </div>
                      {img.is_featured == 1 && <div className="absolute top-3 left-3 bg-gold text-navy text-xs font-bold px-2 py-1 rounded-full">⭐ Featured</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIDEOS */}
            {videos.length > 0 && (
              <div>
                <h3 className="font-bold text-navy mb-4">🎥 Videos ({videos.length})</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {videos.map(vid => (
                    <div key={vid.id} className="rounded-2xl overflow-hidden bg-white shadow-sm group relative">
                      <div className="aspect-video bg-black overflow-hidden">
                        <video
                          src={vid.image_url?.startsWith("http") ? vid.image_url : `${API_BASE}${vid.image_url}`}
                          controls
                          className="w-full h-full object-contain"
                          preload="metadata"
                        />
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="text-navy font-semibold text-sm">{vid.title}</p>
                          <p className="text-gray-400 text-xs capitalize">{CAT_LABELS[vid.category] || vid.category} · 🎥 Video</p>
                        </div>
                        <button onClick={() => deleteItem(vid.id)} className="w-8 h-8 bg-red-100 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-sm">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* UPLOAD MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-navy/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !uploading && setShowForm(false)}>
            <div className="bg-white rounded-2xl p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-navy text-xl">Upload Photo / Video</h3>
                {!uploading && <button onClick={() => setShowForm(false)} className="text-gray-400 text-2xl">×</button>}
              </div>

              <form onSubmit={submit} className="space-y-4">
                {/* Drop Zone */}
                <div
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => !uploading && document.getElementById('file-input').click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${dragOver ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold'}`}>

                  {preview ? (
                    fileType === 'video' ? (
                      <div>
                        <video src={preview} className="max-h-40 mx-auto rounded-xl" controls />
                        <p className="text-green-600 text-sm font-medium mt-2">🎥 Video ready to upload</p>
                        <p className="text-gray-400 text-xs">{file?.name} ({(file?.size / 1024 / 1024).toFixed(1)} MB)</p>
                      </div>
                    ) : (
                      <img src={preview} alt="preview" className="max-h-40 mx-auto rounded-xl object-cover" />
                    )
                  ) : (
                    <div>
                      <p className="text-5xl mb-3">📁</p>
                      <p className="text-gray-600 font-medium">Drag & drop or click to browse</p>
                      <div className="flex justify-center gap-4 mt-3">
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">📸 JPG, PNG, WEBP</span>
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-medium">🎥 MP4, MOV, AVI, WEBM</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">Max 100MB for videos · 5MB for images</p>
                    </div>
                  )}
                  <input id="file-input" type="file" accept="image/*,video/*" className="hidden"
                    onChange={e => handleFile(e.target.files[0])} disabled={uploading} />
                </div>

                <div>
                  <label className="label">Title *</label>
                  <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder={fileType === 'video' ? 'e.g. Living Room Transformation Video' : 'e.g. Wooden Texture Living Room'} />
                </div>

                <div>
                  <label className="label">Category *</label>
                  <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Description (optional)</label>
                  <textarea className="input h-20 resize-none" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief description of this project..." />
                </div>

                {fileType === 'image' && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured}
                      onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-gold" />
                    <span className="text-sm text-navy font-medium">⭐ Mark as Featured</span>
                  </label>
                )}

                {/* Upload Progress Bar */}
                {uploading && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Uploading {fileType === 'video' ? 'video' : 'image'}...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gold h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      {fileType === 'video' ? '⏳ Videos may take a moment...' : '⏳ Uploading...'}
                    </p>
                  </div>
                )}

                <button type="submit" disabled={uploading || !file}
                  className="w-full btn-primary py-4 text-base disabled:opacity-60">
                  {uploading ? `Uploading... ${progress}%` : fileType === 'video' ? '🎥 Upload Video' : '📸 Upload Photo'}
                </button>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
