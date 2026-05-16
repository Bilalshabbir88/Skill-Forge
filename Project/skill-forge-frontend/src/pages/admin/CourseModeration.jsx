import { useState, useEffect } from 'react';
import { Search, Trash2, Eye, AlertCircle, BookOpen, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Modal from '../../components/shared/Modal';
import api from '../../api/api';

export default function CourseModeration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, categoryFilter, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // GET /api/admin/courses returns { data: { courses, total } }
      const response = await api.get('/admin/courses', { params: { limit: 100 } });
      const coursesData = response.data.data?.courses || [];
      setCourses(coursesData);
      setFilteredCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setLoading(false);
    }
  };



  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    setFilteredCourses(filtered);
  };

  const handleDeleteCourse = async () => {
    try {
      // DELETE /api/courses/:id (cascade delete via course controller)
      await api.delete(`/courses/${selectedCourse._id}`);
      setCourses(courses.filter((c) => c._id !== selectedCourse._id));
      setShowDeleteModal(false);
      setShowDetailModal(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleApproveCourse = async (courseId) => {
    try {
      await api.patch(`/admin/courses/${courseId}/approve`);
      setCourses(courses.map((c) => c._id === courseId ? { ...c, status: 'approved' } : c));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleRejectCourse = async (courseId) => {
    try {
      await api.patch(`/admin/courses/${courseId}/reject`, { reason: 'Does not meet quality standards' });
      setCourses(courses.map((c) => c._id === courseId ? { ...c, status: 'rejected' } : c));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject');
    }
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Design',
    'Business',
    'Marketing',
    'Photography',
    'Music',
    'Other',
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Advanced': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      approved: <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Approved</Badge>,
      pending: <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>,
      draft: <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Draft</Badge>,
      rejected: <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</Badge>,
    };
    return map[status] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Course Moderation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and moderate all courses on the platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${courses.length ? (courses.reduce((sum, c) => sum + (c.price || 0), 0) / courses.length).toFixed(0) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Flagged</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {courses.filter(c => c.status === 'flagged').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by course title or instructor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {course.instructor.name}
                    </p>
                  </div>
                  {getStatusBadge(course.status)}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                  <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    {course.category}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600 dark:text-gray-400">
                  <div>
                    <p className="font-semibold">{course.totalEnrollments || 0}</p>
                    <p>Students</p>
                  </div>
                  <div>
                    <p className="font-semibold">{course.totalLessons || 0}</p>
                    <p>Lessons</p>
                  </div>
                  <div>
                    <p className="font-semibold">⭐ {course.averageRating?.toFixed(1) || '0.0'}</p>
                    <p>Rating</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${course.price}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => { setSelectedCourse(course); setShowDetailModal(true); }}
                    variant="outline" className="flex-1" size="sm"
                  >
                    <Eye className="w-4 h-4 mr-1" /> Details
                  </Button>
                  {course.status === 'pending' && (
                    <>
                      <Button onClick={() => handleApproveCourse(course._id)} className="bg-green-600 hover:bg-green-700 text-white" size="sm">✓</Button>
                      <Button onClick={() => handleRejectCourse(course._id)} className="bg-red-600 hover:bg-red-700 text-white" size="sm">✗</Button>
                    </>
                  )}
                  <Button
                    onClick={() => { setSelectedCourse(course); setShowDeleteModal(true); }}
                    className="bg-red-600 hover:bg-red-700 text-white" size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No courses found matching your filters
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Course Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedCourse(null);
        }}
        title="Course Details"
      >
        {selectedCourse && (
          <div className="space-y-4">
            <img
              src={selectedCourse.thumbnail}
              alt={selectedCourse.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedCourse.title}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                {getStatusBadge(selectedCourse.status)}
                <Badge className={getLevelColor(selectedCourse.level)}>
                  {selectedCourse.level}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCourse.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Instructor</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCourse.instructor.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCourse.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Price</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">${selectedCourse.price}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Rating</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">⭐ {selectedCourse.rating}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Enrollments</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCourse.totalEnrollments || 0} students</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Lessons</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCourse.totalLessons || 0} lessons</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Created</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(selectedCourse.createdAt).toLocaleString()}
              </p>
            </div>

            {(selectedCourse.status === 'pending' || selectedCourse.status === 'rejected') && (
              <div className="flex gap-2">
                {selectedCourse.status === 'pending' && (
                  <Button onClick={() => { handleApproveCourse(selectedCourse._id); setShowDetailModal(false); }} className="flex-1 bg-green-600 hover:bg-green-700 text-white" size="sm">Approve</Button>
                )}
                <Button onClick={() => { handleRejectCourse(selectedCourse._id); setShowDetailModal(false); }} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white" size="sm">Reject</Button>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => navigate(`/courses/${selectedCourse._id}`)}
                variant="outline"
                className="flex-1"
              >
                View Course Page
              </Button>
              <Button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowDeleteModal(true);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Course
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Course Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCourse(null);
        }}
        title="Delete Course"
      >
        {selectedCourse && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to permanently delete{' '}
              <strong className="text-gray-900 dark:text-white">
                {selectedCourse.title}
              </strong>
              ?
            </p>
            
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg space-y-2">
              <p className="text-sm text-red-800 dark:text-red-400 font-medium">
                ⚠️ This action cannot be undone!
              </p>
              <ul className="text-sm text-red-700 dark:text-red-400 list-disc list-inside space-y-1">
                <li>All course content will be deleted</li>
                <li>{selectedCourse.totalEnrollments || 0} students will lose access</li>
                <li>The instructor will be notified</li>
                <li>All progress data will be lost</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDeleteCourse}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Course
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCourse(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
