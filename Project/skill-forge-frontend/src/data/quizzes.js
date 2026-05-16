// Mock Quizzes Data
export const quizzes = [
  {
    _id: 'quiz_001',
    course_id: 'course_001',
    quiz_title: 'Web Development Fundamentals Quiz',
    questions: [
      {
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language',
        ],
        correct_answer: 0, // Index of correct answer
      },
      {
        question: 'Which CSS property is used to change the text color?',
        options: ['font-color', 'text-color', 'color', 'text-style'],
        correct_answer: 2,
      },
      {
        question: 'What is the correct syntax for referring to an external JavaScript file?',
        options: [
          '<script name="script.js">',
          '<script href="script.js">',
          '<script src="script.js">',
          '<javascript src="script.js">',
        ],
        correct_answer: 2,
      },
      {
        question: 'Which method is used to add an element at the end of an array in JavaScript?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correct_answer: 0,
      },
      {
        question: 'What is the purpose of the "useState" hook in React?',
        options: [
          'To fetch data from an API',
          'To manage component state',
          'To create side effects',
          'To optimize performance',
        ],
        correct_answer: 1,
      },
    ],
  },
  {
    _id: 'quiz_002',
    course_id: 'course_002',
    quiz_title: 'Advanced React & Redux Quiz',
    questions: [
      {
        question: 'What is the primary purpose of Redux?',
        options: [
          'To style components',
          'To manage global state',
          'To handle routing',
          'To fetch data from APIs',
        ],
        correct_answer: 1,
      },
      {
        question: 'Which hook is used to perform side effects in React?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correct_answer: 1,
      },
      {
        question: 'What is Redux Thunk used for?',
        options: [
          'To handle asynchronous actions',
          'To style components',
          'To create reducers',
          'To connect components',
        ],
        correct_answer: 0,
      },
    ],
  },
  {
    _id: 'quiz_003',
    course_id: 'course_003',
    quiz_title: 'Node.js & Express API Quiz',
    questions: [
      {
        question: 'What is Express.js?',
        options: [
          'A database',
          'A web framework for Node.js',
          'A front-end library',
          'A CSS framework',
        ],
        correct_answer: 1,
      },
      {
        question: 'Which HTTP method is used to retrieve data?',
        options: ['POST', 'GET', 'PUT', 'DELETE'],
        correct_answer: 1,
      },
      {
        question: 'What does REST stand for?',
        options: [
          'Representational State Transfer',
          'Remote State Transfer',
          'Real Estate Transfer',
          'Responsive State Technology',
        ],
        correct_answer: 0,
      },
    ],
  },
];

export default quizzes;
