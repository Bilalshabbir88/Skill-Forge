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
  { name: 'Big Data', slug: 'big-data' },
  { name: 'Statistics & Probability', slug: 'statistics' },
  { name: 'Python for Data Science', slug: 'python-ds' },
  { name: 'SQL & Databases', slug: 'sql-databases' },
];

const DS_COURSES = [
  {
    title: 'Python for Data Science & Machine Learning',
    description: 'Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Scikit-Learn, and more! This is the most comprehensive course for Data Science on Skill Forge.',
    difficulty: 'beginner',
    category: 'python-ds',
    tags: ['python', 'pandas', 'numpy', 'scikit-learn'],
    modules: [
      {
        title: 'Environment Setup & Basics',
        lessons: [
          { title: 'Installing Anaconda and Jupyter', duration: 600 },
          { title: 'Python Basics Recap', duration: 1200 },
          { title: 'Working with Virtual Environments', duration: 450 }
        ]
      },
      {
        title: 'Data Analysis with Pandas',
        lessons: [
          { title: 'Introduction to DataFrames', duration: 900 },
          { title: 'Cleaning Data with Pandas', duration: 1100 },
          { title: 'Groupby and Pivoting', duration: 800 }
        ]
      }
    ]
  },
  {
    title: 'Machine Learning A-Z™: Hands-On Python & R',
    description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.',
    difficulty: 'intermediate',
    category: 'machine-learning',
    tags: ['ml', 'regression', 'classification', 'clustering'],
    modules: [
      {
        title: 'Regression Analysis',
        lessons: [
          { title: 'Simple Linear Regression', duration: 1000 },
          { title: 'Multiple Linear Regression', duration: 1200 },
          { title: 'Polynomial Regression', duration: 900 }
        ]
      }
    ]
  },
  {
    title: 'Statistics for Data Science Bootcamp',
    description: 'Master the statistics, probability, and hypothesis testing needed to become a professional data scientist.',
    difficulty: 'beginner',
    category: 'statistics',
    tags: ['statistics', 'probability', 'hypothesis-testing'],
    modules: [
      {
        title: 'Descriptive Statistics',
        lessons: [
          { title: 'Mean, Median, and Mode', duration: 500 },
          { title: 'Standard Deviation and Variance', duration: 600 },
          { title: 'Distributions and Z-Scores', duration: 750 }
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
  { text: 'What is the purpose of a Confusion Matrix?', options: ['To confuse the model', 'To visualize dataset columns', 'To evaluate classification performance', 'To handle missing values'], correct: 2 },
  { text: 'What is "Overfitting"?', options: ['Model is too simple', 'Model performs well on training but poorly on test data', 'Model is too large for memory', 'None of the above'], correct: 1 },
  { text: 'Which activation function is commonly used in hidden layers of Deep Neural Networks?', options: ['Sigmoid', 'Tanh', 'ReLU', 'Softmax'], correct: 2 },
  { text: 'What does SQL stand for?', options: ['Simple Query Language', 'Structured Query Language', 'Sequential Query Language', 'Standard Query Language'], correct: 1 },
];

const YOUTUBE_DS_VIDEOS = [
  'https://www.youtube.com/watch?v=ua-CiDNNj30', // Pandas
  'https://www.youtube.com/watch?v=7eh4d6sabA0', // Machine Learning
  'https://www.youtube.com/watch?v=fHI8X4OXW-Q', // Data Science Roadmap
  'https://www.youtube.com/watch?v=px67Wj9rP_0', // Statistics
];

async function runSeed() {
  try {
    console.log('🚀 Starting Data Science Specialization Seeder...');
    
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Clearing existing data
    console.log('🧹 Clearing existing data...');
    const collections = [User, Category, Course, Module, Lesson, Quiz, Question, Enrollment, LessonProgress, QuizAttempt, CodingLab];
    for (const model of collections) {
      await model.deleteMany({});
    }
    console.log('✅ Database cleared.');

    // 1. Create Admin
    console.log('👤 Creating Admin...');
    const admin = await User.create({
      name: 'DS Admin',
      email: 'admin@skillforge.com',
      password: 'Admin@123456',
      role: 'admin',
      status: 'active'
    });

    // 2. Create Categories
    console.log('📂 Creating Categories...');
    const categoryMap = {};
    for (const cat of DS_CATEGORIES) {
      const createdCat = await Category.create(cat);
      categoryMap[cat.slug] = createdCat._id;
    }

    // 3. Create Instructors
    console.log('👨‍🏫 Creating Instructors...');
    const instructors = [];
    for (let i = 1; i <= 3; i++) {
      const inst = await User.create({
        name: `DS Instructor ${i}`,
        email: `instructor${i}@skillforge.com`,
        password: 'Test@123456',
        role: 'instructor',
        status: 'active',
        bio: `Professional Data Scientist with ${i*3} years of experience in the industry.`
      });
      instructors.push(inst);
    }

    // 4. Create Students
    console.log('👨‍🎓 Creating Students...');
    const students = [];
    for (let i = 1; i <= 10; i++) {
      const student = await User.create({
        name: `DS Student ${i}`,
        email: `student${i}@skillforge.com`,
        password: 'Test@123456',
        role: 'student',
        status: 'active'
      });
      students.push(student);
    }

    // 5. Create Courses, Modules, Lessons, and Quizzes
    console.log('📚 Building Curricula...');
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
        price: i === 0 ? 0 : 49.99,
        difficulty: courseData.difficulty,
        tags: courseData.tags,
        prerequisites: ['Basic Math', 'Curiosity'],
        whatYouWillLearn: courseData.tags.map(tag => `Master ${tag} for real-world projects`),
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
          await Lesson.create({
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
        }

        // Create Quiz for module
        const quiz = await Quiz.create({
          module: module._id,
          course: course._id,
          title: `${modData.title} Quiz`,
          passingScore: 70
        });

        for (let qIdx = 0; qIdx < 4; qIdx++) {
          const qData = DS_QUESTIONS[Math.floor(Math.random() * DS_QUESTIONS.length)];
          await Question.create({
            quiz: quiz._id,
            text: qData.text,
            options: qData.options.map((o, idx) => ({ label: ['A', 'B', 'C', 'D'][idx], text: o })),
            correctOption: qData.correct,
            order: qIdx + 1
          });
        }
      }

      await Course.findByIdAndUpdate(course._id, { totalDuration, totalLessons });

      // Seed a Coding Lab for the first module of the first course (Python/Pandas)
      if (i === 0) {
        console.log('💻 Seeding Coding Lab for Python course...');
        const firstModule = await Module.findOne({ course: course._id, order: 1 });
        await CodingLab.create({
          module: firstModule._id,
          course: course._id,
          title: 'Your First Pandas DataFrame',
          instructions: 'Welcome to your first hands-on lab! \n\nIn this challenge, you need to create a simple Pandas DataFrame and print its shape. \n\nTasks:\n1. Import pandas as pd.\n2. Create a dictionary with two keys: "Name" (with values ["Alice", "Bob"]) and "Age" (with values [25, 30]).\n3. Convert this dictionary into a DataFrame named `df`.\n4. Print the shape of the DataFrame using `print(df.shape)`.',
          starterCode: 'import pandas as pd\n\n# Your code here\n',
          solutionCode: 'import pandas as pd\ndata = {"Name": ["Alice", "Bob"], "Age": [25, 30]}\ndf = pd.DataFrame(data)\nprint(df.shape)',
          language: 'python',
          languageId: 71, // Python 3
          testCases: [
            { input: '', expectedOutput: '(2, 2)', isHidden: false }
          ]
        });
      }
    }

    // 6. Specializations
    console.log('🏆 Creating Specializations...');
    await Specialization.create({
      title: 'Data Science & Machine Learning Professional Certificate',
      description: 'Master the most in-demand skills in the tech industry. This specialization covers everything from Python basics to advanced Machine Learning algorithms. You will work with real-world datasets and build a portfolio of projects.',
      category: categoryMap['machine-learning'],
      courses: createdCourses.map(c => c._id),
      thumbnail: 'https://picsum.photos/seed/spec/1200/600',
      status: 'published'
    });

    // 7. Interactive In-Video Quiz
    console.log('🎬 Adding Interactive Quiz to Lesson 1...');
    const firstLesson = await Lesson.findOne({ course: createdCourses[0]._id, order: 1 });
    const sampleQuestion = await Question.findOne({ course: createdCourses[0]._id });
    if (firstLesson && sampleQuestion) {
      await Lesson.findByIdAndUpdate(firstLesson._id, {
        $push: {
          interactiveQuizzes: {
            timestamp: 30, // 30 seconds in
            question: sampleQuestion._id
          }
        }
      });
    }

    // 8. Enrollments
    console.log('🤝 Enrolling Students...');
    for (const student of students) {
      // Enroll in the first (free) course
      const course = createdCourses[0];
      await Enrollment.create({
        student: student._id,
        course: course._id,
        paymentStatus: 'free',
        amountPaid: 0
      });
      await User.findByIdAndUpdate(student._id, { $addToSet: { enrolledCourses: course._id } });
      await Course.findByIdAndUpdate(course._id, { $inc: { totalEnrollments: 1 } });
    }

    console.log('\n✨ Data Science Seeding Complete!');
    console.log('-------------------------------------------');
    console.log('Admin:       admin@skillforge.com / Admin@123456');
    console.log('Instructors: instructor1-3@skillforge.com / Test@123456');
    console.log('Students:    student1-10@skillforge.com / Test@123456');
    console.log('-------------------------------------------');

  } catch (error) {
    console.error('❌ SEED ERROR:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runSeed();
