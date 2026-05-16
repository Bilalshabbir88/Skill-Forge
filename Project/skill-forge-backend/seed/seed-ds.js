require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Enrollment = require('../models/Enrollment');
const LessonProgress = require('../models/LessonProgress');
const QuizAttempt = require('../models/QuizAttempt');
const CodingLab = require('../models/CodingLab');
const Specialization = require('../models/Specialization');

const MONGO_URI = process.env.MONGO_URI;

const DS_CATEGORIES = [
  { name: 'Data Science Fundamentals', slug: 'ds-fundamentals' },
  { name: 'Machine Learning', slug: 'machine-learning' },
  { name: 'Artificial Intelligence', slug: 'ai' },
  { name: 'Data Visualization', slug: 'data-viz' },
  { name: 'Big Data & Cloud', slug: 'big-data' },
  { name: 'Statistics & Probability', slug: 'statistics' },
  { name: 'Python for Data Science', slug: 'python-ds' },
  { name: 'SQL & Databases', slug: 'sql-databases' },
  { name: 'Natural Language Processing', slug: 'nlp' },
  { name: 'Deep Learning', slug: 'deep-learning' },
];

const DS_COURSES = [
  {
    title: 'Python for Data Science & Machine Learning',
    description: 'Master the essentials of Python for Data Science. Learn NumPy, Pandas, Matplotlib, and Scikit-Learn from scratch.',
    difficulty: 'beginner',
    category: 'python-ds',
    tags: ['python', 'pandas', 'numpy', 'scikit-learn'],
    modules: [
      {
        title: 'Environment Setup & Basics',
        lessons: [
          { title: 'Installing Anaconda and Jupyter', duration: 600 },
          { title: 'Python Basics for Data Science', duration: 1200 },
          { title: 'Working with Virtual Environments', duration: 450 }
        ]
      },
      {
        title: 'Data Analysis with Pandas',
        lessons: [
          { title: 'Introduction to DataFrames', duration: 900 },
          { title: 'Cleaning & Preparing Data', duration: 1100 },
          { title: 'Advanced Grouping & Pivoting', duration: 800 }
        ]
      }
    ]
  },
  {
    title: 'Machine Learning A-Z™: Hands-On Python',
    description: 'Learn to create Machine Learning Algorithms in Python. Build a portfolio of 10+ real-world ML projects.',
    difficulty: 'intermediate',
    category: 'machine-learning',
    tags: ['ml', 'regression', 'classification', 'clustering'],
    modules: [
      {
        title: 'Regression Mastery',
        lessons: [
          { title: 'Simple & Multiple Linear Regression', duration: 1000 },
          { title: 'Polynomial & SVR Models', duration: 1200 },
          { title: 'Decision Trees & Random Forests', duration: 900 }
        ]
      },
      {
        title: 'Classification Algorithms',
        lessons: [
          { title: 'Logistic Regression Explained', duration: 850 },
          { title: 'K-Nearest Neighbors (K-NN)', duration: 700 },
          { title: 'Support Vector Machines (SVM)', duration: 1100 }
        ]
      }
    ]
  },
  {
    title: 'Deep Learning with PyTorch & TensorFlow',
    description: 'The complete guide to Neural Networks. Build CNNs, RNNs, and LSTMs for computer vision and text analysis.',
    difficulty: 'advanced',
    category: 'deep-learning',
    tags: ['deep-learning', 'neural-networks', 'pytorch', 'tensorflow'],
    modules: [
      {
        title: 'Neural Network Foundations',
        lessons: [
          { title: 'The Neuron & Backpropagation', duration: 1500 },
          { title: 'Activation Functions Deep Dive', duration: 1200 }
        ]
      }
    ]
  },
  {
    title: 'SQL for Data Analytics & BI',
    description: 'Master SQL for data extraction and business intelligence. Learn PostgreSQL and MySQL optimization techniques.',
    difficulty: 'beginner',
    category: 'sql-databases',
    tags: ['sql', 'postgres', 'bi', 'analytics'],
    modules: [
      {
        title: 'SQL Querying Basics',
        lessons: [
          { title: 'SELECT, FROM, and WHERE', duration: 600 },
          { title: 'Joins & Subqueries', duration: 1400 }
        ]
      }
    ]
  },
  {
    title: 'Tableau for Data Visualization',
    description: 'Create stunning, interactive dashboards. Learn the art of storytelling with data using Tableau and Power BI.',
    difficulty: 'beginner',
    category: 'data-viz',
    tags: ['tableau', 'dashboard', 'visualization', 'bi'],
    modules: [
      {
        title: 'Building Your First Dashboard',
        lessons: [
          { title: 'Connecting to Data Sources', duration: 500 },
          { title: 'Calculated Fields & Parameters', duration: 900 }
        ]
      }
    ]
  }
];

