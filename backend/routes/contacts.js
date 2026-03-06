const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { name, phone, email, service, message } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO contacts (name, phone, email, service, message, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, email||null, service||null, message||null, req.ip]
    );
    res.status(201).json({ success: true, message: 'Message received! We will contact you soon.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

router.get('/', auth, async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    let q = 'SELECT * FROM contacts';
    let countQ = 'SELECT COUNT(*) as total FROM contacts';
    const params = [];
    if (status) { q += ' WHERE status = ?'; countQ += ' WHERE status = ?'; params.push(status); }
    q += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const [rows] = await pool.query(q, [...params, parseInt(limit), parseInt(offset)]);
    const [total] = await pool.query(countQ, params);
    res.json({ contacts: rows, total: total[0].total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const { status } = req.body;
  const valid = ['new', 'read', 'responded', 'closed'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    await pool.query('UPDATE contacts SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
