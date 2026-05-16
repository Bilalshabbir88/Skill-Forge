// Mock Certificates Data
export const certificates = [
  {
    _id: 'cert_001',
    user_id: 'user_001',
    course_id: 'course_006',
    enrollment_id: 'enroll_002',
    issued_date: '2024-02-28T10:00:00Z',
    certificate_url: '#', // Will be generated dynamically
    verification_code: 'SF-2024-001-JD',
    student_name: 'John Doe',
    course_title: 'Modern JavaScript ES6+',
    instructor_name: 'Dr. Emily Rodriguez',
  },
  {
    _id: 'cert_002',
    user_id: 'user_002',
    course_id: 'course_005',
    enrollment_id: 'enroll_006',
    issued_date: '2024-03-10T15:00:00Z',
    certificate_url: '#',
    verification_code: 'SF-2024-002-SW',
    student_name: 'Sarah Wilson',
    course_title: 'Python for Data Science & Machine Learning',
    instructor_name: 'Prof. James Thompson',
  },
];

export default certificates;