const DS_QUESTIONS = [
  { text: 'Which library is primarily used for data manipulation in Python?', options: ['Matplotlib', 'Scikit-learn', 'Pandas', 'Flask'], correct: 2 },
  { text: 'What does "p-value" represent in statistical hypothesis testing?', options: ['Probability of the data given the null hypothesis', 'Probability of the alternative hypothesis', 'The power of the test', 'Effect size'], correct: 0 },
  { text: 'In Linear Regression, what do we minimize?', options: ['Mean Absolute Error', 'Sum of Squared Residuals', 'Root Mean Squared Error', 'Total Error'], correct: 1 },
  { text: 'Which algorithm is an example of Unsupervised Learning?', options: ['Logistic Regression', 'Random Forest', 'K-Means Clustering', 'SVM'], correct: 2 },
  { text: 'What is the purpose of a Confusion Matrix?', options: ['To confuse the model', 'To evaluate classification performance', 'To handle missing values', 'To count rows'], correct: 1 },
  { text: 'What is "Overfitting"?', options: ['Model is too simple', 'Model performs well on training but poorly on test data', 'Model is too large', 'None'], correct: 1 },
  { text: 'Which activation function is commonly used in hidden layers?', options: ['Sigmoid', 'Tanh', 'ReLU', 'Softmax'], correct: 2 },
  { text: 'What does SQL stand for?', options: ['Simple Query Language', 'Structured Query Language', 'Sequential Query Language', 'None'], correct: 1 },
];

const YOUTUBE_DS_VIDEOS = [
  'https://www.youtube.com/watch?v=ua-CiDNNj30',
  'https://www.youtube.com/watch?v=7eh4d6sabA0',
  'https://www.youtube.com/watch?v=fHI8X4OXW-Q',
  'https://www.youtube.com/watch?v=px67Wj9rP_0',
  'https://www.youtube.com/watch?v=RBSGKlAvoiM',
];

