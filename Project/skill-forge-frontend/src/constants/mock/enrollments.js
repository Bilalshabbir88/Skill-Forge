// Mock Enrollment Data
export const enrollments = [
  {
    _id: 'enroll_001',
    user_id: 'user_001',
    course_id: 'course_001',
    progress: 45,
    completed: false,
    completedLessons: ['lesson_001', 'lesson_002', 'lesson_003', 'lesson_004', 'lesson_005'],
    enrolledAt: '2024-02-01T00:00:00Z',
    lastAccessed: '2024-03-20T14:30:00Z',
  },
  {
    _id: 'enroll_002',
    user_id: 'user_001',
    course_id: 'course_006',
    progress: 100,
    completed: true,
    completedLessons: [],
    enrolledAt: '2024-01-15T00:00:00Z',
    lastAccessed: '2024-02-28T10:00:00Z',
    completedAt: '2024-02-28T10:00:00Z',
  },
];

export default enrollments;
