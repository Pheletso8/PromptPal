import { Request, Response } from 'express';
import Course from '../models/Course';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Assign course to user
// @route   POST /api/admin/assign-course
// @access  Private/Admin
export const assignCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      res.status(404).json({ message: 'User or Course not found' });
      return;
    }

    if (user.assignedCourses.includes(courseId)) {
      res.status(400).json({ message: 'Course already assigned to this user' });
      return;
    }

    if (user.assignedCourses.length >= 5) {
      res.status(400).json({ message: 'User reached the maximum limit of 5 courses' });
      return;
    }

    user.assignedCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: 'Course assigned successfully', assignedCourses: user.assignedCourses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new course
// @route   POST /api/admin/courses
// @access  Private/Admin
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Update an existing course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import AssessmentMark from '../models/AssessmentMark';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCourses = await Course.countDocuments();
    
    // Live Pulse: Last 7 days activity
    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        dateStr: d.toISOString().split('T')[0],
        name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        value: 0
      };
    });

    const startIdxDate = new Date();
    startIdxDate.setDate(startIdxDate.getDate() - 7);

    const pulseRaw = await AssessmentMark.aggregate([
      {
        $match: {
          updatedAt: { $gte: startIdxDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    const livePulse = last7Days.map(day => {
      const match = pulseRaw.find(p => p._id === day.dateStr);
      return { name: day.name, value: match ? match.count : 0 };
    });

    const successMetrics = await AssessmentMark.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseDoc'
        }
      },
      { $unwind: '$courseDoc' },
      {
        $group: {
          _id: '$courseDoc.tag',
          passing: { $sum: { $cond: [ { $eq: ['$passed', true] }, 1, 0 ] } },
          progressing: { $sum: { $cond: [ { $eq: ['$passed', false] }, 1, 0 ] } }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          passing: 1,
          progressing: 1
        }
      }
    ]);

    const activeUsersAgg = await AssessmentMark.aggregate([
      { $match: { updatedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } } },
      { $group: { _id: '$user' } },
      { $count: 'active' }
    ]);
    const activeUsers = activeUsersAgg.length > 0 ? activeUsersAgg[0].active : 0;

    const stats = {
      livePulse,
      activeUsers,
      courseDistribution: await Course.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'assignedCourses',
            as: 'enrolledStudents'
          }
        },
        {
          $project: {
            name: { $ifNull: ['$tag', 'Unknown'] },
            value: { $size: '$enrolledStudents' }
          }
        }
      ]),
      successMetrics: successMetrics.length ? successMetrics : [{ name: 'N/A', passing: 0, progressing: 0 }],
      totalUsers,
      totalCourses,
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/Admin
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.disabled = !user.disabled;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const adminDeleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
