const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateId:   { type: String, required: true, unique: true },
    student:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:          { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    studentName:     { type: String, required: true },
    courseTitle:     { type: String, required: true },
    instructorName:  { type: String, required: true },
    issuedAt:        { type: Date, default: Date.now },
    verificationUrl: { type: String, required: true },
  },
  { timestamps: true }
);

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', certificateSchema);
