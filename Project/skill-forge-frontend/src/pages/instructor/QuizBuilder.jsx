import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Save,
  CheckCircle,
  Circle,
  FileQuestion,
} from 'lucide-react';

export default function QuizBuilder() {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [passingScore, setPassingScore] = useState(70);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseRes, quizRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/quizzes/course/${id}`).catch(() => ({ data: null }))
      ]);

      setCourse(courseRes.data);

      if (quizRes.data) {
        setQuiz(quizRes.data);
        setQuestions(quizRes.data.questions || []);
        setPassingScore(quizRes.data.passingScore || 70);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load quiz data');
    } finally {
      setLoading(false);
    }
  };

  const openAddQuestionModal = () => {
    setEditingQuestion(null);
    setEditingIndex(null);
    setShowQuestionModal(true);
  };

  const openEditQuestionModal = (question, index) => {
    setEditingQuestion(question);
    setEditingIndex(index);
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = (question) => {
    if (editingIndex !== null) {
      // Update existing question
      const newQuestions = [...questions];
      newQuestions[editingIndex] = question;
      setQuestions(newQuestions);
    } else {
      // Add new question
      setQuestions([...questions, question]);
    }
    setShowQuestionModal(false);
  };

  const handleDeleteQuestion = (index) => {
    if (!confirm('Delete this question?')) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveQuiz = async () => {
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const quizData = {
        courseId: id,
        questions,
        passingScore,
      };

      if (quiz) {
        await api.put(`/quizzes/${quiz._id}`, quizData);
      } else {
        await api.post('/quizzes', quizData);
      }

      navigate('/instructor/dashboard', {
        state: { message: 'Quiz saved successfully!' }
      });
    } catch (err) {
      console.error('Error saving quiz:', err);
      setError(err.response?.data?.message || 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/instructor/dashboard"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {course?.title} - Quiz
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              onClick={openAddQuestionModal}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
            <CardContent className="p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Passing Score Setting */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quiz Settings
            </h3>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Passing Score:
              </label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                min="0"
                max="100"
                className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <span className="text-gray-600 dark:text-gray-400">%</span>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        {questions.length === 0 ? (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-12 text-center">
              <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No questions yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start building your quiz by adding questions
              </p>
              <Button
                onClick={openAddQuestionModal}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mb-6">
            {questions.map((question, index) => (
              <QuestionCard
                key={index}
                question={question}
                index={index}
                onEdit={() => openEditQuestionModal(question, index)}
                onDelete={() => handleDeleteQuestion(index)}
              />
            ))}
          </div>
        )}

        {/* Save Button */}
        {questions.length > 0 && (
          <div className="flex justify-end gap-4">
            <Link to="/instructor/dashboard">
              <Button variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSaveQuiz}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Quiz
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <QuestionModal
          question={editingQuestion}
          onClose={() => setShowQuestionModal(false)}
          onSave={handleSaveQuestion}
        />
      )}
    </div>
  );
}

// Question Card Component
function QuestionCard({ question, index, onEdit, onDelete }) {
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {question.question}
              </h4>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      optionIndex === question.correctAnswer
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    {optionIndex === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">
                      {optionLabels[optionIndex]}.
                    </span>
                    <span className={`${
                      optionIndex === question.correctAnswer
                        ? 'text-gray-900 dark:text-white font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {option}
                    </span>
                  </div>
                ))}
              </div>
              {question.explanation && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Question Modal Component
function QuestionModal({ question, onClose, onSave }) {
  const [formData, setFormData] = useState({
    question: question?.question || '',
    options: question?.options || ['', '', '', ''],
    correctAnswer: question?.correctAnswer ?? 0,
    explanation: question?.explanation || '',
  });

  const handleQuestionChange = (e) => {
    setFormData(prev => ({ ...prev, question: e.target.value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleCorrectAnswerChange = (index) => {
    setFormData(prev => ({ ...prev, correctAnswer: index }));
  };

  const handleExplanationChange = (e) => {
    setFormData(prev => ({ ...prev, explanation: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!formData.question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (formData.options.some(opt => !opt.trim())) {
      alert('Please fill in all options');
      return;
    }

    onSave(formData);
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 max-w-2xl w-full my-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {question ? 'Edit Question' : 'Add Question'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.question}
                onChange={handleQuestionChange}
                placeholder="Enter your question..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                required
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Options <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCorrectAnswerChange(index)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        formData.correctAnswer === index
                          ? 'border-green-600 bg-green-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {formData.correctAnswer === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <span className="font-medium text-gray-600 dark:text-gray-400 flex-shrink-0 w-6">
                      {optionLabels[index]}.
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${optionLabels[index]}`}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Click the circle to mark the correct answer
              </p>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Explanation (Optional)
              </label>
              <textarea
                value={formData.explanation}
                onChange={handleExplanationChange}
                placeholder="Explain why this is the correct answer..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {question ? 'Update Question' : 'Add Question'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
