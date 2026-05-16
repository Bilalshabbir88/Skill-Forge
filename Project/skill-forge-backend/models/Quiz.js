const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    module:         { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true, unique: true },
    course:         { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title:          { type: String, required: true, trim: true },
    passingScore:   { type: Number, required: true, min: 1, max: 100, default: 70 },
    maxAttempts:    { type: Number, default: 3 },
    retryWaitHours: { type: Number, default: 24 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
