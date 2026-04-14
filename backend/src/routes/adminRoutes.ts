import express from 'express';
import { 
  assignCourse, createCourse, updateCourse, deleteCourse, 
  getDashboardStats, getAllUsers, updateUser, toggleUserStatus, adminDeleteUser 
} from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/assign-course').post(protect, admin, assignCourse);
router.route('/courses').post(protect, admin, createCourse);
router.route('/courses/:id')
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, adminDeleteUser);
router.route('/users/:id/toggle').put(protect, admin, toggleUserStatus);

export default router;
