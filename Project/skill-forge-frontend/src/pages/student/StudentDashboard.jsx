import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import {
  BookOpen,
  Play,
  Clock,
  Award,
  TrendingUp,
  Bell,
  Calendar,
  CheckCircle,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { enrollments, loading } = useEnrollment();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
    totalHours: 0,
  });

  useEffect(() => {
    if (enrollments) {
      setStats({
        totalCourses: enrollments.length,
        inProgress: enrollments.filter((e) => e.progressPercent > 0 && !e.isCompleted).length,
        completed: enrollments.filter((e) => e.isCompleted).length,
        totalHours: Math.round(
          enrollments.reduce((acc, e) => acc + (e.course?.totalDuration || 0), 0) / 3600
        ),
      });
    }
  }, [enrollments]);

  // Get most recent enrollment for "Resume Learning"
  const resumeCourse = enrollments?.find((e) => e.progressPercent > 0 && !e.isCompleted);

  // Mock data for sidebar panels (will be replaced with API later)
  const upcomingQuizzes = [
    { id: 1, course: 'React Masterclass', dueDate: '2026-04-10', status: 'pending' },
    { id: 2, course: 'Node.js Advanced', dueDate: '2026-04-12', status: 'pending' },
  ];

  const announcements = [
    { id: 1, title: 'New Course: TypeScript Essentials', date: '2 hours ago' },
    { id: 2, title: 'Platform maintenance scheduled', date: '1 day ago' },
    { id: 3, title: 'Congratulations on completing 5 courses!', date: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your learning journey and achieve your goals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Learning Hours</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalHours}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Enrolled Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resume Learning Section */}
            {resumeCourse && (
              <Card className="relative overflow-hidden group border-0 shadow-2xl rounded-3xl">
                {/* Background Gradient & Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>

                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white gap-8">
                  <div className="flex-1 space-y-6">
                    <div>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                        Continue where you left off
                      </span>
                      <h3 className="text-3xl md:text-4xl font-black leading-tight drop-shadow-sm">
                        {resumeCourse.course?.title}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {Math.round(resumeCourse.progressPercent)}% COMPLETE</span>
                        <span className="opacity-80">Next: {resumeCourse.course?.modules?.[0]?.title || 'Next Lesson'}</span>
                      </div>
                      <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                          className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000"
                          style={{ width: `${resumeCourse.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/student/courses/${resumeCourse.course._id}`)}
                      className="group/btn relative inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 rounded-2xl font-black text-lg shadow-xl hover:bg-primary-50 transition-all hover:-translate-y-1 active:scale-95"
                    >
                      <Play className="mr-3 w-6 h-6 fill-current" />
                      <span>Resume Course</span>
                    </button>
                  </div>

                  {resumeCourse.course?.thumbnail && (
                    <div className="relative md:w-1/3 aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform group-hover:rotate-1 transition-transform duration-500">
                      <img
                        src={resumeCourse.course.thumbnail}
                        alt={resumeCourse.course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* My Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h2>
                <Link
                  to="/courses"
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Browse All Courses →
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : enrollments && enrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {enrollments.map((enrollment) => (
                    <CourseCard
                      key={enrollment._id}
                      enrollment={enrollment}
                      onClick={() => navigate(`/student/courses/${enrollment.course._id}`)}
                      navigate={navigate}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No courses yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <BookOpen size={20} />
                    <span>Browse Courses</span>
                  </Link>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Quizzes */}
            <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Quizzes</h3>
              </div>
              <div className="space-y-3">
                {upcomingQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{quiz.course}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
                        <Calendar size={12} />
                        <span>{quiz.dueDate}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {quiz.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Announcements */}
            <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Announcements</h3>
              </div>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="pb-3 border-b border-gray-200 dark:border-gray-800 last:border-0 last:pb-0"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {announcement.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{announcement.date}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Certificates */}
            <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certificates</h3>
              </div>
              {stats.completed > 0 ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.completed}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Certificates Earned</p>
                  <Link 
                    to={`/student/certificate/${enrollments.find(e => e.completed)?._id}`}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    View Certificates →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete courses to earn certificates
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// CourseCard Component with Circular Progress
const CourseCard = ({ enrollment, onClick, navigate }) => {
  const course = enrollment.course;
  const progress = enrollment.progressPercent || 0;
  const isCompleted = enrollment.isCompleted;

  // Calculate circular progress (SVG circle)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleViewCertificate = (e) => {
    e.stopPropagation();
    navigate(`/student/certificate/${course._id}`);
  };

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        {course?.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <CheckCircle size={12} />
            <span>Completed</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {course?.title}
        </h3>

        {/* Progress Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex-1 mr-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Circular Progress Indicator */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={isCompleted ? 'text-green-500' : 'text-primary-600 dark:text-primary-400'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        {isCompleted ? (
          <div className="mt-4 flex gap-2">
            <button 
              onClick={handleViewCertificate}
              className="flex-1 flex items-center justify-center space-x-2 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg font-semibold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
            >
              <Award size={16} />
              <span>Certificate</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
              <Play size={16} />
              <span>Review</span>
            </button>
          </div>
        ) : (
          <button className="mt-4 w-full flex items-center justify-center space-x-2 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
            <Play size={16} />
            <span>Continue Learning</span>
          </button>
        )}
      </div>
    </Card>
  );
};

export default StudentDashboard;
