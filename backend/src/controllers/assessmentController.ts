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
    const { courseId, answers, answer } = req.body; // Support 'answers' array
    const userId = req.user._id;

    // Check if user is assigned to this course
    const user = await User.findById(userId);
    if (!user || !user.assignedCourses.includes(courseId)) {
      res.status(403).json({ message: 'User is not assigned to this course' });
      return;
    }

    const course = await Course.findById(courseId);
    
    // Normalize older 'assessment' model vs newer 'assessments'
    const assessments = course?.assessments?.length > 0 ? course.assessments : (course?.assessment ? [course.assessment] : []);
    
    if (!course || assessments.length === 0) {
      res.status(404).json({ message: 'Course or Assessment not found' });
      return;
    }

    // Check if user already submitted this assessment and reached limit
    let assessmentMark = await AssessmentMark.findOne({ user: userId, course: courseId });
    if (assessmentMark && assessmentMark.attempts >= 3 && !assessmentMark.passed) {
      res.status(403).json({ message: 'Maximum attempts reached. Assessment is locked.' });
      return;
    }

    // Format submitted answers to an array
    const submittedAnswers = answers || (answer ? [answer] : []);

    let correctCount = 0;
    const totalQuestions = assessments.length;
    const corrections: { questionIndex: number, correctAnswer: string, yourAnswer: string }[] = [];

    assessments.forEach((assessment, i) => {
      const isCorrect = submittedAnswers[i] === assessment.correctAnswer;
      if (isCorrect) {
        correctCount++;
      } else {
        corrections.push({
          questionIndex: i,
          correctAnswer: assessment.correctAnswer,
          yourAnswer: submittedAnswers[i] || ''
        });
      }
    });

    const passingThreshold = course.passingThreshold || 70;
    const score = (correctCount / totalQuestions) * 100;
    const passed = score >= passingThreshold;

    if (assessmentMark) {
      if (!assessmentMark.passed) {
        assessmentMark.attempts += 1;
        if (passed) {
          assessmentMark.score = score;
          assessmentMark.passed = true;
          await assessmentMark.save();
          
          user.assessmentsPassed += 1;
          user.stars += 10;
          await user.save();
        } else {
          if (score > assessmentMark.score) assessmentMark.score = score;
          await assessmentMark.save();
        }
      }
    } else {
      assessmentMark = await AssessmentMark.create({
        user: userId,
        course: courseId,
        score,
        passed,
        attempts: 1
      });

      if (passed) {
        user.assessmentsPassed += 1;
        user.stars += 10;
        await user.save();
      }
    }

    res.status(200).json({ 
      passed, 
      score, 
      message: passed ? 'Assessment passed!' : 'Assessment failed, try again.', 
      stars: user.stars,
      corrections: passed ? [] : corrections,
      attempts: assessmentMark.attempts,
      locked: !passed && assessmentMark.attempts >= 3
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
