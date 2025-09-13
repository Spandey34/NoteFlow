import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Note from '../models/Note.js';
import Tenant from '../models/Tenant.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    req.tenant = await Tenant.findById(req.user.tenantId);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'User role not authorized' });
    }
    next();
  };
};

export const checkNoteLimit = async (req, res, next) => {
  if (req.tenant.subscription.plan === 'free') {
    const noteCount = await Note.countDocuments({ tenantId: req.user.tenantId });
    if (noteCount >= 3) {
      return res.status(403).json({ success: false, message: 'Note limit reached. Please upgrade to Pro.' });
    }
  }
  next();
};
