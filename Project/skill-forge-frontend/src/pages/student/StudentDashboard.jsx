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
    if (enrollments && Array.isArray(enrollments)) {
      setStats({
        totalCourses: enrollments.length,
        inProgress: enrollments.filter((e) => (e.progressPercent || 0) > 0 && !e.isCompleted).length,
        completed: enrollments.filter((e) => e.isCompleted).length,
        totalHours: Math.round(
          enrollments.reduce((acc, e) => acc + (e.course?.totalDuration || 0), 0) / 3600
        ),
      });
    }
  }, [enrollments]);

  // Get most recent enrollment for "Resume Learning"
  const resumeCourse = enrollments?.find((e) => (e.progressPercent || 0) > 0 && !e.isCompleted) || enrollments?.[0];

  const upcomingQuizzes = [
    { id: 1, course: 'Python for DS', dueDate: 'Soon', status: 'pending' },
    { id: 2, course: 'ML Mastery', dueDate: 'Upcoming', status: 'pending' },
  ];

  const announcements = [
    { id: 1, title: 'New Course: NLP Essentials', date: 'Just now' },
    { id: 2, title: 'Check out the new Data Science Specialization!', date: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0c12]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            You have completed <span className="text-primary-600 dark:text-primary-400 font-bold">{stats.completed}</span> courses this month. Keep it up!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'blue' },
            { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'yellow' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
            { label: 'Learning Hours', value: stats.totalHours, icon: Clock, color: 'purple' },
          ].map((stat, idx) => (
            <Card key={idx} className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resume Learning Section */}
            {resumeCourse && (
              <Card className="relative overflow-hidden group border-0 shadow-2xl rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10"></div>
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white gap-8">
                  <div className="flex-1 space-y-6">
                    <div>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                        Active Journey
                      </span>
                      <h3 className="text-3xl md:text-4xl font-black leading-tight drop-shadow-sm truncate max-w-md">
                        {resumeCourse.course?.title || 'Your Course'}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span>{Math.round(resumeCourse.progressPercent || 0)}% COMPLETE</span>
                      </div>
                      <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-1000"
                          style={{ width: `${resumeCourse.progressPercent || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/student/courses/${resumeCourse.course?._id}`)}
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 rounded-2xl font-black text-lg shadow-xl hover:bg-primary-50 transition-all hover:-translate-y-1"
                    >
                      <Play className="mr-3 w-6 h-6 fill-current" />
                      <span>Resume</span>
                    </button>
                  </div>
                  {resumeCourse.course?.thumbnail && (
                    <div className="relative md:w-1/3 aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform group-hover:scale-105 transition-transform">
                      <img src={resumeCourse.course.thumbnail} className="w-full h-full object-cover" alt="" />
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* My Courses Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">My Learning Path</h2>
                <Link to="/courses" className="text-sm font-bold text-primary-600 hover:underline">Explore More →</Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1,2,3,4].map(i => <div key={i} className="h-64 bg-white dark:bg-gray-900 rounded-3xl animate-pulse border border-gray-100 dark:border-gray-800"></div>)}
                </div>
              ) : enrollments && enrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {enrollments.map((enrollment) => (
                    <CourseCard
                      key={enrollment._id}
                      enrollment={enrollment}
                      onClick={() => navigate(`/student/courses/${enrollment.course?._id}`)}
                      navigate={navigate}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to start?</h3>
                  <p className="text-gray-500 mb-6">Pick your first Data Science specialization to begin.</p>
                  <Button asChild className="rounded-xl font-bold px-8 py-6"><Link to="/courses">Browse Catalog</Link></Button>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary-500" /> Notifications</h3>
              <div className="space-y-4">
                {announcements.map((ann, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{ann.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{ann.date}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden relative">
               <div className="absolute -right-4 -top-4 opacity-5"><Award className="w-24 h-24" /></div>
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-primary-500" /> Credentials</h3>
               {stats.completed > 0 ? (
                 <div className="text-center">
                    <div className="text-4xl font-black text-primary-600 mb-1">{stats.completed}</div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Certificates Won</p>
                    <Button variant="outline" className="w-full rounded-xl font-bold border-2">Download All</Button>
                 </div>
               ) : (
                 <p className="text-sm text-gray-500 italic">Finish a course to earn your first certificate!</p>
               )}
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const CourseCard = ({ enrollment, onClick, navigate }) => {
  const course = enrollment?.course;
  const progress = enrollment?.progressPercent || 0;
  const isCompleted = enrollment?.isCompleted;

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 rounded-3xl"
    >
      <div className="relative h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img
          src={course?.thumbnail || `https://picsum.photos/seed/${course?._id}/800/450`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt=""
        />
        {isCompleted && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
            <CheckCircle size={14} /> COMPLETE
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 leading-tight min-h-[3rem]">
          {course?.title || 'Loading Course...'}
        </h3>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
             <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                <span className="text-xs font-black text-primary-600">{Math.round(progress)}%</span>
             </div>
             <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
             </div>
          </div>
          
          <div className="relative w-12 h-12 flex-shrink-0">
             <svg className="transform -rotate-90 w-12 h-12">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset={125.6 - (progress/100)*125.6} className="text-primary-500" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{Math.round(progress)}%</div>
          </div>
        </div>

        <button className="mt-6 w-full py-3 bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-600 group-hover:text-white rounded-2xl text-sm font-black transition-all duration-300 uppercase tracking-widest">
           {isCompleted ? 'Review Course' : 'Continue Study'}
        </button>
      </div>
    </Card>
  );
};

export default StudentDashboard;
