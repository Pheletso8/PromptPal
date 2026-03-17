import express from 'express';
import { getMyCourses, getAllCourses, getCourseById, getMyProgress } from '../controllers/courseController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All course routes are protected — user must be logged in
router.get('/', protect, getAllCourses);
router.get('/my-courses', protect, getMyCourses);
router.get('/my-progress', protect, getMyProgress);
router.get('/:id', protect, getCourseById);

export default router;
