import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getLeaderboard);

export default router;
