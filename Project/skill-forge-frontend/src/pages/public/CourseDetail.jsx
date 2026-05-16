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
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import Loader from '../../components/shared/Loader';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
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
      const courseRes = await api.get(`/courses/${id}`);
      const courseData = courseRes.data?.data;
      if (!courseData) throw new Error('Course not found');
      
      setCourse(courseData);
      setModules(courseData.modules || []);
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

    if (user?.role !== 'student') {
      toast.error('Only students can enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      const paymentMethod = course?.price === 0 ? 'free' : 'mock';
      await enrollInCourse(id, paymentMethod);
      toast.success('Successfully enrolled!');
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white dark:bg-[#0a0c12] flex items-center justify-center"><Loader /></div>;

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0c12] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <Button asChild><Link to="/courses">Browse Catalog</Link></Button>
      </div>
    );
  }

  const totalLessons = course?.totalLessons || modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const totalDurationSec = course?.totalDuration || 0;
  const totalHours = Math.floor(totalDurationSec / 3600);
  const totalMins = Math.floor((totalDurationSec % 3600) / 60);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0c12]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-slate-950 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary-500 hover:bg-primary-600 border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                  {course?.category?.name || course?.category}
                </Badge>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-black">{course?.averageRating?.toFixed(1) || '5.0'}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                {course?.title}
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-3xl">
                {course?.description}
              </p>
              
              <div className="flex flex-wrap gap-8 text-sm font-bold text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-500" />
                    <span>{course?.totalEnrollments || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    <span>{totalLessons} Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-500" />
                    <span>{totalHours}h {totalMins}m Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary-500" />
                    <span>Accredited Track</span>
                  </div>
              </div>

              {instructor && (
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <img
                    src={instructor?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}`}
                    className="w-14 h-14 rounded-2xl border-2 border-white/20 object-cover shadow-xl"
                    alt=""
                  />
                  <div>
                    <p className="text-xs font-black text-primary-400 uppercase tracking-widest">Master Instructor</p>
                    <p className="text-xl font-bold">{instructor?.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Card */}
            <div className="lg:sticky lg:top-24">
              <Card className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl border-none overflow-hidden relative group">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 shadow-inner">
                  <img src={course?.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">
                      {course?.price === 0 ? 'FREE' : `$${course?.price}`}
                    </span>
                    {course?.price > 0 && <span className="text-gray-400 font-bold line-through">$199.99</span>}
                  </div>
                  <p className="text-xs font-black text-primary-600 uppercase tracking-widest mt-2">Limited Time Offer</p>
                </div>

                {enrolled ? (
                  <Link to={`/student/courses/${id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-green-500/20">
                      Jump Back In
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all active:scale-95"
                  >
                    {enrolling ? 'Processing...' : 'Enroll Path'}
                  </Button>
                )}

                <div className="space-y-4 pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
                  {[
                    'Lifetime Full Access',
                    'Industry Certificate',
                    'Interactive Lab Access',
                    'Downloadable Datasets'
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <Tabs defaultValue="curriculum" className="space-y-12">
              <TabsList className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-full sm:w-auto h-auto">
                <TabsTrigger value="curriculum" className="px-8 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 font-black uppercase tracking-widest text-xs">Curriculum</TabsTrigger>
                <TabsTrigger value="overview" className="px-8 py-3 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 font-black uppercase tracking-widest text-xs">Path Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum">
                {modules?.length > 0 ? (
                  <Accordion type="multiple" className="space-y-6">
                    {modules.map((module, index) => (
                      <AccordionItem
                        key={module?._id}
                        value={`module-${index}`}
                        className="border border-gray-100 dark:border-gray-800 rounded-[2rem] bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline p-8">
                          <div className="flex items-center gap-6 text-left">
                            <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl font-black">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                {module?.title}
                              </h3>
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">
                                {module?.lessons?.length || 0} Professional Units
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-8 pb-8 pt-0">
                          <div className="space-y-3 ml-20">
                            {(module?.lessons || []).map((lesson, lIdx) => (
                                <div key={lesson?._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent">
                                  <div className="flex items-center gap-4">
                                    {enrolled ? <Play className="w-4 h-4 text-primary-500 fill-current" /> : <Lock className="w-4 h-4 text-gray-300" />}
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{lesson?.title}</span>
                                  </div>
                                  <span className="text-[10px] font-black text-gray-400 uppercase">{Math.round((lesson?.duration || 0)/60)}m</span>
                                </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-center text-gray-500 py-10 font-bold italic">Curriculum is being finalized...</p>
                )}
              </TabsContent>

              <TabsContent value="overview" className="space-y-12">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                   <h2 className="text-3xl font-black tracking-tight mb-8">What this path covers</h2>
                   <div className="grid sm:grid-cols-2 gap-6">
                      {['Master Python Libraries', 'Build ML Portfolios', 'Real-world Lab Exercises', 'Certified Accreditation'].map((t, i) => (
                        <div key={i} className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                           <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600"><CheckCircle className="w-6 h-6" /></div>
                           <span className="font-bold text-gray-800 dark:text-gray-200">{t}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetail;
