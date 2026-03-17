import express from 'express';
import { assignCourse, createCourse, updateCourse, deleteCourse, getDashboardStats, getAllUsers } from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/assign-course').post(protect, admin, assignCourse);
router.route('/courses').post(protect, admin, createCourse);
router.route('/courses/:id')
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/users').get(protect, admin, getAllUsers);

export default router;
