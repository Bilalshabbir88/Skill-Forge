import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function QuizForm({ questions, onSubmit, isSubmitted, score }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (isSubmitted) return; // Prevent changes after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    if (Object.keys(selectedAnswers).length !== questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    onSubmit(selectedAnswers);
  };

  const getOptionClass = (questionId, questionIndex, optionIndex, correctAnswer) => {
    if (!isSubmitted) {
      // Before submission: highlight selected option
      return selectedAnswers[questionId] === optionIndex
        ? 'border-primary-500 bg-primary-500/10'
        : 'border-gray-700 hover:border-gray-600';
    }

    // After submission: show correct/incorrect
    const isSelected = selectedAnswers[questionId] === optionIndex;
    const isCorrect = optionIndex === correctAnswer;

    if (isCorrect) {
      return 'border-green-500 bg-green-500/10'; // Correct answer
    }
    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-500/10'; // Wrong answer (selected)
    }
    return 'border-gray-700'; // Not selected
  };

  const getOptionIcon = (questionId, questionIndex, optionIndex, correctAnswer) => {
    if (!isSubmitted) return null;

    const isSelected = selectedAnswers[questionId] === optionIndex;
    const isCorrect = optionIndex === correctAnswer;

    if (isCorrect) {
      return <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />;
    }
    if (isSelected && !isCorrect) {
      return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((question, questionIndex) => (
        <Card key={question._id} className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            {/* Question Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 font-semibold flex-shrink-0">
                {questionIndex + 1}
              </div>
              <h3 className="text-lg font-medium text-gray-100 flex-1">
                {question.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 ml-11">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[question._id] === optionIndex;
                const optionLabel = String.fromCharCode(65 + optionIndex); // A, B, C, D

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() => handleAnswerSelect(question._id, optionIndex)}
                    disabled={isSubmitted}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${getOptionClass(
                      question._id,
                      questionIndex,
                      optionIndex,
                      question.correctAnswer
                    )} ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {/* Radio/Checkbox indicator */}
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-current flex-shrink-0">
                      {isSelected && !isSubmitted && (
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                      )}
                    </div>

                    {/* Option Label (A, B, C, D) */}
                    <span className="font-medium text-gray-400 flex-shrink-0">
                      {optionLabel}.
                    </span>

                    {/* Option Text */}
                    <span className="text-gray-200 flex-1">{option}</span>

                    {/* Correct/Incorrect Icon */}
                    {getOptionIcon(
                      question._id,
                      questionIndex,
                      optionIndex,
                      question.correctAnswer
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation (only shown after submission if question was wrong) */}
            {isSubmitted &&
              selectedAnswers[question._id] !== question.correctAnswer &&
              question.explanation && (
                <div className="mt-4 ml-11 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-400 mb-1">
                        Explanation:
                      </p>
                      <p className="text-sm text-gray-300">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      ))}

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={Object.keys(selectedAnswers).length !== questions.length}
            className="min-w-[200px]"
          >
            Submit Quiz
          </Button>
        </div>
      )}

      {/* Score Display */}
      {isSubmitted && score !== null && (
        <Card className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 border-primary-500/30">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-100 mb-2">
                Your Score: {score}%
              </h3>
              <p className="text-gray-300">
                {score >= 70 ? (
                  <span className="text-green-400 font-medium">
                    🎉 Congratulations! You passed the quiz.
                  </span>
                ) : (
                  <span className="text-yellow-400 font-medium">
                    You need 70% to pass. Review the material and try again.
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
