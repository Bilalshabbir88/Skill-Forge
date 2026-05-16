const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    module:        { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    course:        { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title:         { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
    description:   { type: String, default: '' },
    videoUrl:      { type: String, required: true },
    duration:      { type: Number, required: true, min: 1 },
    order:         { type: Number, required: true },
    isFreePreview: { type: Boolean, default: false },
    attachments: [
      {
        name: { type: String, required: true },
        url:  { type: String, required: true },
      },
    ],
    interactiveQuizzes: [{
      timestamp: { type: Number, required: true },
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }
    }]
  },
  { timestamps: true }
);

lessonSchema.index({ module: 1, order: 1 }, { unique: true });
lessonSchema.index({ course: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
