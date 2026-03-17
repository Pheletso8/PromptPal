import { Request, Response } from 'express';
import AssessmentMark from '../models/AssessmentMark';
import Course from '../models/Course';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Submit an assessment answer
// @route   POST /api/assessments/submit
// @access  Private
export const submitAssessment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, answer } = req.body;
    const userId = req.user._id;

    // Check if user is assigned to this course
    const user = await User.findById(userId);
    if (!user || !user.assignedCourses.includes(courseId)) {
      res.status(403).json({ message: 'User is not assigned to this course' });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course || !course.assessment) {
      res.status(404).json({ message: 'Course or Assessment not found' });
      return;
    }

    // Check if answer is correct. (Simple string match, adjust logic as needed)
    const passed = course.assessment.correctAnswer === answer;
    const score = passed ? 100 : 0; // Simple scoring

    // Check if user already submitted this assessment
    let assessmentMark = await AssessmentMark.findOne({ user: userId, course: courseId });

    if (assessmentMark) {
      // If retaking, we only update if they passed this time and didn't before.
      if (!assessmentMark.passed && passed) {
        assessmentMark.score = score;
        assessmentMark.passed = true;
        await assessmentMark.save();
        
        // Update user stats
        user.assessmentsPassed += 1;
        user.stars += 10; // Give 10 stars per passed assessment
        await user.save();
      }
    } else {
      assessmentMark = await AssessmentMark.create({
        user: userId,
        course: courseId,
        score,
        passed
      });

      if (passed) {
        user.assessmentsPassed += 1;
        user.stars += 10;
        await user.save();
      }
    }

    res.status(200).json({ passed, score, message: passed ? 'Assessment passed!' : 'Assessment failed, try again.', stars: user.stars });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