async function runSeed() {
  try {
    console.log('🚀 Starting Massive Data Science Seeder...');
    
    if (!MONGO_URI) throw new Error('MONGO_URI is not defined');

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Clearing existing data
    console.log('🧹 Clearing existing database...');
    const models = [User, Category, Course, Module, Lesson, Quiz, Question, Enrollment, LessonProgress, QuizAttempt, CodingLab, Specialization];
    for (const model of models) await model.deleteMany({});
    console.log('✅ Database cleared.');

    // 1. Create Admin
    await User.create({
      name: 'Bilal Shabbir (Admin)',
      email: 'admin@skillforge.com',
      password: 'Admin@123456',
      role: 'admin',
      status: 'active'
    });

    // 2. Create Categories
    const categoryMap = {};
    for (const cat of DS_CATEGORIES) {
      const created = await Category.create(cat);
      categoryMap[cat.slug] = created._id;
    }

    // 3. Create Instructors
    const instructors = [];
    for (let i = 1; i <= 5; i++) {
      instructors.push(await User.create({
        name: faker.person.fullName(),
        email: `instructor${i}@skillforge.com`,
        password: 'Test@123456',
        role: 'instructor',
        status: 'active',
        bio: faker.person.bio(),
        profilePicture: `https://i.pravatar.cc/150?u=inst${i}`
      }));
    }

    // 4. Create Students (50 Students)
    const students = [];
    for (let i = 1; i <= 50; i++) {
      students.push(await User.create({
        name: faker.person.fullName(),
        email: `student${i}@skillforge.com`,
        password: 'Test@123456',
        role: 'student',
        status: 'active',
        profilePicture: `https://i.pravatar.cc/150?u=stud${i}`
      }));
    }

    // 5. Create Courses
    const createdCourses = [];
    for (let i = 0; i < DS_COURSES.length; i++) {
      const courseData = DS_COURSES[i];
      const instructor = instructors[i % instructors.length];
      
      const course = await Course.create({
        title: courseData.title,
        description: courseData.description,
        instructor: instructor._id,
        category: categoryMap[courseData.category],
        thumbnail: `https://picsum.photos/seed/ds-${i}/800/450`,
        price: i === 0 ? 0 : (29.99 + (i * 10)).toFixed(2),
        difficulty: courseData.difficulty,
        tags: courseData.tags,
        prerequisites: ['Basic Python Knowledge', 'Statistics Fundamentals'],
        whatYouWillLearn: courseData.tags.map(tag => `Become an expert in ${tag}`),
        status: 'approved'
      });
      createdCourses.push(course);

      let totalDuration = 0;
      let totalLessons = 0;

      for (let mIdx = 0; mIdx < courseData.modules.length; mIdx++) {
        const modData = courseData.modules[mIdx];
        const module = await Module.create({
          course: course._id,
          title: modData.title,
          order: mIdx + 1,
          hasQuiz: true
        });

        for (let lIdx = 0; lIdx < modData.lessons.length; lIdx++) {
          const lessonData = modData.lessons[lIdx];
          const lesson = await Lesson.create({
            module: module._id,
            course: course._id,
            title: lessonData.title,
            videoUrl: YOUTUBE_DS_VIDEOS[Math.floor(Math.random() * YOUTUBE_DS_VIDEOS.length)],
            duration: lessonData.duration,
            order: lIdx + 1,
            isFreePreview: lIdx === 0
          });
          totalDuration += lessonData.duration;
          totalLessons++;

          // Add interactive quiz to the very first lesson
          if (i === 0 && mIdx === 0 && lIdx === 0) {
             const q = await Question.create({
                text: 'Which Python library is best for data manipulation?',
                options: [
                  { label: 'A', text: 'Pandas' },
                  { label: 'B', text: 'Flask' },
                  { label: 'C', text: 'Django' },
                  { label: 'D', text: 'React' }
                ],
                correctOption: 0,
                order: 1
             });
             await Lesson.findByIdAndUpdate(lesson._id, {
                $push: { interactiveQuizzes: { timestamp: 15, question: q._id } }
             });
          }
        }

        const quiz = await Quiz.create({
          module: module._id,
          course: course._id,
          title: `${modData.title} Final Check`,
          passingScore: 70
        });

        for (let qIdx = 0; qIdx < 5; qIdx++) {
          const qData = DS_QUESTIONS[Math.floor(Math.random() * DS_QUESTIONS.length)];
          await Question.create({
            quiz: quiz._id,
            text: qData.text,
            options: qData.options.map((o, idx) => ({ label: String.fromCharCode(65 + idx), text: o })),
            correctOption: qData.correct,
            order: qIdx + 1
          });
        }
      }

      await Course.findByIdAndUpdate(course._id, { totalDuration, totalLessons });

      // Add Coding Lab for the Python course
      if (i === 0) {
        await CodingLab.create({
          module: (await Module.findOne({ course: course._id, order: 1 }))._id,
          course: course._id,
          title: 'Your First Pandas Lab',
          instructions: '1. Import pandas as pd\n2. Create a list [10, 20, 30]\n3. Print its sum using Python sum() function.',
          starterCode: 'import pandas as pd\n# Write code below\n',
          solutionCode: 'import pandas as pd\nprint(sum([10,20,30]))',
          language: 'python',
          testCases: [{ input: '', expectedOutput: '60', isHidden: false }]
        });
      }
    }

    // 6. Specializations
    await Specialization.create({
      title: 'Professional Data Scientist Certificate',
      description: 'The ultimate path to becoming a Data Scientist. Covers Python, Machine Learning, Deep Learning, and SQL.',
      category: categoryMap['machine-learning'],
      courses: createdCourses.slice(0, 4).map(c => c._id),
      thumbnail: 'https://picsum.photos/seed/fullpath/1200/600',
      status: 'published'
    });

    // 7. Random Enrollments
    console.log('🤝 Generating Enrollments...');
    for (const student of students) {
      const numCourses = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...createdCourses].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numCourses);
      
      for (const course of selected) {
        await Enrollment.create({ student: student._id, course: course._id, paymentStatus: 'paid', amountPaid: course.price });
        await User.findByIdAndUpdate(student._id, { $addToSet: { enrolledCourses: course._id } });
        await Course.findByIdAndUpdate(course._id, { $inc: { totalEnrollments: 1 } });
      }
    }

    console.log('\n✨ Massive Seeding Complete!');
    console.log('-------------------------------------------');
    console.log('Admin:       admin@skillforge.com / Admin@123456');
    console.log('Instructors: instructor1-5@skillforge.com / Test@123456');
    console.log('Students:    student1-50@skillforge.com / Test@123456');
    console.log('-------------------------------------------');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runSeed();
