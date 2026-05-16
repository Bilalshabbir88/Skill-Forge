import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/api';
import QuizForm from '@/components/student/QuizForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Trophy, 
  RotateCcw, 
  FileText, 
  Loader2,
  AlertTriangle
} from 'lucide-react';

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

      // 1) Fetch course info
      const courseRes = await api.get(`/courses/${courseId}`);
      const courseData = courseRes.data.data;
      setCourse(courseData);

      // 2) Find the first module that has a quiz
      const mods = courseData.modules || [];
      if (mods.length === 0) throw new Error('No modules found for this course.');

      let foundQuiz = null;
      let foundModuleId = null;
      for (const mod of mods) {
        if (mod.hasQuiz) {
          try {
            const qRes = await api.get(`/courses/${courseId}/modules/${mod._id}/quiz`);
            foundQuiz = qRes.data.data;
            foundModuleId = mod._id;
            break;
          } catch { /* try next module */ }
        }
      }

      if (!foundQuiz) throw new Error('No quiz found for this course.');
      setQuiz({ ...foundQuiz.quiz, questions: foundQuiz.questions, moduleId: foundModuleId });
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async (selectedAnswers) => {
    try {
      setSubmitting(true);
      if (!quiz?.moduleId) throw new Error('Quiz module not found.');

      // Transform { questionId: optionIndex } → [{ questionId, selectedOption }]
      const answers = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      const response = await api.post(
        `/courses/${courseId}/modules/${quiz.moduleId}/quiz/submit`,
        { answers }
      );

      const result = response.data.data;
      setScore(result.score);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert(err.response?.data?.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setIsSubmitted(false);
    setScore(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-100 mb-2">
              Unable to Load Quiz
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={fetchQuizData}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-100 mb-2">
              No Quiz Available
            </h2>
            <p className="text-gray-400 mb-6">
              This course doesn't have a quiz yet.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const passingScore = 70;
  const hasPassed = score !== null && score >= passingScore;

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-2">
                {course?.title} - Final Quiz
              </h1>
              <p className="text-gray-400">
                {quiz.questions.length} questions • Passing score: {passingScore}%
              </p>
            </div>

            {isSubmitted && hasPassed && (
              <Link to={`/student/certificate/${courseId}`}>
                <Button className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  View Certificate
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Instructions (only before submission) */}
        {!isSubmitted && (
          <Card className="bg-blue-500/10 border-blue-500/30 mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Instructions
              </h3>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Answer all questions before submitting</li>
                <li>• Select the best answer for each question</li>
                <li>• You need {passingScore}% to pass and earn a certificate</li>
                <li>• You can retake the quiz if you don't pass</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Quiz Form */}
        {submitting ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Grading your quiz...</p>
            </div>
          </div>
        ) : (
          <QuizForm
            questions={quiz.questions}
            onSubmit={handleSubmitQuiz}
            isSubmitted={isSubmitted}
            score={score}
          />
        )}

        {/* Action Buttons (after submission) */}
        {isSubmitted && (
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handleRetakeQuiz}
              className="min-w-[160px]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>

            {hasPassed && (
              <Link to={`/student/certificate/${courseId}`}>
                <Button className="min-w-[160px]">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Certificate
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
