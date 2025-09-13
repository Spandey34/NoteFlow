import express from 'express';
import { protect, checkNoteLimit } from '../middleware/auth.js';
import Note from '../models/Note.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const notes = await Note.find({ tenantId: req.user.tenantId });
  res.json({ success: true, data: notes });
});

router.post('/', checkNoteLimit, async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({
    title,
    content,
    userId: req.user._id,
    tenantId: req.user.tenantId,
  });
  res.status(201).json({ success: true, data: note });
});

router.route('/:id')
  .get(async (req, res) => {
    const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: note });
  })
  .put(async (req, res) => {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: note });
  })
  .delete(async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: {} });
  });

export default router;
