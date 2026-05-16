const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 150
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 2000
  },
  sourceUrl: {
    type: String,
    default: '' // Optional link to Kaggle, UCI, etc.
  },
  fileUrl: {
    type: String,
    required: true // Direct download link (e.g., Cloudinary raw file URL)
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Text index for searching datasets
datasetSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Dataset', datasetSchema);