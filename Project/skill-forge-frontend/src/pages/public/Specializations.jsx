import { useState, useEffect } from 'react';
import { Award, ChevronRight, BookOpen, Star, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../api/api';
import Loader from '../../components/shared/Loader';
import { Link } from 'react-router-dom';

const Specializations = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/specializations');
      setSpecializations(res.data.data || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Award className="w-96 h-96 -bottom-20 -right-20 absolute rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Launch Your Career with <br />
            <span className="text-primary-400">Professional Specializations</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-10 leading-relaxed">
            Master a specific career field through a series of related courses. Complete the track and earn a Professional Certificate to showcase your expertise.
          </p>
          <div className="flex items-center space-x-4">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-primary-900" alt="Student" />
                ))}
             </div>
             <p className="text-sm font-medium text-primary-200">Joined by 50,000+ career-driven students</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12">
          {specializations.length > 0 ? specializations.map((spec) => (
            <div key={spec._id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group">
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="lg:w-2/5 relative overflow-hidden">
                  <img 
                    src={spec.thumbnail || `https://picsum.photos/seed/${spec._id}/800/600`} 
                    alt={spec.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <Badge className="bg-primary-500 text-white border-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg">
                      {spec.category?.name || 'Data Science'}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 transition-colors">
                    {spec.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    {spec.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <BookOpen className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Courses</p>
                        <p className="font-bold text-gray-900 dark:text-white">{spec.courses?.length || 0} Modules</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Users className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Students</p>
                        <p className="font-bold text-gray-900 dark:text-white">1.2K+ Enrolled</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Rating</p>
                        <p className="font-bold text-gray-900 dark:text-white">4.9 / 5.0</p>
                      </div>
                    </div>
                  </div>

                  {/* Course List Preview */}
                  <div className="space-y-3 mb-10">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Included Courses</h4>
                    {spec.courses?.slice(0, 3).map((course, i) => (
                      <div key={course._id} className="flex items-center space-x-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-transparent hover:border-primary-500/30 transition-all">
                        <span className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[10px] font-black border border-gray-200 dark:border-gray-600">
                          {i + 1}
                        </span>
                        <span className="truncate">{course.title}</span>
                      </div>
                    ))}
                    {spec.courses?.length > 3 && (
                      <p className="text-xs text-primary-500 font-bold ml-9">+ {spec.courses.length - 3} more courses</p>
                    )}
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="px-10 bg-primary-600 hover:bg-primary-700 h-14 font-bold text-lg rounded-xl shadow-lg shadow-primary-500/20">
                      <Link to={`/specializations/${spec._id}`}>
                        Enroll in Specialization <ChevronRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="h-14 font-bold text-lg rounded-xl border-2">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
              <Award className="w-20 h-20 mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No specializations available yet</h3>
              <p className="text-gray-500">We are currently building world-class curricula for you. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Specializations;