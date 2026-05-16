// Mock Lessons Data
export const lessons = [
  // Lessons for Module 001 (Introduction to Web Development)
  {
    _id: 'lesson_001',
    module_id: 'module_001',
    lesson_title: 'What is Web Development?',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Sample YouTube URL
    resources: [
      'https://example.com/resources/web-dev-intro.pdf',
      'https://example.com/resources/roadmap.pdf',
    ],
    duration: 15, // minutes
    order: 1,
  },
  {
    _id: 'lesson_002',
    module_id: 'module_001',
    lesson_title: 'Setting Up Your Development Environment',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: ['https://example.com/resources/setup-guide.pdf'],
    duration: 20,
    order: 2,
  },
  {
    _id: 'lesson_003',
    module_id: 'module_001',
    lesson_title: 'How The Web Works',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: [],
    duration: 18,
    order: 3,
  },
  
  // Lessons for Module 002 (HTML & CSS)
  {
    _id: 'lesson_004',
    module_id: 'module_002',
    lesson_title: 'HTML Structure and Semantics',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: ['https://example.com/resources/html-cheatsheet.pdf'],
    duration: 25,
    order: 1,
  },
  {
    _id: 'lesson_005',
    module_id: 'module_002',
    lesson_title: 'CSS Styling Basics',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: ['https://example.com/resources/css-basics.pdf'],
    duration: 30,
    order: 2,
  },
  {
    _id: 'lesson_006',
    module_id: 'module_002',
    lesson_title: 'Flexbox and Grid Layout',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: [
      'https://example.com/resources/flexbox-guide.pdf',
      'https://example.com/resources/grid-guide.pdf',
    ],
    duration: 35,
    order: 3,
  },
  
  // Lessons for Module 003 (JavaScript Basics)
  {
    _id: 'lesson_007',
    module_id: 'module_003',
    lesson_title: 'JavaScript Variables and Data Types',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: [],
    duration: 22,
    order: 1,
  },
  {
    _id: 'lesson_008',
    module_id: 'module_003',
    lesson_title: 'Functions and Scope',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: ['https://example.com/resources/js-functions.pdf'],
    duration: 28,
    order: 2,
  },
  {
    _id: 'lesson_009',
    module_id: 'module_003',
    lesson_title: 'DOM Manipulation',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: ['https://example.com/resources/dom-guide.pdf'],
    duration: 32,
    order: 3,
  },
  
  // Lessons for Module 004 (React.js)
  {
    _id: 'lesson_010',
    module_id: 'module_004',
    lesson_title: 'Introduction to React',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: [],
    duration: 20,
    order: 1,
  },
  {
    _id: 'lesson_011',
    module_id: 'module_004',
    lesson_title: 'Components and Props',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: ['https://example.com/resources/react-components.pdf'],
    duration: 25,
    order: 2,
  },
  {
    _id: 'lesson_012',
    module_id: 'module_004',
    lesson_title: 'State and Hooks',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    resources: ['https://example.com/resources/react-hooks.pdf'],
    duration: 30,
    order: 3,
  },
];

export default lessons;
