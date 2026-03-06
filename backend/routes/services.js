const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order');
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  const { name, slug, description, icon, price_from, price_to } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO services (name,slug,description,icon,price_from,price_to) VALUES (?,?,?,?,?,?)',
      [name, slug, description, icon, price_from, price_to]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const { name, description, icon, price_from, price_to, is_active } = req.body;
  try {
    await pool.query(
      'UPDATE services SET name=COALESCE(?,name),description=COALESCE(?,description),icon=COALESCE(?,icon),price_from=COALESCE(?,price_from),price_to=COALESCE(?,price_to),is_active=COALESCE(?,is_active) WHERE id=?',
      [name||null,description||null,icon||null,price_from||null,price_to||null,is_active!=null?is_active:null,req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
