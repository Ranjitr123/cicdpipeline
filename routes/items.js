const express = require('express');
const router = express.Router(); // ✅ define router
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// Create item (protected)
router.post('/', auth, body('title').notEmpty(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newItem = new Item({
      title: req.body.title,
      description: req.body.description || '',
      owner: req.user.id,
    });
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Read all items (protected)
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Read single item by ID (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update item (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    item.title = req.body.title || item.title;
    item.description = req.body.description || item.description;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete item (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router; // ✅ export router
