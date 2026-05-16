import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, Users, TrendingUp, Play, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import CourseCard from '../../components/shared/CourseCard';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      const res = await api.get('/courses', { params: { limit: 6 } });
      const courses = res.data?.data?.courses || [];
      setFeaturedCourses(courses.slice(0, 6));
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience'
    },
    {
      icon: Award,
      title: 'Earn Certificates',
      description: 'Get recognized certificates upon course completion'
    },
    {
      icon: Users,
      title: 'Join Community',
      description: 'Connect with thousands of learners worldwide'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '10,000+' },
    { label: 'Expert Instructors', value: '500+' },
    { label: 'Quality Courses', value: '1,200+' },
    { label: 'Success Rate', value: '94%' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0c12]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-500/10 via-primary-500/5 to-transparent blur-3xl rounded-full -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center justify-center p-1 bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-md rounded-full border border-gray-200 dark:border-gray-700/50 mb-4 animate-in fade-in zoom-in duration-700">
              <span className="px-3 py-1 bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest rounded-full shadow-sm">
                New
              </span>
              <span className="px-4 text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                Data Science Platform v2.0 <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] animate-in slide-in-from-bottom-4 duration-700">
              Master the Future of <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 dark:from-primary-400 dark:to-blue-400">
                Data Science & AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto font-medium animate-in slide-in-from-bottom-6 duration-700 delay-100">
              Join thousands of learners building real-world skills with expert-led courses, interactive coding labs, and AI-powered tutoring.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in slide-in-from-bottom-8 duration-700 delay-200">
              {isAuthenticated() ? (
                <Link to={user?.role === 'student' ? '/student/dashboard' : `/${user?.role}/dashboard`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-10 py-7 text-lg rounded-2xl shadow-xl shadow-primary-500/20 transition-all hover:-translate-y-1">
                    Enter Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-10 py-7 text-lg rounded-2xl shadow-xl shadow-primary-500/20 transition-all hover:-translate-y-1">
                      Start Learning Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/courses" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 py-7 text-lg rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                      <Play className="mr-2 w-5 h-5 fill-current" />
                      View Catalog
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof */}
            <div className="pt-16 flex flex-col items-center justify-center gap-6 opacity-60">
              <p className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Trusted by learners from top companies</p>
              <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-50 dark:invert">
                <div className="text-2xl font-black tracking-tighter">GOOGLE</div>
                <div className="text-2xl font-black tracking-tighter">MICROSOFT</div>
                <div className="text-2xl font-black tracking-tighter">META</div>
                <div className="text-2xl font-black tracking-tighter">AMAZON</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-[#0a0c12] border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-primary-50 text-primary-600 border-none px-4 py-1 font-bold">Why SkillForge?</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Built for Modern Learning
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Everything you need to master Data Science and AI in one place.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-8 rounded-[2.5rem] hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 group">
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50/50 dark:bg-black/20 rounded-[4rem] mb-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Featured Pathways
            </h2>
            <p className="text-lg text-gray-500 font-medium">
              Start your journey with our top-rated Data Science tracks.
            </p>
          </div>
          <Link to="/courses">
            <Button variant="outline" className="rounded-xl border-2 font-bold px-6 h-14">
              Explore All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredCourses.map((course) => (
              <CourseCard key={course?._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
             <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500 font-bold italic">Curating best courses for you...</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      {!isAuthenticated() && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="bg-gradient-to-br from-primary-600 to-indigo-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 tracking-tight">
              Ready to code your future?
            </h2>
            <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto font-medium relative z-10">
              Join 10,000+ students already mastering AI on SkillForge.
            </p>
            <Link to="/register" className="relative z-10">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 px-12 py-8 text-xl font-black rounded-2xl shadow-2xl">
                Get Started Now — It's Free
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Landing;
