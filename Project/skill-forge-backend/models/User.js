const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String, required: true, unique: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: { type: String, minlength: 8, select: false },
    googleId: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
    status: {
      type: String,
      enum: ['active', 'pending', 'banned'],
      default: function () {
        return this.role === 'instructor' ? 'pending' : 'active';
      },
    },
    profilePicture: { type: String, default: '' },
    bio: { type: String, maxlength: 500, default: '' },
    phone: { type: String, default: '' },
    socialLinks: {
      website:  { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter:  { type: String, default: '' },
      github:   { type: String, default: '' },
    },
    passwordResetToken:   { type: String, select: false },
    passwordResetExpires: { type: Date,   select: false },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model('User', userSchema);
