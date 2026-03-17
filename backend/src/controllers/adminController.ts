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

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCourses = await Course.countDocuments();
    
    // Simple mock stats for charts until real progression tracking is implemented
    const stats = {
      livePulse: [
        { name: 'Mon', value: 40 },
        { name: 'Tue', value: 30 },
        { name: 'Wed', value: 60 },
        { name: 'Thu', value: 45 },
        { name: 'Fri', value: 75 },
        { name: 'Sat', value: 35 },
        { name: 'Sun', value: 50 },
      ],
      activeUsers: Math.floor(totalUsers * 0.7), // 70% active DAU mock
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
            name: '$tag',
            value: { $size: '$enrolledStudents' }
          }
        }
      ]),
      successMetrics: await Course.aggregate([
        {
          $project: {
            name: '$tag',
            passing: { $multiply: [{ $rand: {} }, 50] }, // Mock data
            progressing: { $multiply: [{ $rand: {} }, 50] } // Mock data
          }
        }
      ]),
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
