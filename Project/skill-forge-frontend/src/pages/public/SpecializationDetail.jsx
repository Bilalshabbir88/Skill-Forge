import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { 
  BookOpen, 
  Award, 
  Clock, 
  ChevronRight, 
  Play, 
  ShieldCheck, 
  Trophy, 
  CheckCircle,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Loader from '../../components/shared/Loader';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import CourseCard from '../../components/shared/CourseCard';
import toast from 'react-hot-toast';

const SpecializationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecDetails();
  }, [id]);

  const fetchSpecDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/specializations/${id}`);
      setSpec(res.data?.data);
    } catch (error) {
      console.error('Error fetching specialization:', error);
      toast.error('Specialization not found');
      navigate('/specializations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white dark:bg-[#0a0c12] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0c12]">
      <Navbar />
      
      {/* Hero Header */}
      <section className="bg-slate-950 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
                <Badge className="bg-primary-500 hover:bg-primary-600 border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                  Professional Specialization
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                  {spec?.title}
                </h1>
                <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-2xl">
                  {spec?.description}
                </p>
                
                <div className="flex flex-wrap gap-8">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                         <BookOpen className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Modules</p>
                         <p className="text-xl font-bold">{spec?.courses?.length || 0} Expert Courses</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                         <Trophy className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Rewards</p>
                         <p className="text-xl font-bold">Industry Certificate</p>
                      </div>
                   </div>
                </div>
             </div>
             
             <Card className="hidden lg:block bg-white dark:bg-gray-900 border-none shadow-2xl p-8 rounded-[3rem] relative group overflow-hidden">
                <div className="absolute -right-12 -top-12 opacity-5"><Zap className="w-48 h-48" /></div>
                <div className="relative z-10 aspect-video rounded-3xl overflow-hidden mb-8 shadow-inner">
                   <img src={spec?.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                         <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                   </div>
                </div>
                <div className="space-y-4">
                   <h3 className="text-lg font-black uppercase tracking-widest text-gray-400">Track Prerequisites</h3>
                   <div className="space-y-2">
                      {['Basic Python', 'Mathematics', 'Problem Solving'].map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                           <CheckCircle className="w-4 h-4 text-green-500" /> {p}
                        </div>
                      ))}
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </section>

      {/* Curriculum Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-16">
           <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-4">Course Sequence</h2>
           <p className="text-lg text-gray-500 font-medium">Follow this sequence to master the domain and earn your certificate.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
           {spec?.courses?.map((course, index) => (
             <div key={course._id} className="relative group">
                {/* Connector Line */}
                {index < spec.courses.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gray-100 dark:bg-gray-800 z-0"></div>
                )}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center font-black z-20 shadow-lg">
                   {index + 1}
                </div>
                <CourseCard course={course} />
             </div>
           ))}
        </div>

        <div className="mt-20 p-12 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl text-center max-w-4xl mx-auto">
           <ShieldCheck className="w-20 h-20 text-primary-500 mx-auto mb-6" />
           <h2 className="text-3xl font-black mb-4">Verified Accreditation</h2>
           <p className="text-gray-500 font-medium mb-10 leading-relaxed">
             Upon successful completion of all courses in this track and passing the final technical assessments, 
             you will be awarded the <strong>{spec?.title}</strong> verified by SkillForge Academy.
           </p>
           <Button onClick={() => navigate('/courses')} size="lg" className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest bg-primary-600 shadow-xl shadow-primary-500/20">
              Enroll in Track Courses
           </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SpecializationDetail;
