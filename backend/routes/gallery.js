const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    let q = 'SELECT * FROM gallery WHERE 1=1';
    const params = [];
    if (category && category !== 'all') { q += ' AND category = ?'; params.push(category); }
    q += ' ORDER BY display_order ASC, created_at DESC';
    const [rows] = await pool.query(q, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File is required' });
  const { title, description, category, is_featured, display_order } = req.body;
  if (!title || !category) return res.status(400).json({ error: 'Title and category are required' });

  const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
  const fileUrl = `/uploads/${req.file.filename}`;

  try {
    const [result] = await pool.query(
      'INSERT INTO gallery (title,description,category,image_url,image_filename,is_featured,display_order,created_by,media_type) VALUES (?,?,?,?,?,?,?,?,?)',
      [title, description||null, category, fileUrl, req.file.filename, is_featured==='true'?1:0, parseInt(display_order)||0, req.user.id, mediaType]
    );
    const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: 'Failed to save file' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  const { title, description, category, is_featured, display_order } = req.body;
  try {
    await pool.query(
      'UPDATE gallery SET title=COALESCE(?,title), description=COALESCE(?,description), category=COALESCE(?,category), is_featured=COALESCE(?,is_featured), display_order=COALESCE(?,display_order) WHERE id=?',
      [title||null, description||null, category||null, is_featured!=null?is_featured:null, display_order||null, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT image_filename FROM gallery WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'File not found' });
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', rows[0].image_filename);
    fs.unlink(filePath, () => {});
    await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
