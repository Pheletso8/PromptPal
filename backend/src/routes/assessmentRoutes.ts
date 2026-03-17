import express from 'express';
import { submitAssessment } from '../controllers/assessmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/submit').post(protect, submitAssessment);

export default router;
