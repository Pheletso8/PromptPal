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
export const getConfig = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const config = await getOrCreate();
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get public platform settings
// @route   GET /api/config/public
// @access  Public
export const getPublicConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const config = await getOrCreate();

    res.json({
      platformName: config.platformName,
      tagline: config.tagline,
      maintenanceMode: config.maintenanceMode,
      registrationOpen: config.registrationOpen,
      announcementEnabled: config.announcementEnabled,
      announcementText: config.announcementText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update platform config
// @route   PUT /api/config
// @access  Private/Admin
export const updateConfig = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log('--------------------------------------------------');
    console.log(
      '[CONFIG UPDATE] INCOMING REQUEST BODY:',
      JSON.stringify(req.body, null, 2)
    );

    const {
      _id,
      createdAt,
      updatedAt,
      __v,
      ...updateData
    } = req.body;

    console.log(
      '[CONFIG UPDATE] STRIPPED UPDATE DATA:',
      JSON.stringify(updateData, null, 2)
    );

    const config = await PlatformConfig.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    if (!config) {
      res.status(500).json({
        message: 'Failed to update configuration',
      });
      return;
    }

    console.log(
      '[CONFIG UPDATE] SUCCESS! NEW STATE:',
      JSON.stringify(
        {
          maintenanceMode: config.maintenanceMode,
          updatedAt: (config as any).updatedAt,
        },
        null,
        2
      )
    );

    console.log('--------------------------------------------------');

    res.json(config);
  } catch (error) {
    console.error('[CONFIG UPDATE] ERROR FATAL:', error);

    res.status(500).json({
      message: 'Server error',
    });
  }
};