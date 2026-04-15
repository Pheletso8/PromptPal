import express from 'express';
import { getConfig, updateConfig, getPublicConfig } from '../controllers/configController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/public', getPublicConfig);

router.route('/')
  .get(protect, admin, getConfig)
  .put(protect, admin, updateConfig);

export default router;
