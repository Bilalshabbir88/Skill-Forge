const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    text: { type: String, required: true, trim: true },
    options: [
      {
        label: { type: String, required: true },
        text:  { type: String, required: true },
      },
    ],
    correctOption: { type: Number, required: true, min: 0, max: 3 },
    explanation:   { type: String, default: '' },
    order:         { type: Number, required: true },
  },
  { timestamps: true }
);

// Validate exactly 4 options
questionSchema.pre('save', function (next) {
  if (this.options.length !== 4) {
    return next(new Error('Each question must have exactly 4 options.'));
  }
  next();
});

module.exports = mongoose.model('Question', questionSchema);
