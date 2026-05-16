import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { 
  Download, 
  ArrowLeft, 
  Trophy, 
  Award,
  CheckCircle,
  Loader2,
  Share2
} from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

export default function Certificate() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCertificateData();
  }, [courseId]);

  const fetchCertificateData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseRes, enrollmentsRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get('/enrollments/my')
      ]);

      const courseData = courseRes.data?.data;
      const enrollmentsData = enrollmentsRes.data?.data || [];
      
      setCourse(courseData);
      
      const enroll = enrollmentsData.find(e => (e.course?._id || e.course) === courseId);
      
      if (!enroll) {
        setError('You are not enrolled in this course.');
        return;
      }

      // Check both "isCompleted" and "completed" depending on legacy/new schema
      if (!enroll.isCompleted && !enroll.completed) {
        setError('Course not fully completed yet.');
        return;
      }

      setEnrollment(enroll);
    } catch (err) {
      console.error('Error fetching certificate data:', err);
      setError(err.response?.data?.message || 'Failed to verify certificate eligibility.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${course?.title || 'SkillForge'}_Certificate.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white dark:bg-[#0a0c12] flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0c12]">
      <Navbar />
      <div className="max-w-6xl mx-auto py-16 px-4">
        {error ? (
          <Card className="max-w-md mx-auto p-12 text-center rounded-[3rem] border-none shadow-2xl">
             <Award className="w-20 h-20 text-gray-200 mx-auto mb-6" />
             <h2 className="text-2xl font-black mb-4">Not Earned Yet</h2>
             <p className="text-gray-500 mb-8">{error}</p>
             <Button onClick={() => navigate('/student/dashboard')} className="w-full rounded-2xl h-14 font-bold">Back to Dashboard</Button>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-12">
               <Button variant="ghost" onClick={() => navigate(-1)} className="font-bold text-gray-500"><ArrowLeft className="mr-2" /> Back</Button>
               <div className="flex gap-4">
                  <Button variant="outline" onClick={handleDownloadPDF} disabled={downloading} className="rounded-xl font-bold border-2 h-12">
                    {downloading ? 'Processing...' : <><Download className="mr-2" /> Save PDF</>}
                  </Button>
                  <Button className="rounded-xl font-bold h-12 px-8 bg-primary-600">Share Achievement</Button>
               </div>
            </div>

            <div className="relative group">
               {/* Certificate Component */}
               <div ref={certificateRef} className="bg-white p-12 md:p-24 rounded-lg shadow-2xl border-[16px] border-gray-50 relative overflow-hidden text-center aspect-[1.414]">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03]"></div>
                  <div className="relative z-10 space-y-12">
                     <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter text-primary-600">SKILLFORGE ACADEMY</h1>
                        <p className="text-[10px] font-black tracking-[0.4em] text-gray-400">EXCELLENCE IN DATA SCIENCE</p>
                     </div>

                     <div className="py-12 border-y-2 border-gray-100 max-w-xl mx-auto">
                        <p className="text-lg font-serif italic text-gray-500 mb-8">This is to certify that</p>
                        <h2 className="text-5xl font-black text-gray-900 mb-8 uppercase tracking-tight">{user?.name}</h2>
                        <p className="text-lg font-serif italic text-gray-500">has successfully completed the specialized track</p>
                        <h3 className="text-3xl font-bold text-primary-700 mt-6">{course?.title}</h3>
                     </div>

                     <div className="flex justify-between items-end pt-12">
                        <div className="text-left space-y-2">
                           <div className="w-48 h-px bg-gray-900"></div>
                           <p className="text-xs font-black uppercase text-gray-400">Head of Curriculum</p>
                        </div>
                        <div className="text-center">
                           <Award className="w-20 h-20 text-primary-600 opacity-20" />
                        </div>
                        <div className="text-right space-y-1">
                           <p className="text-[10px] font-black text-gray-400">CERTIFICATE ID</p>
                           <p className="text-sm font-mono font-bold uppercase">{enrollment?._id?.slice(-12)}</p>
                           <p className="text-[9px] text-gray-400 font-bold">{new Date().toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
