import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get leaderboard top users
// @route   GET /api/leaderboard
// @access  Public (or Private depending on needs)
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    // Sort by assessmentsPassed descending, then by stars descending
    const users = await User.find({ role: 'user' }) // only rank users, not admins
      .select('name stars assessmentsPassed')
      .sort({ assessmentsPassed: -1, stars: -1 })
      .limit(100);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
