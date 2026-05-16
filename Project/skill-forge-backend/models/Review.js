const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, minlength: 10, maxlength: 1000, trim: true },
  },
  { timestamps: true }
);

reviewSchema.index({ student: 1, course: 1 }, { unique: true });

// Recalculate course averageRating after save
async function recalcRating(courseId) {
  const Course = mongoose.model('Course');
  const reviews = await mongoose.model('Review').find({ course: courseId });
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10
      : 0;
  await Course.findByIdAndUpdate(courseId, { averageRating, totalReviews });
}

reviewSchema.post('save', async function () {
  await recalcRating(this.course);
});

reviewSchema.post('remove', async function () {
  await recalcRating(this.course);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) await recalcRating(doc.course);
});

module.exports = mongoose.model('Review', reviewSchema);
