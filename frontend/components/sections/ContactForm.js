import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../lib/api';

const SERVICES = ['PVC Wall Panels', 'PVC Ceiling Panels', 'WPC Flooring', '3D Wall Panels', 'False Ceiling', 'Complete Makeover'];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error('Name and phone are required');
    setLoading(true);
    try {
      await API.post('/contacts', form);
      toast.success('Message sent! We will call you soon. 🎉');
      setForm({ name: '', phone: '', email: '', service: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send. Please try WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-cream rounded-2xl p-8 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Full Name *</label>
          <input className="input" name="name" value={form.name} onChange={handle} placeholder="Your name" />
        </div>
        <div>
          <label className="label">Phone *</label>
          <input className="input" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" />
        </div>
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" />
      </div>
      <div>
        <label className="label">Service Required</label>
        <select className="input" name="service" value={form.service} onChange={handle}>
          <option value="">Select a service</option>
          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Message</label>
        <textarea className="input h-28 resize-none" name="message" value={form.message} onChange={handle} placeholder="Tell us about your project..." />
      </div>
      <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base disabled:opacity-60">
        {loading ? 'Sending...' : '🚀 Send Free Quote Request'}
      </button>
    </form>
  );
}
