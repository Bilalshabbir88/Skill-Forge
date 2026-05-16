import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import api from '../../api/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0, totalStudents: 0, totalInstructors: 0, totalPendingInstructors: 0,
    totalCourses: 0, totalApprovedCourses: 0, totalPendingCourses: 0,
    totalEnrollments: 0, totalRevenue: 0, totalCertificatesIssued: 0,
    recentEnrollments: [], topCourses: [],
  });

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Backend route: GET /api/admin/analytics
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data.data || {});
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'blue' },
    { title: 'Total Courses', value: analytics.totalCourses, icon: BookOpen, color: 'green' },
    { title: 'Total Revenue', value: `$${(analytics.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'amber' },
    { title: 'Total Enrollments', value: analytics.totalEnrollments, icon: TrendingUp, color: 'purple' },
  ];

  const quickActions = [
    { title: 'Pending Instructors', count: analytics.totalPendingInstructors, icon: AlertCircle, color: 'orange', path: '/admin/instructor-approvals' },
    { title: 'Pending Courses', count: analytics.totalPendingCourses, icon: Clock, color: 'amber', path: '/admin/courses' },
    { title: 'User Management', count: analytics.totalUsers, icon: Users, color: 'blue', path: '/admin/users' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage users, courses, and monitor platform activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map(({ title, value, icon: Icon, color }) => (
            <Card key={title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-lg bg-${color}-50 dark:bg-${color}-950/30 mb-4`}>
                  <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map(({ title, count, icon: Icon, color, path }) => (
            <Card key={title} className="cursor-pointer hover:shadow-lg transition-all hover:scale-105" onClick={() => navigate(path)}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                </div>
                <div className={`p-4 rounded-lg bg-${color}-50 dark:bg-${color}-950/30`}>
                  <Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Courses */}
        {analytics.topCourses?.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Top Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topCourses.map((course) => (
                  <div key={course._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="flex items-center gap-3">
                      {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-10 h-10 rounded object-cover" />}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">⭐ {course.averageRating?.toFixed(1) || 0}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{course.totalEnrollments} students</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {!analytics.recentEnrollments?.length ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">No recent enrollments</div>
            ) : (
              <div className="space-y-4">
                {analytics.recentEnrollments.map((enrollment, idx) => (
                  <div key={enrollment._id || idx} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {enrollment.student?.name || 'Student'} enrolled in{' '}
                        <span className="text-blue-600 dark:text-blue-400">{enrollment.course?.title || 'a course'}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
