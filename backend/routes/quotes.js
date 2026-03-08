const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { name, phone, email, service_type, room_size, city, address, budget_range, timeline, description } = req.body;
  if (!name || !phone || !service_type) return res.status(400).json({ error: 'Name, phone, and service type are required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO quote_requests (name,phone,email,service_type,room_size,city,address,budget_range,timeline,description,ip_address) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [name,phone,email||null,service_type,room_size||null,city||null,address||null,budget_range||null,timeline||null,description||null,req.ip]
    );
    res.status(201).json({ success: true, message: 'Quote request submitted! We will contact you within 24 hours.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit' });
  }
});

router.get('/', auth, async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    let q = 'SELECT * FROM quote_requests';
    let countQ = 'SELECT COUNT(*) as total FROM quote_requests';
    const params = [];
    if (status) { q += ' WHERE status = ?'; countQ += ' WHERE status = ?'; params.push(status); }
    q += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const [rows] = await pool.query(q, [...params, parseInt(limit), parseInt(offset)]);
    const [total] = await pool.query(countQ, params);
    res.json({ quotes: rows, total: total[0].total, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM quote_requests WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Quote not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const { status, notes, quote_amount, site_visit_date } = req.body;
  try {
    await pool.query(
      'UPDATE quote_requests SET status=COALESCE(?,status), notes=COALESCE(?,notes), quote_amount=COALESCE(?,quote_amount), site_visit_date=COALESCE(?,site_visit_date) WHERE id=?',
      [status||null, notes||null, quote_amount||null, site_visit_date||null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
