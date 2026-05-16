import { useState, useEffect } from 'react';
import { Award, ChevronRight, BookOpen, Star, Users, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../api/api';
import Loader from '../../components/shared/Loader';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
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
      setSpecializations(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white dark:bg-[#0a0c12] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0c12]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-slate-950 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-600/20 blur-[100px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Badge className="mb-6 bg-primary-500/20 text-primary-400 border-primary-500/50 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            Elite Learning Tracks
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Professional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Certifications</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Master complex domains through curated sequences of expert-led courses. Earn industry-recognized credentials.
          </p>
          <div className="flex justify-center items-center gap-8">
             <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">50k+</span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Graduates</span>
             </div>
             <div className="w-px h-10 bg-gray-800"></div>
             <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-white">94%</span>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Career Growth</span>
             </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {specializations.length > 0 ? (
          <div className="grid gap-16">
            {specializations.map((spec) => (
              <div key={spec?._id} className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  <div className="lg:w-2/5 relative overflow-hidden min-h-[300px]">
                    <img 
                      src={spec?.thumbnail || `https://picsum.photos/seed/${spec?._id}/800/600`} 
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    <div className="absolute top-8 left-8">
                      <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl">
                         <Zap className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-3/5 p-10 lg:p-16 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                       <span className="text-xs font-black text-primary-600 uppercase tracking-widest">{spec?.category?.name || 'SPECIALIZATION'}</span>
                       <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                       <span className="text-xs font-bold text-gray-400">Professional Certificate</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-primary-600 transition-colors">
                      {spec?.title}
                    </h2>
                    
                    <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-medium text-lg">
                      {spec?.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Curriculum</p>
                        <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                           <BookOpen className="w-4 h-4 text-primary-500" /> {spec?.courses?.length || 0} Professional Courses
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Accreditation</p>
                        <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-green-500" /> SkillForge Certified
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row gap-4">
                      <Button asChild size="lg" className="px-10 bg-primary-600 hover:bg-primary-700 h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20">
                        <Link to={`/specializations/${spec?._id}`}>
                          View Track Details <ChevronRight className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="lg" className="h-16 rounded-2xl font-black border-2">
                        Syllabus PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
            <Award className="w-20 h-20 mx-auto text-gray-200 mb-6" />
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">New Tracks Arriving</h3>
            <p className="text-gray-500 max-w-md mx-auto">We are currently curating new professional specializations for you. Stay tuned!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Specializations;
