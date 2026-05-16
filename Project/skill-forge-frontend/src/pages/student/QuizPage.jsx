import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import QuizForm from '../../components/student/QuizForm';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { 
  ArrowLeft, 
  Trophy, 
  RotateCcw, 
  FileText, 
  Loader2,
  AlertTriangle,
  HelpCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuizData();
  }, [courseId]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      setError(null);

      const courseRes = await api.get(`/courses/${courseId}`);
      const courseData = courseRes.data?.data;
      setCourse(courseData);

      // Search all modules for a quiz
      const mods = courseData?.modules || [];
      let foundQuiz = null;
      let foundModuleId = null;

      for (const mod of mods) {
        if (mod.hasQuiz) {
          try {
            const qRes = await api.get(`/courses/${courseId}/modules/${mod._id}/quiz`);
            if (qRes.data?.data?.quiz) {
              foundQuiz = qRes.data.data;
              foundModuleId = mod._id;
              break;
            }
          } catch (e) {
            console.warn(`Module ${mod._id} quiz fetch failed, trying next...`);
          }
        }
      }

      if (!foundQuiz) throw new Error('Technical assessment is not yet available for this course.');
      setQuiz({ ...foundQuiz.quiz, questions: foundQuiz.questions, moduleId: foundModuleId });
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load assessment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async (selectedAnswers) => {
    try {
      setSubmitting(true);
      if (!quiz?.moduleId) throw new Error('Assessment module not found.');

      const answers = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      const response = await api.post(
        `/courses/${courseId}/modules/${quiz.moduleId}/quiz/submit`,
        { answers }
      );

      const result = response.data?.data;
      setScore(result?.score);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert(err.response?.data?.message || 'Failed to grade assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white dark:bg-[#0a0c12] flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0c12]">
      <Navbar />
      <div className="max-w-4xl mx-auto py-16 px-4">
        {error ? (
          <Card className="p-12 text-center rounded-[3rem] border-none shadow-2xl">
             <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
             <h2 className="text-3xl font-black mb-4">Assessment Pending</h2>
             <p className="text-gray-500 mb-8 max-w-sm mx-auto">{error}</p>
             <Button onClick={() => navigate(-1)} className="rounded-2xl h-14 px-12 font-bold">Back to Course</Button>
          </Card>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full">Knowledge Check</span>
                    <span className="text-xs font-bold text-gray-400">Course Verification</span>
                  </div>
                  <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{course?.title}</h1>
               </div>
               
               {isSubmitted && score >= 70 && (
                 <Button asChild className="bg-green-600 hover:bg-green-700 rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-lg shadow-green-500/20">
                   <Link to={`/student/certificate/${courseId}`}><Trophy className="mr-2 w-5 h-5" /> Claim Certificate</Link>
                 </Button>
               )}
            </div>

            {submitting ? (
              <Card className="p-20 text-center rounded-[3rem] border-none shadow-xl bg-white dark:bg-gray-900">
                 <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-6" />
                 <h2 className="text-2xl font-black mb-2">Grading your response...</h2>
                 <p className="text-gray-500">Calculating your Data Science proficiency.</p>
              </Card>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                 <QuizForm
                    questions={quiz?.questions || []}
                    onSubmit={handleSubmitQuiz}
                    isSubmitted={isSubmitted}
                    score={score}
                 />
                 
                 {isSubmitted && (
                    <div className="flex justify-center gap-4 pt-8">
                       <Button variant="outline" onClick={() => { setIsSubmitted(false); setScore(null); }} className="h-14 px-10 rounded-2xl font-bold border-2">
                          <RotateCcw className="mr-2 w-4 h-4" /> Try Again
                       </Button>
                       {score >= 70 ? (
                         <Button asChild className="h-14 px-10 rounded-2xl font-black bg-primary-600">
                            <Link to={`/student/certificate/${courseId}`}>View Certificate</Link>
                         </Button>
                       ) : (
                         <Button variant="ghost" onClick={() => navigate(-1)} className="h-14 px-10 rounded-2xl font-bold text-gray-500">Return to Course</Button>
                       )}
                    </div>
                 )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
