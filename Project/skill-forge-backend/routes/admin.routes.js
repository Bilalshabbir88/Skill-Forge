const express = require('express');
const router = express.Router();
const { listUsers, getUserById, setUserStatus, deleteUser, listPendingInstructors, approveInstructor, rejectInstructor, listPendingCourses, approveCourse, rejectCourse, listAllCourses, getAnalytics } = require('../controllers/admin.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const adminOnly = [verifyToken, requireRole('admin')];

router.get('/users', ...adminOnly, listUsers);
router.get('/users/:id', ...adminOnly, getUserById);
router.patch('/users/:id/status', ...adminOnly, setUserStatus);
router.delete('/users/:id', ...adminOnly, deleteUser);
router.get('/instructors/pending', ...adminOnly, listPendingInstructors);
router.patch('/instructors/:id/approve', ...adminOnly, approveInstructor);
router.patch('/instructors/:id/reject', ...adminOnly, rejectInstructor);
router.get('/courses/pending', ...adminOnly, listPendingCourses);
router.get('/courses', ...adminOnly, listAllCourses);
router.patch('/courses/:id/approve', ...adminOnly, approveCourse);
router.patch('/courses/:id/reject', ...adminOnly, rejectCourse);
router.get('/analytics', ...adminOnly, getAnalytics);

module.exports = router;
