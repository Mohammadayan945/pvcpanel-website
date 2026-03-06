import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../lib/api';

const SERVICES = ['PVC Wall Panels', 'PVC Ceiling Panels', 'WPC Flooring', '3D Wall Panels', 'False Ceiling', 'Complete Makeover'];
const BUDGETS = ['Under ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000', 'Above ₹1,00,000'];
const TIMELINES = ['ASAP (Within 1 week)', 'Within 2 weeks', 'Within a month', 'Planning ahead (1-3 months)'];

export default function QuoteForm({ onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service_type: '', room_size: '', city: '', budget_range: '', timeline: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.service_type) return toast.error('Please fill required fields');
    setLoading(true);
    try {
      await API.post('/quotes', form);
      toast.success('Quote request submitted! We\'ll call you within 24 hours. 🎉');
      if (onClose) onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit. Try WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-navy font-bold">Get Free Quote</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-navy text-2xl">×</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Name *</label><input className="input" name="name" value={form.name} onChange={handle} placeholder="Your name" /></div>
            <div><label className="label">Phone *</label><input className="input" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765..." /></div>
          </div>
          <div><label className="label">Email</label><input className="input" name="email" type="email" value={form.email} onChange={handle} placeholder="email@example.com" /></div>
          <div>
            <label className="label">Service Required *</label>
            <select className="input" name="service_type" value={form.service_type} onChange={handle}>
              <option value="">Select service</option>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Room Size (sqft)</label><input className="input" name="room_size" value={form.room_size} onChange={handle} placeholder="e.g. 200 sqft" /></div>
            <div><label className="label">City</label><input className="input" name="city" value={form.city} onChange={handle} placeholder="Your city" /></div>
          </div>
          <div>
            <label className="label">Budget Range</label>
            <select className="input" name="budget_range" value={form.budget_range} onChange={handle}>
              <option value="">Select budget</option>
              {BUDGETS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Timeline</label>
            <select className="input" name="timeline" value={form.timeline} onChange={handle}>
              <option value="">When do you need it?</option>
              {TIMELINES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="label">Additional Details</label><textarea className="input h-24 resize-none" name="description" value={form.description} onChange={handle} placeholder="Any specific requirements..." /></div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base disabled:opacity-60">
            {loading ? 'Submitting...' : '📋 Request My Free Quote'}
          </button>
        </form>
      </div>
    </div>
  );
}
