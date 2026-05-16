const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    course:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title:       { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
    description: { type: String, default: '' },
    order:       { type: Number, required: true },
    hasQuiz:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

moduleSchema.index({ course: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Module', moduleSchema);
