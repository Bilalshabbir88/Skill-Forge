import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import {
  Clock,
  Award,
  BookOpen,
  Users,
  Star,
  Lock,
  CheckCircle,
  Play,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import Loader from '../../components/shared/Loader';
import api from '../../api/api';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isEnrolled, enrollInCourse } = useEnrollment();
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const enrolled = isEnrolled(id);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      // GET /api/courses/:id returns { data: { ...course, modules: [...] } }
      const courseRes = await api.get(`/courses/${id}`);
      const courseData = courseRes.data.data;
      setCourse(courseData);
      setModules(courseData.modules || []);
      // Instructor is already populated in the course object
      if (courseData.instructor) setInstructor(courseData.instructor);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to enroll');
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      // Backend expects { courseId, paymentMethod }
      const paymentMethod = course.isFree ? 'free' : 'mock';
      await enrollInCourse(id, paymentMethod);
      toast.success('Successfully enrolled!');
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course not found
          </h2>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.totalLessons || modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const totalDurationSec = course.totalDuration || modules.reduce(
    (acc, m) => acc + (m.lessons?.reduce((s, l) => s + (l.duration || 0), 0) || 0), 0
  );
  const totalHours = Math.floor(totalDurationSec / 3600);
  const totalMins = Math.floor((totalDurationSec % 3600) / 60);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section with Course Info */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <Badge className="bg-white/20 text-white border-white/30">
                {course.category?.name || course.category}
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-primary-100 leading-relaxed">
                {course.description}
              </p>
              
              {/* Course Meta */}
              <div className="flex flex-wrap gap-6 text-primary-100">
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{course.averageRating?.toFixed(1) || '0.0'}</span>
                    <span>({course.totalReviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{course.totalEnrollments || 0} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{totalHours}h {totalMins}m</span>
                  </div>
              </div>

              {/* Instructor */}
              {instructor && (
                <div className="flex items-center gap-4 pt-4">
                  <img
                    src={instructor.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=6366f1&color=fff`}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-full border-2 border-white/30 object-cover"
                  />
                  <div>
                    <p className="text-sm text-primary-100">Created by</p>
                    <p className="text-lg font-semibold">{instructor.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-900 p-6 space-y-6 sticky top-24">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </div>
                  {course.price > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      One-time payment • Lifetime access
                    </p>
                  )}
                </div>

                {enrolled ? (
                  <Link to={`/student/courses/${id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg">
                      <Play className="w-5 h-5 mr-2" />
                      Continue Learning
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 text-lg"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}

                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Access on mobile and desktop</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Downloadable resources</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="curriculum" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Course Curriculum
                </h2>
                
                {modules.length > 0 ? (
                  <Accordion type="multiple" className="space-y-4">
                    {modules.map((module, index) => (
                      <AccordionItem
                        key={module._id}
                        value={`module-${index}`}
                        className="border border-gray-200 dark:border-gray-800 rounded-lg px-6"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {module.title}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {module.lessons?.length || 0} lessons
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-2 ml-14">
                            {module.lessons && module.lessons.length > 0 ? (
                              module.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson._id}
                                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    {enrolled ? (
                                      <Play className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-gray-400" />
                                    )}
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                      {lesson.title || `Lesson ${lessonIndex + 1}`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {lesson.isFreePreview && !enrolled && (
                                      <span className="text-xs text-blue-500 font-medium">Free</span>
                                    )}
                                    {lesson.duration && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {Math.round(lesson.duration / 60)} min
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
                                No lessons available yet
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Course curriculum coming soon
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    What you'll learn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      'Master the fundamentals and advanced concepts',
                      'Build real-world projects from scratch',
                      'Apply industry best practices',
                      'Get career-ready skills',
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Basic understanding of programming concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>A computer with internet connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Enthusiasm to learn</span>
                    </li>
                  </ul>
                </div>

                {instructor && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      About the Instructor
                    </h2>
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={instructor.profileImage}
                          alt={instructor.name}
                          className="w-20 h-20 rounded-full"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {instructor.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Expert Instructor with years of experience in {course.category}
                          </p>
                          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              <span>50+ courses</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>100K+ students</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>4.9 rating</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
