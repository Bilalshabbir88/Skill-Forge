const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema(
  {
    student:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson:         { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    course:         { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    watchedSeconds: { type: Number, default: 0 },
    isCompleted:    { type: Boolean, default: false },
    completedAt:    { type: Date },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ student: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);
