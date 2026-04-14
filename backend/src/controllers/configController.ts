import { Request, Response } from 'express';
import PlatformConfig from '../models/PlatformConfig';

interface AuthRequest extends Request {
  user?: any;
}

// Helper — get or create the singleton config document
const getOrCreate = async () => {
  let config = await PlatformConfig.findOne();
  if (!config) {
    config = await PlatformConfig.create({});
  }
  return config;
};

// @desc    Get platform config
// @route   GET /api/config
// @access  Private/Admin
export const getConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const config = await getOrCreate();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update platform config
// @route   PUT /api/config
// @access  Private/Admin
export const updateConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let config = await PlatformConfig.findOne();
    if (!config) {
      config = await PlatformConfig.create(req.body);
    } else {
      Object.assign(config, req.body);
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
