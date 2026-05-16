const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:           { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    paymentStatus:    { type: String, enum: ['free', 'paid', 'mock_paid'], required: true },
    amountPaid:       { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    progressPercent:  { type: Number, default: 0, min: 0, max: 100 },
    isCompleted:      { type: Boolean, default: false },
    completedAt:      { type: Date },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
