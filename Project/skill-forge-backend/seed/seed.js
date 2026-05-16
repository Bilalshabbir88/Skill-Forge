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

const MONGO_URI = process.env.MONGO_URI;

const CATEGORIES = [
  { name: 'Web Development', slug: 'web-development' },
  { name: 'Data Science', slug: 'data-science' },
  { name: 'AI & Machine Learning', slug: 'ai-machine-learning' },
  { name: 'Mobile Development', slug: 'mobile-development' },
  { name: 'Cybersecurity', slug: 'cybersecurity' },
  { name: 'UI/UX Design', slug: 'ui-ux-design' },
  { name: 'Cloud Computing', slug: 'cloud-computing' },
  { name: 'Digital Marketing', slug: 'digital-marketing' },
];

const YOUTUBE_VIDEOS = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=PkZNo7MFNFg',
  'https://www.youtube.com/watch?v=hdI2bqOjy3c',
  'https://www.youtube.com/watch?v=09f6_Q9Bx30',
  'https://www.youtube.com/watch?v=rfscVS0vtbw',
];

const QUESTIONS_BANK = [
  { text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyper Transfer Markup Language', 'None of the above'], correct: 0 },
  { text: 'Which tag is used for the largest heading?', options: ['<h6>', '<heading>', '<h1>', '<head>'], correct: 2 },
  { text: 'What does CSS stand for?', options: ['Colorful Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets'], correct: 1 },
  { text: 'Which is a JavaScript framework?', options: ['Django', 'Laravel', 'React', 'Flask'], correct: 2 },
  { text: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Strong Query Language', 'Sequential Query Language'], correct: 0 },
  { text: 'Which of the following is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'], correct: 2 },
  { text: 'What is a RESTful API?', options: ['A database', 'An API following REST principles', 'A frontend framework', 'A testing tool'], correct: 1 },
  { text: 'What is Machine Learning?', options: ['A programming language', 'A type of hardware', 'Teaching computers to learn from data', 'A database system'], correct: 2 },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected!');

  // Clear all collections
  console.log('🗑️  Clearing database...');
  await Promise.all([
    User.deleteMany(), Category.deleteMany(), Course.deleteMany(),
    Module.deleteMany(), Lesson.deleteMany(), Quiz.deleteMany(),
    Question.deleteMany(), Enrollment.deleteMany(), LessonProgress.deleteMany(),
    QuizAttempt.deleteMany(),
  ]);
  console.log('✅ Database cleared!');

  // 1. Categories
  console.log('📂 Seeding categories...');
  const categories = await Category.insertMany(CATEGORIES);

  // 2. Users
  console.log('👤 Seeding users...');
  // Use PLAIN TEXT passwords — the User model's pre('save') hook will hash them
  const PLAIN_PASSWORD = 'Test@123456';
  const ADMIN_PASSWORD = 'Admin@123456';

  const admin = await User.create({ name: 'Admin User', email: 'admin@skillforge.com', password: ADMIN_PASSWORD, role: 'admin', status: 'active' });

  const instructors = [];
  for (let i = 1; i <= 5; i++) {
    const inst = await User.create({
      name: `Instructor ${i}`,
      email: `instructor${i}@skillforge.com`,
      password: PLAIN_PASSWORD,
      role: 'instructor',
      status: 'active',
      bio: faker.lorem.sentences(2),
    });
    instructors.push(inst);
  }

  const students = [];
  for (let i = 1; i <= 20; i++) {
    const student = await User.create({
      name: `Student ${i}`,
      email: `student${i}@skillforge.com`,
      password: PLAIN_PASSWORD,
      role: 'student',
      status: 'active',
    });
    students.push(student);
  }

  // 3. Courses (2 per instructor)
  console.log('📚 Seeding courses...');
  const courses = [];
  for (const instructor of instructors) {
    for (let c = 0; c < 2; c++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const isFree = c === 0;
      const course = await Course.create({
        title: `${faker.commerce.productName()} Complete Course`,
        description: faker.lorem.paragraphs(3),
        instructor: instructor._id,
        category: category._id,
        thumbnail: `https://picsum.photos/seed/${Math.random().toString(36).substr(2, 6)}/800/450`,
        price: isFree ? 0 : Math.round(Math.random() * 90 + 9.99),
        difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
        language: 'English',
        tags: faker.lorem.words(3).split(' '),
        prerequisites: [faker.lorem.sentence()],
        whatYouWillLearn: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()],
        status: 'approved',
      });
      courses.push(course);
    }
  }

  // 4. Modules & Lessons (3 modules × 4 lessons per course)
  console.log('📦 Seeding modules and lessons...');
  const allLessons = [];
  for (const course of courses) {
    let totalDur = 0;
    for (let m = 1; m <= 3; m++) {
      const mod = await Module.create({
        course: course._id,
        title: `Module ${m}: ${faker.lorem.words(4)}`,
        description: faker.lorem.sentence(),
        order: m,
        hasQuiz: true,
      });

      for (let l = 1; l <= 4; l++) {
        const dur = Math.floor(Math.random() * 1500) + 300;
        totalDur += dur;
        const lesson = await Lesson.create({
          module: mod._id,
          course: course._id,
          title: `Lesson ${l}: ${faker.lorem.words(5)}`,
          description: faker.lorem.sentences(2),
          videoUrl: YOUTUBE_VIDEOS[Math.floor(Math.random() * YOUTUBE_VIDEOS.length)],
          duration: dur,
          order: l,
          isFreePreview: l === 1,
        });
        allLessons.push(lesson);
      }
    }
    await Course.findByIdAndUpdate(course._id, { totalLessons: 12, totalDuration: totalDur });
  }

  // 5. Quizzes (1 per module, 5 questions each)
  console.log('📝 Seeding quizzes...');
  const modules = await Module.find();
  for (const mod of modules) {
    const quiz = await Quiz.create({
      module: mod._id,
      course: mod.course,
      title: `Quiz: ${faker.lorem.words(4)}`,
      passingScore: 70,
      maxAttempts: 3,
      retryWaitHours: 24,
    });

    for (let q = 0; q < 5; q++) {
      const qData = QUESTIONS_BANK[q % QUESTIONS_BANK.length];
      await Question.create({
        quiz: quiz._id,
        text: qData.text,
        options: qData.options.map((o, i) => ({ label: ['A', 'B', 'C', 'D'][i], text: o })),
        correctOption: qData.correct,
        explanation: 'Review your course material.',
        order: q + 1,
      });
    }
  }

  // 6. Enrollments (3 random courses per student, 50% lessons complete)
  console.log('🎓 Seeding enrollments...');
  for (const student of students) {
    const shuffled = [...courses].sort(() => 0.5 - Math.random());
    const enrolledCourses = shuffled.slice(0, 3);

    for (const course of enrolledCourses) {
      const enrollment = await Enrollment.create({
        student: student._id,
        course: course._id,
        paymentStatus: course.isFree ? 'free' : 'mock_paid',
        amountPaid: course.price,
      });

      // Mark 50% of lessons complete
      const courseLessons = allLessons.filter((l) => l.course.toString() === course._id.toString());
      const halfLessons = courseLessons.slice(0, Math.floor(courseLessons.length / 2));
      let completedIds = [];
      for (const lesson of halfLessons) {
        await LessonProgress.create({
          student: student._id,
          lesson: lesson._id,
          course: course._id,
          watchedSeconds: lesson.duration,
          isCompleted: true,
          completedAt: new Date(),
        });
        completedIds.push(lesson._id);
      }

      const progress = Math.round((completedIds.length / courseLessons.length) * 100);
      await Enrollment.findByIdAndUpdate(enrollment._id, {
        completedLessons: completedIds,
        progressPercent: progress,
      });

      await Course.findByIdAndUpdate(course._id, { $inc: { totalEnrollments: 1 } });
      await User.findByIdAndUpdate(student._id, { $addToSet: { enrolledCourses: course._id } });
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log('─────────────────────────────────────────');
  console.log('Admin:        admin@skillforge.com / Admin@123456');
  console.log('Instructors:  instructor1-5@skillforge.com / Test@123456');
  console.log('Students:     student1-20@skillforge.com / Test@123456');
  console.log('─────────────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
