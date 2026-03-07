const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
  try {
    const [[contacts]] = await pool.query("SELECT COUNT(*) total, SUM(status='new') as new_count FROM contacts");
    const [[quotes]]   = await pool.query("SELECT COUNT(*) total, SUM(status='pending') as pending_count, SUM(status='won') as won_count FROM quote_requests");
    const [[gallery]]  = await pool.query('SELECT COUNT(*) total FROM gallery');
    const [recentC]    = await pool.query('SELECT id,name,phone,status,created_at FROM contacts ORDER BY created_at DESC LIMIT 5');
    const [recentQ]    = await pool.query('SELECT id,name,phone,service_type,status,created_at FROM quote_requests ORDER BY created_at DESC LIMIT 5');
    const [byStatus]   = await pool.query('SELECT status, COUNT(*) as count FROM quote_requests GROUP BY status');

    res.json({
      stats: {
        total_contacts:  parseInt(contacts.total),
        new_contacts:    parseInt(contacts.new_count)||0,
        total_quotes:    parseInt(quotes.total),
        pending_quotes:  parseInt(quotes.pending_count)||0,
        won_quotes:      parseInt(quotes.won_count)||0,
        gallery_images:  parseInt(gallery.total),
      },
      recent_contacts: recentC,
      recent_quotes:   recentQ,
      quotes_by_status: byStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
