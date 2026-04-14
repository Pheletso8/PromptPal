import { Request, Response } from 'express';
import Course from '../models/Course';
import User from '../models/User';

// ─── @desc   Get all courses assigned to the logged-in user ──────────────────
// ─── @route  GET /api/courses/my-courses
// ─── @access Private
export const getMyCourses = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).populate('assignedCourses');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user.assignedCourses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc   Get all available courses (for the course catalog) ─────────────
// ─── @route  GET /api/courses
// ─── @access Private
export const getAllCourses = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc   Get one course by MongoDB _id ───────────────────────────────────
// ─── @route  GET /api/courses/:id
// ─── @access Private
export const getCourseById = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      // For the assessment section, we strip the correctAnswer before sending
      // so the client cannot cheat by inspecting the network response.
      const courseObj = course.toObject();
      
      // Fallback for older courses with single 'assessment'
      if ((courseObj as any).assessment) {
        delete (courseObj as any).assessment.correctAnswer;
      }
      
      if ((courseObj as any).assessments) {
        (courseObj as any).assessments = (courseObj as any).assessments.map((a: any) => {
          delete a.correctAnswer;
          return a;
        });
      }
      res.json(courseObj);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc   Get progress data for the logged-in user on all their courses ───
// ─── @route  GET /api/courses/my-progress
// ─── @access Private
export const getMyProgress = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const AssessmentMark = (await import('../models/AssessmentMark')).default;
    const marks = await AssessmentMark.find({ user: req.user._id });
    // Build a map: courseId -> { score, passed }
    const progressMap: Record<string, { score: number; passed: boolean }> = {};
    for (const mark of marks) {
      progressMap[mark.course.toString()] = { score: mark.score, passed: mark.passed };
    }
    res.json(progressMap);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
