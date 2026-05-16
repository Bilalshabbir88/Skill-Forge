const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  student:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz:          { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  course:        { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  answers: [
    {
      question:       { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      selectedOption: { type: Number, required: true, min: 0, max: 3 },
      isCorrect:      { type: Boolean, required: true },
    },
  ],
  score:         { type: Number, required: true },
  passed:        { type: Boolean, required: true },
  attemptNumber: { type: Number, required: true },
  submittedAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
