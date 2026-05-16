const mongoose = require('mongoose');

const codingLabSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  instructions: {
    type: String,
    required: true
  },
  starterCode: {
    type: String,
    default: ''
  },
  solutionCode: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['python', 'javascript', 'r'],
    default: 'python'
  },
  // Judge0 language ID (e.g., Python 3 is 71)
  languageId: {
    type: Number,
    default: 71 
  },
  testCases: [{
    input: { type: String, default: '' },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('CodingLab', codingLabSchema);