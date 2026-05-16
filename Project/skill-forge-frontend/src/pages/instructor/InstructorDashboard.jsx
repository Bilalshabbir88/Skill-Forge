import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import {
  BookOpen, Users, DollarSign, TrendingUp, Plus, Edit,
  BarChart3, Loader2, Play, CheckCircle, Clock, AlertCircle,
} from 'lucide-react';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalRevenue: 0, activeCourses: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchInstructorData(); }, []);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      setError(null);
      // GET /api/courses/my — returns all instructor's courses regardless of status
      const res = await api.get('/courses/my');
      const instructorCourses = res.data.data || [];
      setCourses(instructorCourses);

      const totalStudents = instructorCourses.reduce((s, c) => s + (c.totalEnrollments || 0), 0);
      const totalRevenue = instructorCourses.reduce(
        (s, c) => s + ((c.totalEnrollments || 0) * (c.price || 0)), 0
      );
      setStats({
        totalCourses: instructorCourses.length,
        totalStudents,
        totalRevenue,
        activeCourses: instructorCourses.filter((c) => c.status === 'approved').length,
      });
    } catch (err) {
      console.error('Error fetching instructor data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[status] || map.draft;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Instructor Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your courses and track performance</p>
          </div>
          <Link to="/instructor/courses/new">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-5 h-5 mr-2" /> Create New Course
            </Button>
          </Link>
        </div>

        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Courses', value: stats.totalCourses, Icon: BookOpen, color: 'purple' },
            { label: 'Total Students', value: stats.totalStudents, Icon: Users, color: 'blue' },
            { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, Icon: DollarSign, color: 'green' },
            { label: 'Live Courses', value: stats.activeCourses, Icon: TrendingUp, color: 'yellow' },
          ].map(({ label, value, Icon, color }) => (
            <Card key={label} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
                </div>
                <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Courses</h2>
          {courses.length === 0 ? (
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Start sharing your knowledge!</p>
                <Link to="/instructor/courses/new">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-5 h-5 mr-2" /> Create Your First Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id} className="group overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all">
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(course.status)}`}>
                      {course.status}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" /> {course.totalEnrollments || 0}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4" /> ${course.price || 0}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {['draft', 'rejected'].includes(course.status) && (
                        <Button onClick={() => navigate(`/instructor/courses/${course._id}/edit`)} variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4 mr-2" /> Edit Course
                        </Button>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => navigate(`/instructor/courses/${course._id}/lessons`)} variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-1" /> Lessons
                        </Button>
                        <Button onClick={() => navigate(`/instructor/courses/${course._id}/quiz`)} variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" /> Quiz
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
