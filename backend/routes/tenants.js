import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Tenant from '../models/Tenant.js';

const router = express.Router();

router.post('/:slug/upgrade', protect, authorize('admin'), async (req, res) => {
  if (req.tenant.slug !== req.params.slug) {
    return res.status(403).json({ success: false, message: 'Not authorized to upgrade this tenant' });
  }

  const tenant = await Tenant.findOneAndUpdate(
    { slug: req.params.slug },
    { 'subscription.plan': 'pro' },
    { new: true }
  );

  if (!tenant) {
    return res.status(404).json({ success: false, message: 'Tenant not found' });
  }

  res.json({ success: true, message: `Tenant ${tenant.name} upgraded to Pro plan.` });
});

export default router;
