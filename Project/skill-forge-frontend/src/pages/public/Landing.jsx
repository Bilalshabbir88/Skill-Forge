import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, Users, TrendingUp, Play, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import CourseCard from '../../components/shared/CourseCard';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      // Backend returns { data: { courses: [...], total, page } }
      const res = await api.get('/courses', { params: { limit: 6 } });
      const courses = res.data.data?.courses || [];
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
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-500/10 via-primary-500/5 to-transparent blur-3xl rounded-full -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center justify-center p-1 bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-md rounded-full border border-gray-200 dark:border-gray-700/50 mb-4">
              <span className="px-3 py-1 bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest rounded-full shadow-sm">
                New
              </span>
              <span className="px-4 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                Data Science Platform v2.0 <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
              Master the Future of <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 dark:from-primary-400 dark:to-blue-400">
                Data Science & AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto font-medium">
              Join thousands of learners building real-world skills with expert-led courses, interactive coding labs, and AI-powered tutoring.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              {isAuthenticated() ? (
                <Link to={user.role === 'student' ? '/student/dashboard' : `/${user.role}/dashboard`} className="w-full sm:w-auto">
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
                      <Play className="mr-2 w-5 h-5" />
                      View Catalog
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof */}
            <div className="pt-16 flex flex-col items-center justify-center gap-4 opacity-80">
              <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">Trusted by learners from top companies</p>
              <div className="flex items-center gap-8 grayscale opacity-50 dark:invert">
                <div className="text-xl font-black">GOOGLE</div>
                <div className="text-xl font-black">MICROSOFT</div>
                <div className="text-xl font-black">META</div>
                <div className="text-xl font-black">AMAZON</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Skill Forge?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to succeed in your learning journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50">
                <div className="w-14 h-14 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start learning with our most popular courses
            </p>
          </div>
          <Link to="/courses">
            <Button variant="outline" className="border-2">
              View All Courses
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {!isAuthenticated() && (
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning on Skill Forge. Start your first course today!
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Landing;
