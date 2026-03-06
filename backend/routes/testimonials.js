const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY display_order');
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  const { client_name, city, rating, review, service_used } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO testimonials (client_name,city,rating,review,service_used) VALUES (?,?,?,?,?)',
      [client_name, city, rating||5, review, service_used]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const { is_active, display_order } = req.body;
  await pool.query('UPDATE testimonials SET is_active=COALESCE(?,is_active), display_order=COALESCE(?,display_order) WHERE id=?',[is_active!=null?is_active:null,display_order||null,req.params.id]);
  res.json({ success: true });
});

router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
