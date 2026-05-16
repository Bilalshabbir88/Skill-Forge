const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: false },
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

module.exports = mongoose.model('Question', questionSchema);
