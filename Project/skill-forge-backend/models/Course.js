const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 150 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true, minlength: 20, maxlength: 5000 },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    thumbnail: { type: String, required: true },
    price: { type: Number, required: true, min: 0, default: 0 },
    isFree: { type: Boolean, default: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    language: { type: String, default: 'English' },
    tags: [{ type: String, trim: true }],
    prerequisites: [{ type: String, trim: true }],
    whatYouWillLearn: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
    },
    rejectionReason: { type: String, default: '' },
    totalDuration: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    totalEnrollments: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-compute isFree and slug before save
courseSchema.pre('save', function (next) {
  this.isFree = this.price === 0;
  if (!this.slug) {
    const base = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const rand = Math.random().toString(36).substring(2, 6);
    this.slug = `${base}-${rand}`;
  }
  next();
});

// Text index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });

module.exports = mongoose.model('Course', courseSchema);
