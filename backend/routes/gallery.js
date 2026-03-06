const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToCloudinary, cloudinary } = require('../lib/cloudinary');

// GET /api/gallery
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

// POST /api/gallery — upload image or video to Cloudinary
router.post('/', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File is required' });
  const { title, description, category, is_featured, display_order } = req.body;
  if (!title || !category) return res.status(400).json({ error: 'Title and category are required' });

  try {
    const isVideo = req.file.mimetype.startsWith('video/');
    const mediaType = isVideo ? 'video' : 'image';

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'pvc-gallery',
      resource_type: isVideo ? 'video' : 'image',
      public_id: `${mediaType}-${Date.now()}`,
    });

    const fileUrl = result.secure_url;
    const publicId = result.public_id;

    // Add media_type column safely
    await pool.query(`ALTER TABLE gallery ADD COLUMN IF NOT EXISTS media_type VARCHAR(10) DEFAULT 'image'`).catch(() => {});
    await pool.query(`ALTER TABLE gallery ADD COLUMN IF NOT EXISTS cloudinary_id VARCHAR(255)`).catch(() => {});

    const [dbResult] = await pool.query(
      'INSERT INTO gallery (title,description,category,image_url,image_filename,is_featured,display_order,created_by,media_type,cloudinary_id) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [title, description||null, category, fileUrl, publicId, is_featured==='true'?1:0, parseInt(display_order)||0, req.user.id, mediaType, publicId]
    );

    const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [dbResult.insertId]);
    res.status(201).json(rows[0]);

  } catch (err) {
    console.error('Gallery upload error:', err.message);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

// PATCH /api/gallery/:id
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

// DELETE /api/gallery/:id — also deletes from Cloudinary
router.delete('/:id', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT cloudinary_id, media_type FROM gallery WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });

    // Delete from Cloudinary
    if (rows[0].cloudinary_id) {
      await cloudinary.uploader.destroy(rows[0].cloudinary_id, {
        resource_type: rows[0].media_type === 'video' ? 'video' : 'image'
      }).catch(() => {}); // ignore errors if already deleted
    }

    await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
