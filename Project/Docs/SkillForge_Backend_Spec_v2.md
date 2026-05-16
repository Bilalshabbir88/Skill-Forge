# SkillForge LMS — Complete Backend Technical Specification
> Version: 2.0 | Status: Build-Ready | Author: Bilal
> This document is the single source of truth for building the SkillForge backend from scratch.
> Every schema, route, rule, error case, and business logic decision is defined here.
> An AI or developer reading only this file should be able to produce a correct, complete backend on the first attempt.

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Folder Structure](#3-folder-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Schemas](#5-database-schemas)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Middleware Stack](#7-middleware-stack)
8. [API Routes — Full Specification](#8-api-routes--full-specification)
   - 8.1 Auth Routes
   - 8.2 User Routes
   - 8.3 Course Routes
   - 8.4 Module Routes
   - 8.5 Lesson Routes
   - 8.6 Quiz Routes
   - 8.7 Enrollment Routes
   - 8.8 Progress Routes
   - 8.9 Review Routes
   - 8.10 Certificate Routes
   - 8.11 Admin Routes
   - 8.12 Category Routes
   - 8.13 Analytics Routes
9. [Business Logic Rules](#9-business-logic-rules)
10. [Error Handling](#10-error-handling)
11. [Rate Limiting](#11-rate-limiting)
12. [Input Validation Rules](#12-input-validation-rules)
13. [Database Seeder Specification](#13-database-seeder-specification)
14. [Security Configuration](#14-security-configuration)
15. [Logging](#15-logging)
16. [Swagger / API Documentation](#16-swagger--api-documentation)
17. [Deployment Notes](#17-deployment-notes)

---

## 1. PROJECT OVERVIEW

**App Name:** SkillForge  
**Type:** Learning Management System (LMS)  
**Architecture:** REST API (Node.js + Express + MongoDB)  
**Frontend:** React 19 + Vite + TailwindCSS + shadcn/ui (pre-built; backend must match its expected API shape)

### Role System
| Role | How Created | Capabilities |
|------|-------------|--------------|
| `student` | Self-registration (choose at signup) | Browse, enroll, watch, quiz, review, certificate |
| `instructor` | Self-registration (choose at signup) → Admin approval | Create courses, modules, lessons, quizzes |
| `admin` | Manually seeded — cannot self-register | Full platform control |

### Key Constraints
- Only **1 admin** exists in the system at any time.
- An instructor in `pending` state **cannot** create courses.
- A course in `pending` or `rejected` state is **invisible** to students.
- Lessons are strictly ordered — skipping ahead is blocked by the backend.
- Quiz: max 3 attempts, with a configurable waiting period between attempts (default: 24 hours).
- Certificate requires: all lessons complete + all module quizzes passed.

---

## 2. TECH STACK & DEPENDENCIES

### Runtime
- **Node.js** >= 18.x
- **npm** >= 9.x

### Core Framework
```
express                  → HTTP server and routing
mongoose                 → MongoDB ODM
dotenv                   → Environment variable loading
```

### Authentication
```
jsonwebtoken             → JWT creation and verification
bcryptjs                 → Password hashing (salt rounds: 12)
passport                 → Auth middleware
passport-google-oauth20  → Google OAuth 2.0 strategy
passport-jwt             → JWT passport strategy
```

### Validation
```
joi                      → Request body schema validation
```

### Security
```
helmet                   → HTTP security headers
cors                     → Cross-origin resource sharing
express-rate-limit       → IP-based rate limiting
express-mongo-sanitize   → NoSQL injection prevention
xss-clean                → XSS attack prevention
hpp                      → HTTP parameter pollution prevention
```

### File / Media
```
cloudinary               → Store URLs only (frontend uploads directly; backend stores resulting URL)
```

### Email
```
nodemailer               → Sending password reset emails
```

### Logging
```
winston                  → Structured error + info logging
morgan                   → HTTP request logging
```

### Documentation
```
swagger-jsdoc            → Generate OpenAPI spec from JSDoc comments
swagger-ui-express       → Serve interactive Swagger UI at /api-docs
```

### Dev Tools
```
nodemon                  → Auto-restart on file change (dev only)
faker / @faker-js/faker  → Generate fake seed data
```

### Full package.json dependencies block:
```json
{
  "dependencies": {
    "@faker-js/faker": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.41.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^6.7.0",
    "helmet": "^7.0.0",
    "hpp": "^0.2.3",
    "joi": "^17.9.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "morgan": "^1.10.0",
    "nodemailer": "^6.9.0",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-jwt": "^4.0.0",
    "swagger-jsdoc": "^6.2.0",
    "swagger-ui-express": "^5.0.0",
    "winston": "^3.9.0",
    "xss-clean": "^0.1.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## 3. FOLDER STRUCTURE

```
skill-forge-backend/
├── server.js                        ← Entry point: starts the HTTP server
├── app.js                           ← Express app setup: middleware, routes, swagger
├── .env                             ← Environment variables (never commit)
├── .env.example                     ← Template showing all required env keys
├── .gitignore
├── package.json
│
├── config/
│   ├── db.js                        ← MongoDB Atlas connection logic
│   ├── passport.js                  ← Passport strategies (Google OAuth, JWT)
│   ├── cloudinary.js                ← Cloudinary SDK config (for URL validation only)
│   ├── email.js                     ← Nodemailer transporter setup
│   └── swagger.js                   ← Swagger/OpenAPI config
│
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Module.js
│   ├── Lesson.js
│   ├── Quiz.js
│   ├── Question.js
│   ├── Enrollment.js
│   ├── LessonProgress.js
│   ├── QuizAttempt.js
│   ├── Review.js
│   ├── Certificate.js
│   └── Category.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── course.controller.js
│   ├── module.controller.js
│   ├── lesson.controller.js
│   ├── quiz.controller.js
│   ├── enrollment.controller.js
│   ├── progress.controller.js
│   ├── review.controller.js
│   ├── certificate.controller.js
│   ├── admin.controller.js
│   ├── category.controller.js
│   └── analytics.controller.js
│
├── routes/
│   ├── index.js                     ← Aggregates all route files
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── course.routes.js
│   ├── module.routes.js
│   ├── lesson.routes.js
│   ├── quiz.routes.js
│   ├── enrollment.routes.js
│   ├── progress.routes.js
│   ├── review.routes.js
│   ├── certificate.routes.js
│   ├── admin.routes.js
│   ├── category.routes.js
│   └── analytics.routes.js
│
├── middleware/
│   ├── auth.middleware.js           ← verifyToken, requireRole helpers
│   ├── validate.middleware.js       ← Joi validation wrapper
│   ├── rateLimiter.middleware.js    ← Rate limit config per route group
│   └── error.middleware.js          ← Global error handler
│
├── validators/
│   ├── auth.validator.js
│   ├── course.validator.js
│   ├── module.validator.js
│   ├── lesson.validator.js
│   ├── quiz.validator.js
│   ├── review.validator.js
│   └── user.validator.js
│
├── utils/
│   ├── generateToken.js             ← Signs and returns JWT
│   ├── sendEmail.js                 ← Nodemailer wrapper
│   ├── generateCertificateId.js     ← Unique cert ID generator
│   ├── ApiError.js                  ← Custom error class
│   └── ApiResponse.js               ← Standard response wrapper
│
├── logs/
│   ├── error.log                    ← Written by Winston
│   └── combined.log
│
└── seed/
    ├── seed.js                      ← Master seeder entry point
    ├── seedUsers.js
    ├── seedCategories.js
    ├── seedCourses.js
    ├── seedModulesLessons.js
    ├── seedQuizzes.js
    └── seedEnrollments.js
```

---

## 4. ENVIRONMENT VARIABLES

All keys below are **required** unless marked optional. App must throw an error and refuse to start if any required key is missing.

```env
# ── Server ────────────────────────────────────────────
NODE_ENV=development                  # development | production
PORT=5000                             # Falls back to 5000 if not set

# ── MongoDB ───────────────────────────────────────────
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/skillforge?retryWrites=true&w=majority

# ── JWT ───────────────────────────────────────────────
JWT_SECRET=replace_with_a_long_random_secret_min_32_chars
JWT_EXPIRES_IN=1d                     # Token lifetime

# ── Password Reset ────────────────────────────────────
RESET_TOKEN_SECRET=another_long_random_secret
RESET_TOKEN_EXPIRES_IN=15m            # Reset link valid for 15 minutes

# ── Google OAuth ──────────────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ── Frontend URL (for CORS + redirect after OAuth) ────
CLIENT_URL=http://localhost:5173

# ── Email (Nodemailer — Gmail example) ────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password    # Use Gmail App Password, not account password
EMAIL_FROM="SkillForge <noreply@skillforge.com>"

# ── Cloudinary (URL validation only — frontend uploads directly) ──
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Rate Limiting ─────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000           # 15 minutes in milliseconds
RATE_LIMIT_MAX=100                    # Max requests per window per IP
AUTH_RATE_LIMIT_MAX=10                # Stricter limit for auth routes

# ── Quiz Rules ────────────────────────────────────────
QUIZ_MAX_ATTEMPTS=3
QUIZ_RETRY_WAIT_HOURS=24              # Hours student must wait before retrying

# ── Admin Seed (for seeder only) ─────────────────────
ADMIN_EMAIL=admin@skillforge.com
ADMIN_PASSWORD=Admin@123456

# ── Lesson Completion Threshold ───────────────────────
LESSON_COMPLETE_THRESHOLD=0.8        # 80% of video watched = lesson complete
```

---

## 5. DATABASE SCHEMAS

All models use Mongoose. Every schema includes `timestamps: true` (adds `createdAt` and `updatedAt` automatically).

---

### 5.1 User Model (`models/User.js`)

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  password: {
    type: String,
    minlength: 8,
    select: false            // NEVER returned in queries by default
    // Not required: Google OAuth users have no password
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true             // Allows multiple nulls (non-Google users)
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    required: true
  },
  status: {
    type: String,
    enum: ["active", "pending", "banned"],
    default: function () {
      // Students are active immediately; instructors start as pending
      return this.role === "instructor" ? "pending" : "active";
    }
  },
  profilePicture: {
    type: String,
    default: ""              // Cloudinary URL from frontend upload
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  socialLinks: {
    website: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter:  { type: String, default: "" },
    github:   { type: String, default: "" }
  },
  passwordResetToken:   { type: String, select: false },
  passwordResetExpires: { type: Date,   select: false },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],  // denormalized for quick access
  timestamps: true
}
```

**Pre-save hook:** Hash `password` with bcrypt (salt 12) before saving if `password` field was modified.  
**Indexes:** `email` (unique), `googleId` (sparse unique), `role`, `status`

---

### 5.2 Category Model (`models/Category.js`)

```javascript
{
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true          // Auto-generated from name on save
  },
  description: { type: String, default: "" },
  icon:         { type: String, default: "" },  // Cloudinary URL or icon name
  timestamps: true
}
```

---

### 5.3 Course Model (`models/Course.js`)

```javascript
{
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 150
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true          // Auto-generated from title; append short UUID if collision
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 5000
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  thumbnail: {
    type: String,
    required: true           // Cloudinary URL — frontend uploads, sends URL here
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0               // 0 = free
  },
  isFree: {
    type: Boolean,
    default: true            // Computed: set automatically in pre-save (price === 0)
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },
  language: {
    type: String,
    default: "English"
  },
  tags: [{ type: String, trim: true }],
  prerequisites: [{ type: String, trim: true }],    // Plain text bullet points
  whatYouWillLearn: [{ type: String, trim: true }], // Plain text bullet points; min 1 item
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected"],
    default: "draft"
    // draft   → instructor hasn't submitted yet (invisible to all)
    // pending → submitted for review (invisible to students)
    // approved → live and visible to students
    // rejected → sent back; instructor can edit and resubmit
  },
  rejectionReason: { type: String, default: "" },   // Admin fills this on rejection
  totalDuration: { type: Number, default: 0 },       // Sum of all lesson durations in seconds (auto-computed)
  totalLessons:  { type: Number, default: 0 },       // Auto-computed on module/lesson save
  totalEnrollments: { type: Number, default: 0 },    // Incremented on enrollment
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews:  { type: Number, default: 0 },
  timestamps: true
}
```

**Indexes:** `instructor`, `category`, `status`, `slug` (unique), text index on `title` + `description` + `tags`

---

### 5.4 Module Model (`models/Module.js`)

```javascript
{
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 150
  },
  description: { type: String, default: "" },
  order: {
    type: Number,
    required: true           // 1-based; determines display and access order
  },
  hasQuiz: {
    type: Boolean,
    default: false           // Set to true when a quiz is added to this module
  },
  timestamps: true
}
```

**Compound index:** `{ course: 1, order: 1 }` unique — no two modules in the same course can share an order number.

---

### 5.5 Lesson Model (`models/Lesson.js`)

```javascript
{
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true           // Denormalized for fast lookups
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 150
  },
  description: { type: String, default: "" },
  videoUrl: {
    type: String,
    required: true           // YouTube or Cloudinary URL
  },
  duration: {
    type: Number,
    required: true,
    min: 1                   // Duration in seconds
  },
  order: {
    type: Number,
    required: true           // Order within the module (1-based)
  },
  isFreePreview: {
    type: Boolean,
    default: false           // If true, non-enrolled users can watch this lesson
  },
  attachments: [
    {
      name: { type: String, required: true },   // Display name e.g. "Week 1 Notes.pdf"
      url:  { type: String, required: true }    // Cloudinary URL
    }
  ],
  timestamps: true
}
```

**Compound index:** `{ module: 1, order: 1 }` unique

---

### 5.6 Quiz Model (`models/Quiz.js`)

```javascript
{
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
    unique: true             // One quiz per module only
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  passingScore: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    default: 70              // Percentage required to pass (e.g., 70 = 70%)
  },
  maxAttempts: {
    type: Number,
    default: 3               // Pulled from env QUIZ_MAX_ATTEMPTS at seed/creation time
  },
  retryWaitHours: {
    type: Number,
    default: 24              // Hours before a failed student can retry
  },
  timestamps: true
}
```

---

### 5.7 Question Model (`models/Question.js`)

```javascript
{
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  options: [
    {
      label: { type: String, required: true },  // e.g. "A", "B", "C", "D" or full text
      text:  { type: String, required: true }
    }
  ],                                             // Must have exactly 4 options
  correctOption: {
    type: Number,
    required: true,
    min: 0,
    max: 3                   // Index into options array (0–3)
  },
  explanation: { type: String, default: "" },    // Optional: shown after quiz submission
  order: { type: Number, required: true },       // Display order within quiz
  timestamps: true
}
```

**Validation rule:** Exactly 4 options must be provided. `correctOption` must be a valid index (0–3).

---

### 5.8 Enrollment Model (`models/Enrollment.js`)

```javascript
{
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["free", "paid", "mock_paid"],
    required: true
    // free      → course price was 0
    // mock_paid → paid via mock payment button
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  progressPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100                 // Recomputed after every lesson completion event
  },
  isCompleted: {
    type: Boolean,
    default: false           // Set to true when progressPercent === 100 AND all quizzes passed
  },
  completedAt: { type: Date },
  timestamps: true
}
```

**Compound index:** `{ student: 1, course: 1 }` unique — a student can only enroll once per course.

---

### 5.9 LessonProgress Model (`models/LessonProgress.js`)

```javascript
{
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  watchedSeconds: {
    type: Number,
    default: 0               // Updated by frontend's watch-time pings
  },
  isCompleted: {
    type: Boolean,
    default: false           // Set to true when watchedSeconds / lesson.duration >= LESSON_COMPLETE_THRESHOLD
  },
  completedAt: { type: Date },
  timestamps: true
}
```

**Compound index:** `{ student: 1, lesson: 1 }` unique

---

### 5.10 QuizAttempt Model (`models/QuizAttempt.js`)

```javascript
{
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  answers: [
    {
      question:      { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      selectedOption: { type: Number, required: true, min: 0, max: 3 },
      isCorrect:     { type: Boolean, required: true }
    }
  ],
  score: {
    type: Number,
    required: true           // Percentage: (correct / total) * 100
  },
  passed: {
    type: Boolean,
    required: true           // score >= quiz.passingScore
  },
  attemptNumber: {
    type: Number,
    required: true           // 1, 2, or 3
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}
```

---

### 5.11 Review Model (`models/Review.js`)

```javascript
{
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
    trim: true
  },
  timestamps: true
}
```

**Compound index:** `{ student: 1, course: 1 }` unique — one review per student per course.  
**Post-save hook:** Recalculate `course.averageRating` and `course.totalReviews` after save and after remove.

---

### 5.12 Certificate Model (`models/Certificate.js`)

```javascript
{
  certificateId: {
    type: String,
    required: true,
    unique: true             // Format: SF-YYYYMM-XXXXXXXX (see utils/generateCertificateId.js)
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  studentName:  { type: String, required: true },  // Snapshot at time of issue
  courseTitle:  { type: String, required: true },  // Snapshot at time of issue
  instructorName: { type: String, required: true },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  verificationUrl: {
    type: String,
    required: true           // Format: ${CLIENT_URL}/verify/${certificateId}
  },
  timestamps: true
}
```

**Compound index:** `{ student: 1, course: 1 }` unique — one certificate per student per course.

---

## 6. AUTHENTICATION & AUTHORIZATION

### 6.1 JWT Strategy

- **Token payload:** `{ id: user._id, role: user.role }`
- **Signed with:** `JWT_SECRET`
- **Expires in:** `JWT_EXPIRES_IN` (1 day)
- **Sent in:** `Authorization: Bearer <token>` header
- **Never stored in a cookie** (stateless API)

### 6.2 Email/Password Registration Flow

```
POST /api/auth/register
  ↓
Validate body (name, email, password, role)
  ↓
Check role is "student" or "instructor" (admin cannot self-register)
  ↓
Check email not already taken
  ↓
Hash password (bcrypt, salt 12)
  ↓
Create User:
  - role = chosen
  - status = "active" if student, "pending" if instructor
  ↓
Return JWT + user object (password excluded)
  ↓
If instructor: frontend shows "Await admin approval" message
```

### 6.3 Email/Password Login Flow

```
POST /api/auth/login
  ↓
Validate body (email, password)
  ↓
Find user by email (include password field: select("+password"))
  ↓
If not found → 401 "Invalid credentials"
  ↓
Compare password (bcrypt.compare)
  ↓
If wrong → 401 "Invalid credentials"
  ↓
If user.status === "banned" → 403 "Account banned"
  ↓
If user.role === "instructor" && user.status === "pending" → 403 "Account pending approval"
  ↓
Generate and return JWT + user object
```

### 6.4 Google OAuth Flow

```
GET /api/auth/google
  → Redirects to Google consent screen

GET /api/auth/google/callback
  → Google calls this with auth code
  ↓
Passport exchanges code for profile
  ↓
Find or create user:
  - If email exists in DB: link googleId to existing account
  - If new: create User with role: "student" (Google users are always students)
  - status: "active"
  ↓
Generate JWT
  ↓
Redirect to: ${CLIENT_URL}/auth/callback?token=<jwt>
  (Frontend extracts token from URL and stores it)
```

**Note:** Google OAuth users cannot be instructors. Only email/password registration allows instructor role selection.

### 6.5 Forgot Password Flow

```
POST /api/auth/forgot-password
  Body: { email }
  ↓
Find user by email (no error if not found — return generic success to prevent email enumeration)
  ↓
Generate reset token: crypto.randomBytes(32).toString("hex")
  ↓
Hash the token and store in user.passwordResetToken (hashed)
Set user.passwordResetExpires = Date.now() + 15 minutes
  ↓
Send email with reset link: ${CLIENT_URL}/reset-password?token=<raw_token>
  ↓
Return: { message: "If that email exists, a reset link has been sent." }

POST /api/auth/reset-password
  Body: { token, newPassword }
  ↓
Hash the provided token
Find user where passwordResetToken === hashedToken AND passwordResetExpires > now
  ↓
If not found → 400 "Invalid or expired token"
  ↓
Set user.password = newPassword (pre-save hook hashes it)
Clear passwordResetToken and passwordResetExpires
Save user
  ↓
Return success + new JWT
```

### 6.6 Auth Middleware Functions

```javascript
// middleware/auth.middleware.js

verifyToken(req, res, next)
  → Reads Authorization header
  → Verifies JWT
  → Attaches decoded payload to req.user
  → Returns 401 if missing or invalid

requireRole(...roles)
  → Returns middleware that checks req.user.role
  → Returns 403 if role not in allowed list
  → Usage: requireRole("admin"), requireRole("instructor", "admin")

requireApprovedInstructor(req, res, next)
  → Verifies req.user.role === "instructor" AND status === "active"
  → Returns 403 if pending or banned

requireEnrolled(req, res, next)
  → Verifies student is enrolled in req.params.courseId
  → Returns 403 if not enrolled
```

---

## 7. MIDDLEWARE STACK

The following middleware is applied in `app.js` in this exact order:

```javascript
// 1. Security headers
app.use(helmet());

// 2. CORS — allow only the frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. Body parsers
app.use(express.json({ limit: "10kb" }));       // Reject bodies > 10kb
app.use(express.urlencoded({ extended: true }));

// 4. NoSQL injection prevention
app.use(mongoSanitize());

// 5. XSS prevention
app.use(xss());

// 6. HTTP parameter pollution prevention
app.use(hpp());

// 7. HTTP request logging (Morgan → Winston)
app.use(morgan("combined", { stream: winstonStream }));

// 8. Global rate limiter (applied to all /api routes)
app.use("/api", globalRateLimiter);

// 9. Swagger docs (no auth)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 10. Routes
app.use("/api", routes);

// 11. 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// 12. Global error handler (must be last)
app.use(errorHandler);
```

---

## 8. API ROUTES — FULL SPECIFICATION

### Response Format — ALL endpoints use this shape:

**Success:**
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Human-readable error",
  "errors": [ ... ]   // Optional: validation error array
}
```

### Auth codes used:
- `200` OK
- `201` Created
- `400` Bad Request (validation failed, business rule violated)
- `401` Unauthorized (missing/invalid token)
- `403` Forbidden (valid token but insufficient permissions)
- `404` Not Found
- `409` Conflict (duplicate resource)
- `429` Too Many Requests
- `500` Internal Server Error

---

### 8.1 AUTH ROUTES — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | None | Register new student or instructor |
| POST | `/login` | None | Login with email + password |
| GET | `/google` | None | Initiate Google OAuth flow |
| GET | `/google/callback` | None | Google OAuth callback |
| POST | `/forgot-password` | None | Send password reset email |
| POST | `/reset-password` | None | Reset password with token |
| GET | `/me` | JWT | Get current logged-in user's profile |
| POST | `/logout` | JWT | Invalidate session (client discards token) |

**POST /register — Request Body:**
```json
{
  "name": "Bilal Ahmed",
  "email": "bilal@example.com",
  "password": "SecurePass@123",
  "role": "student"
}
```
**Validation:** name (2–100 chars), email (valid format), password (min 8 chars, must contain uppercase + number + special char), role (must be "student" or "instructor" — "admin" is rejected with 400).

**POST /login — Request Body:**
```json
{
  "email": "bilal@example.com",
  "password": "SecurePass@123"
}
```

**POST /register & /login — Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "_id": "...",
      "name": "Bilal Ahmed",
      "email": "bilal@example.com",
      "role": "student",
      "status": "active",
      "profilePicture": "",
      "bio": "",
      "phone": "",
      "socialLinks": {},
      "enrolledCourses": [],
      "createdAt": "..."
    }
  }
}
```

---

### 8.2 USER ROUTES — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/profile` | JWT | Get own profile |
| PUT | `/profile` | JWT | Update own profile (name, bio, phone, picture, socials) |
| PUT | `/change-password` | JWT | Change own password (requires current password) |
| GET | `/:id/public` | None | Get public profile of any user (name, bio, picture, courses if instructor) |

**PUT /profile — Request Body (all fields optional):**
```json
{
  "name": "Bilal Ahmed",
  "bio": "AI Engineer in training",
  "phone": "+923001234567",
  "profilePicture": "https://res.cloudinary.com/...",
  "socialLinks": {
    "github": "https://github.com/bilal",
    "linkedin": "https://linkedin.com/in/bilal"
  }
}
```
**Rule:** Users cannot update their own `role` or `status` via this route.

**PUT /change-password — Request Body:**
```json
{
  "currentPassword": "OldPass@123",
  "newPassword": "NewPass@456"
}
```
**Rule:** Returns 400 if `currentPassword` is wrong. Returns 400 if `newPassword` is same as current. Google OAuth users who have no password get a 400 with message "Cannot change password for Google OAuth accounts."

---

### 8.3 COURSE ROUTES — `/api/courses`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | None | List all approved courses (paginated, filterable) |
| GET | `/search` | None | Search courses |
| GET | `/:id` | None | Get single course details |
| GET | `/:id/full` | JWT + Enrolled | Get course with all modules/lessons (enrolled students) |
| POST | `/` | JWT + Approved Instructor | Create new course (status: "draft") |
| PUT | `/:id` | JWT + Course Owner | Update course details |
| DELETE | `/:id` | JWT + Course Owner OR Admin | Delete course |
| POST | `/:id/submit` | JWT + Course Owner | Submit course for admin review (draft → pending) |
| POST | `/:id/resubmit` | JWT + Course Owner | Resubmit after rejection |

**GET / — Query Parameters:**
```
?page=1           (default: 1)
?limit=12         (default: 12, max: 50)
?category=<id>    (filter by category)
?difficulty=beginner|intermediate|advanced
?language=English
?isFree=true|false
?minPrice=0
?maxPrice=100
?sortBy=createdAt|price|averageRating|totalEnrollments
?order=asc|desc
```
**Rule:** Only returns courses with `status: "approved"`.

**GET /search — Query Parameters:**
```
?q=javascript     (full-text search on title, description, tags)
?category=<id>
?difficulty=...
```
**Rule:** Uses MongoDB text index. Only returns `status: "approved"` courses.

**GET /:id — Response includes:**
```json
{
  "course": {
    "_id": "...",
    "title": "...",
    "description": "...",
    "price": 29.99,
    "isFree": false,
    "difficulty": "beginner",
    "language": "English",
    "tags": ["javascript", "react"],
    "prerequisites": ["Basic HTML knowledge"],
    "whatYouWillLearn": ["Build React apps", "Understand hooks"],
    "totalDuration": 18000,
    "totalLessons": 24,
    "totalEnrollments": 150,
    "averageRating": 4.5,
    "totalReviews": 38,
    "thumbnail": "https://res.cloudinary.com/...",
    "instructor": { "_id": "...", "name": "...", "profilePicture": "..." },
    "category": { "_id": "...", "name": "..." },
    "modules": [
      {
        "_id": "...",
        "title": "Module 1: Intro",
        "order": 1,
        "lessons": [
          {
            "_id": "...",
            "title": "Welcome",
            "duration": 300,
            "isFreePreview": true
            // videoUrl NOT included unless enrolled
          }
        ]
      }
    ]
  }
}
```
**Rule:** `videoUrl` for lessons is only included if: the lesson has `isFreePreview: true` OR the requesting user is enrolled OR the requesting user is the instructor/admin.

**POST / — Request Body:**
```json
{
  "title": "Complete React Course",
  "description": "Learn React 19 from scratch...",
  "category": "<categoryId>",
  "thumbnail": "https://res.cloudinary.com/...",
  "price": 29.99,
  "difficulty": "beginner",
  "language": "English",
  "tags": ["react", "javascript"],
  "prerequisites": ["HTML basics"],
  "whatYouWillLearn": ["Build apps", "Understand state"]
}
```
**Rule:** `instructor` is set from `req.user._id` — not from request body.  
**Rule:** Course is created with `status: "draft"`. Invisible until submitted and approved.

---

### 8.4 MODULE ROUTES — `/api/courses/:courseId/modules`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | JWT + Enrolled OR Owner/Admin | List all modules in a course |
| POST | `/` | JWT + Course Owner | Create new module |
| PUT | `/:moduleId` | JWT + Course Owner | Update module title/description |
| DELETE | `/:moduleId` | JWT + Course Owner | Delete module (cascades: deletes its lessons and quiz) |
| PATCH | `/reorder` | JWT + Course Owner | Reorder modules |

**POST / — Request Body:**
```json
{
  "title": "Module 1: Getting Started",
  "description": "Introduction to the course",
  "order": 1
}
```
**Rule:** If `order` conflicts with an existing module, all subsequent modules' `order` values are shifted up by 1.

**PATCH /reorder — Request Body:**
```json
{
  "order": [
    { "moduleId": "<id>", "order": 1 },
    { "moduleId": "<id>", "order": 2 }
  ]
}
```

---

### 8.5 LESSON ROUTES — `/api/courses/:courseId/modules/:moduleId/lessons`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | JWT + Enrolled OR Owner/Admin | List all lessons in module |
| POST | `/` | JWT + Course Owner | Create new lesson |
| PUT | `/:lessonId` | JWT + Course Owner | Update lesson |
| DELETE | `/:lessonId` | JWT + Course Owner | Delete lesson |
| PATCH | `/reorder` | JWT + Course Owner | Reorder lessons within module |
| GET | `/:lessonId/watch` | JWT + Enrolled OR Free Preview | Access video URL of lesson |

**POST / — Request Body:**
```json
{
  "title": "Introduction to React",
  "description": "In this lesson we cover...",
  "videoUrl": "https://www.youtube.com/watch?v=...",
  "duration": 720,
  "order": 1,
  "isFreePreview": false,
  "attachments": [
    { "name": "Starter Code.zip", "url": "https://res.cloudinary.com/..." }
  ]
}
```

**GET /:lessonId/watch — Business Logic:**
1. If `lesson.isFreePreview === true` → return `videoUrl` to anyone (no auth required).
2. If user is enrolled in the course → check lesson order:
   - Find all lessons in this module with `order < this lesson's order`
   - For each, check `LessonProgress` — all must have `isCompleted: true`
   - If any previous lesson is not complete → return 403 "Complete previous lessons first"
   - If all previous complete → return `videoUrl`
3. If user is the course instructor or admin → return `videoUrl` always.
4. Otherwise → 403 "Enroll in this course to access this lesson"

---

### 8.6 QUIZ ROUTES — `/api/courses/:courseId/modules/:moduleId/quiz`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | JWT + Enrolled OR Owner/Admin | Get quiz with questions (no correct answers for students) |
| POST | `/` | JWT + Course Owner | Create quiz for this module |
| PUT | `/` | JWT + Course Owner | Update quiz settings |
| DELETE | `/` | JWT + Course Owner | Delete quiz |
| POST | `/questions` | JWT + Course Owner | Add a question |
| PUT | `/questions/:questionId` | JWT + Course Owner | Update a question |
| DELETE | `/questions/:questionId` | JWT + Course Owner | Delete a question |
| POST | `/submit` | JWT + Enrolled Student | Submit quiz answers |
| GET | `/attempts` | JWT + Enrolled Student | Get own attempt history for this quiz |
| GET | `/result/:attemptId` | JWT + Enrolled Student | Get detailed result of one attempt |

**POST /submit — Request Body:**
```json
{
  "answers": [
    { "questionId": "<id>", "selectedOption": 2 },
    { "questionId": "<id>", "selectedOption": 0 }
  ]
}
```

**POST /submit — Business Logic:**
1. Verify student is enrolled in the course.
2. Check all lessons in this module are complete — if not, return 403 "Complete all lessons before taking the quiz."
3. Count existing attempts: `QuizAttempt.countDocuments({ student, quiz })`.
4. If `attemptCount >= quiz.maxAttempts` → return 403 "Maximum attempts reached."
5. If student previously failed: check latest attempt's `submittedAt`. If `Date.now() - latestAttempt.submittedAt < quiz.retryWaitHours * 3600000` → return 403 "You must wait X hours before retrying."
6. Score the answers: for each answer, compare `selectedOption` to `question.correctOption`.
7. Score = `(correctCount / totalQuestions) * 100`
8. `passed = score >= quiz.passingScore`
9. Create `QuizAttempt` record.
10. If passed: check if course is now fully complete (see Section 9.2).
11. Return detailed result including which answers were correct, explanations, score, pass/fail.

**GET / (for students) — Response omits `question.correctOption`.**

---

### 8.7 ENROLLMENT ROUTES — `/api/enrollments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | JWT + Student | Enroll in a course |
| GET | `/my` | JWT + Student | List own enrollments |
| GET | `/check/:courseId` | JWT | Check if enrolled in a specific course |
| DELETE | `/:courseId` | JWT + Student | Unenroll from a course |

**POST / — Request Body:**
```json
{
  "courseId": "<id>",
  "paymentMethod": "free" | "mock"
}
```

**POST / — Business Logic:**
1. Confirm course `status === "approved"`.
2. Confirm student is not already enrolled (409 Conflict if so).
3. If `course.isFree` → set `paymentStatus: "free"`, `amountPaid: 0`.
4. If `!course.isFree` → verify `paymentMethod === "mock"` → set `paymentStatus: "mock_paid"`, `amountPaid: course.price`.
5. Create `Enrollment` record.
6. Add `courseId` to `user.enrolledCourses`.
7. Increment `course.totalEnrollments`.
8. Return enrollment details.

---

### 8.8 PROGRESS ROUTES — `/api/progress`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/ping` | JWT + Enrolled | Report watch time for a lesson |
| GET | `/course/:courseId` | JWT + Enrolled | Get full progress for a course |

**POST /ping — Request Body:**
```json
{
  "lessonId": "<id>",
  "courseId": "<id>",
  "watchedSeconds": 432
}
```

**POST /ping — Business Logic:**
1. Verify student is enrolled.
2. Upsert `LessonProgress` for `{ student, lesson }`:
   - Update `watchedSeconds` only if new value > existing (prevents rollback).
3. Fetch lesson duration from `Lesson` model.
4. If `watchedSeconds / lesson.duration >= LESSON_COMPLETE_THRESHOLD` AND `!lessonProgress.isCompleted`:
   - Set `isCompleted: true`, `completedAt: Date.now()`.
   - Add lesson to `enrollment.completedLessons` (if not already present).
   - Recompute `enrollment.progressPercent = (completedLessons.length / course.totalLessons) * 100`.
   - Save enrollment.
5. Return `{ isCompleted, progressPercent }`.

---

### 8.9 REVIEW ROUTES — `/api/courses/:courseId/reviews`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | None | Get all reviews for a course (paginated) |
| POST | `/` | JWT + Enrolled Student | Create a review |
| PUT | `/:reviewId` | JWT + Review Owner | Update own review |
| DELETE | `/:reviewId` | JWT + Review Owner OR Admin | Delete review |

**POST / — Request Body:**
```json
{
  "rating": 5,
  "comment": "This course was excellent and very detailed."
}
```
**Rule:** Student must be enrolled. One review per student per course (409 if duplicate). After save, recalculate `course.averageRating` and `course.totalReviews`.

---

### 8.10 CERTIFICATE ROUTES — `/api/certificates`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/my` | JWT + Student | Get all own certificates |
| POST | `/claim/:courseId` | JWT + Student | Claim certificate for completed course |
| GET | `/verify/:certificateId` | None | Public verification endpoint |

**POST /claim/:courseId — Business Logic:**
1. Verify student is enrolled in the course.
2. Verify `enrollment.isCompleted === true`.
   - If not → 400 "You have not completed this course yet."
3. Check if certificate already exists for `{ student, course }` → 409 if so.
4. Generate unique `certificateId` via `generateCertificateId()`: format `SF-YYYYMM-<8 random alphanumeric uppercase chars>` e.g. `SF-202504-A3B7K2PQ`.
5. Snapshot: fetch `user.name`, `course.title`, `instructor.name`.
6. Create `Certificate` record.
7. Set `verificationUrl = ${CLIENT_URL}/verify/${certificateId}`.
8. Return certificate data.

**GET /verify/:certificateId — Response:**
```json
{
  "success": true,
  "data": {
    "certificateId": "SF-202504-A3B7K2PQ",
    "studentName": "Bilal Ahmed",
    "courseTitle": "Complete React Course",
    "instructorName": "Jane Doe",
    "issuedAt": "2025-04-20T10:30:00.000Z",
    "verificationUrl": "http://localhost:5173/verify/SF-202504-A3B7K2PQ"
  }
}
```
**Note:** This route is public (no JWT required) so anyone can verify authenticity.

---

### 8.11 ADMIN ROUTES — `/api/admin`

All routes: JWT + `role: "admin"` required.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List all users (paginated, filterable) |
| GET | `/users/:id` | Get single user details |
| PATCH | `/users/:id/status` | Set user status (active/banned) |
| DELETE | `/users/:id` | Permanently delete user account |
| GET | `/instructors/pending` | List all pending instructor registrations |
| PATCH | `/instructors/:id/approve` | Approve instructor |
| PATCH | `/instructors/:id/reject` | Reject instructor (status → banned) |
| GET | `/courses/pending` | List all courses pending review |
| PATCH | `/courses/:id/approve` | Approve course (pending → approved) |
| PATCH | `/courses/:id/reject` | Reject course with reason |
| GET | `/courses` | List all courses with any status |
| GET | `/analytics` | Platform-wide analytics |

**GET /users — Query Parameters:**
```
?role=student|instructor|admin
?status=active|pending|banned
?page=1
?limit=20
?search=bilal   (searches name and email)
```

**PATCH /users/:id/status — Request Body:**
```json
{ "status": "banned" }
```
**Rule:** Cannot change admin's status. Cannot ban yourself.

**PATCH /courses/:id/reject — Request Body:**
```json
{ "reason": "Course description is too short and thumbnail is low quality." }
```
**Rule:** Sets `course.status = "rejected"`, `course.rejectionReason = reason`. Instructor can then edit and resubmit.

---

### 8.12 CATEGORY ROUTES — `/api/categories`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | None | List all categories |
| POST | `/` | JWT + Admin | Create category |
| PUT | `/:id` | JWT + Admin | Update category |
| DELETE | `/:id` | JWT + Admin | Delete category (blocked if courses exist in it) |

---

### 8.13 ANALYTICS ROUTES — `/api/admin/analytics`

Auth: JWT + Admin

**GET /analytics — Response:**
```json
{
  "totalUsers": 500,
  "totalStudents": 450,
  "totalInstructors": 48,
  "totalPendingInstructors": 2,
  "totalCourses": 30,
  "totalApprovedCourses": 25,
  "totalPendingCourses": 3,
  "totalEnrollments": 1200,
  "totalRevenue": 15400.50,
  "totalCertificatesIssued": 180,
  "recentEnrollments": [
    { "course": "...", "student": "...", "createdAt": "..." }
  ],
  "topCourses": [
    { "title": "...", "totalEnrollments": 200, "averageRating": 4.8 }
  ]
}
```

---

## 9. BUSINESS LOGIC RULES

### 9.1 Course Lifecycle State Machine

```
draft ──[instructor submits]──► pending ──[admin approves]──► approved
  ▲                                │
  │                     [admin rejects]
  └─────────────────────────────── rejected
         (instructor edits and resubmits → pending again)
```

- Instructors can edit a course only in `draft` or `rejected` state.
- Instructors cannot edit a `pending` or `approved` course.
- Deleting a `pending` or `approved` course requires admin privileges.
- Deleting a course cascades: delete all its modules, lessons, quizzes, questions, enrollments, lesson progress records, quiz attempts, reviews, and certificates.

### 9.2 Course Completion Logic

A course is marked complete (`enrollment.isCompleted = true`) when ALL of the following are true:
1. `enrollment.progressPercent === 100` (all lessons watched past threshold).
2. Every module that has `hasQuiz: true` has a `QuizAttempt` with `passed: true` for this student.

This check runs after every `/progress/ping` and every `/quiz/submit`.

### 9.3 Instructor Access Rules

| Condition | Can Create Course? | Can Publish (Submit)? |
|-----------|-------------------|----------------------|
| `role: student` | No | No |
| `role: instructor, status: pending` | No | No |
| `role: instructor, status: active` | Yes | Yes |
| `role: instructor, status: banned` | No | No |

### 9.4 Lesson Access Rules

| User Type | Conditions | Access |
|-----------|------------|--------|
| Not logged in | Lesson is free preview | Video URL returned |
| Not logged in | Lesson is not free preview | 401 |
| Student | Not enrolled | 403 |
| Student | Enrolled, lesson order > 1, previous lessons incomplete | 403 |
| Student | Enrolled, all previous lessons complete | Video URL returned |
| Instructor/Admin | Any lesson in their course | Video URL always returned |

### 9.5 Quiz Rules

- A quiz can only be created for a module that exists and belongs to an approved instructor's course.
- Students cannot access quiz questions unless all lessons in that module are complete.
- Attempt 1 fails → student must wait `quiz.retryWaitHours` hours.
- Attempt 2 fails → student must wait `quiz.retryWaitHours` hours again.
- Attempt 3 fails → quiz is permanently locked for that student.
- Passing a quiz on any attempt counts. Once passed, no further attempts are allowed.
- The score returned after submission includes: total questions, correct count, percentage, per-question breakdown with the correct answer and explanation.

### 9.6 Review Rules

- Only enrolled students can leave reviews.
- One review per student per course — attempting a second returns 409.
- Updating a review recalculates course average rating.
- Deleting a review recalculates course average rating.
- Rating recalculation formula: `averageRating = sum(all ratings) / count(all ratings)`, rounded to 1 decimal place.

### 9.7 Certificate Rules

- Cannot claim certificate unless `enrollment.isCompleted === true`.
- Cannot claim twice — returns existing certificate if already issued.
- `studentName`, `courseTitle`, `instructorName` are snapshots (stored as strings, not references) so certificate remains valid even if user changes their name later.

---

## 10. ERROR HANDLING

### 10.1 Custom Error Class (`utils/ApiError.js`)

```javascript
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
  }
}
```

### 10.2 Global Error Handler (`middleware/error.middleware.js`)

Handles these error types:
- `ApiError` (our custom class) → use `err.statusCode` and `err.message`
- `ValidationError` (Mongoose) → 400 with field-by-field errors
- `CastError` (Mongoose — invalid ObjectId) → 404 "Resource not found"
- `MongoServerError code 11000` (Mongoose duplicate key) → 409 "Already exists"
- `JsonWebTokenError` → 401 "Invalid token"
- `TokenExpiredError` → 401 "Token expired, please log in again"
- All other errors → 500 "Internal server error" (in production, hide stack trace)

**In development:** Include `stack` in error response.  
**In production:** Never expose stack trace.

### 10.3 Async Error Wrapper

All controllers use an `asyncHandler` wrapper to eliminate try/catch repetition:

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

---

## 11. RATE LIMITING

### Global Limiter (all `/api` routes)
- Window: 15 minutes
- Max: 100 requests per IP
- Message: "Too many requests. Please try again after 15 minutes."

### Auth Route Limiter (applied to `/api/auth`)
- Window: 15 minutes
- Max: 10 requests per IP
- Message: "Too many authentication attempts. Please wait before trying again."

### Password Reset Limiter (applied to `/api/auth/forgot-password`)
- Window: 1 hour
- Max: 3 requests per IP
- Message: "Too many password reset requests."

All limiters use `express-rate-limit`. On limit exceeded: HTTP 429.

---

## 12. INPUT VALIDATION RULES

All validation uses Joi schemas in `/validators/`. The middleware in `validate.middleware.js` runs the schema and returns 400 with an `errors` array on failure.

### Register
```
name:     string, min 2, max 100, required
email:    string, email format, required
password: string, min 8, pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, required
role:     string, valid values: ["student", "instructor"], required
```

### Login
```
email:    string, email format, required
password: string, required
```

### Create Course
```
title:              string, min 5, max 150, required
description:        string, min 20, max 5000, required
category:           string (valid ObjectId), required
thumbnail:          string (URL format), required
price:              number, min 0, required
difficulty:         string, one of ["beginner","intermediate","advanced"], required
language:           string, optional, default "English"
tags:               array of strings, optional
prerequisites:      array of strings, optional
whatYouWillLearn:   array of strings, min 1 item, required
```

### Create Module
```
title:   string, min 3, max 150, required
order:   number, min 1, required
description: string, optional
```

### Create Lesson
```
title:         string, min 3, max 150, required
videoUrl:      string, URI format, required
duration:      number, min 1, required (seconds)
order:         number, min 1, required
description:   string, optional
isFreePreview: boolean, optional, default false
attachments:   array of { name: string required, url: string URI required }, optional
```

### Create Quiz
```
title:        string, required
passingScore: number, min 1, max 100, required
```

### Add Question
```
text:          string, min 5, required
options:       array of exactly 4 objects { label: string, text: string }, required
correctOption: number, min 0, max 3, required
explanation:   string, optional
order:         number, min 1, required
```

### Submit Quiz
```
answers: array of { questionId: ObjectId, selectedOption: number 0-3 }, required
         array length must equal total questions in quiz
```

### Create Review
```
rating:  number, min 1, max 5, integer, required
comment: string, min 10, max 1000, required
```

### Update Profile
```
name:           string, min 2, max 100, optional
bio:            string, max 500, optional
phone:          string, optional
profilePicture: string, URI, optional
socialLinks:    object with optional string fields: website, linkedin, twitter, github
```

---

## 13. DATABASE SEEDER SPECIFICATION

Run with: `node seed/seed.js`  
Connects to MongoDB, clears all collections, then seeds in order.

### 13.1 Seed Order (must follow this sequence due to dependencies)

1. Categories (no dependencies)
2. Users: 1 admin, 5 instructors (all approved), 20 students
3. Courses: 2 per instructor = 10 courses total (all approved)
4. Modules: 3 per course = 30 modules
5. Lessons: 4 per module = 120 lessons
6. Quizzes: 1 per module = 30 quizzes, each with 5 questions
7. Enrollments: each student enrolled in 3 random courses
8. Lesson Progress: 50% of lessons marked complete for each enrollment
9. Quiz Attempts: one passing attempt for modules where all lessons are complete

### 13.2 Seeded Accounts (deterministic — always the same)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@skillforge.com` | `Admin@123456` |
| Instructor 1 | `instructor1@skillforge.com` | `Test@123456` |
| Instructor 2 | `instructor2@skillforge.com` | `Test@123456` |
| Student 1 | `student1@skillforge.com` | `Test@123456` |
| Student 2 | `student2@skillforge.com` | `Test@123456` |
| (students 3–20 follow same pattern) | | |

### 13.3 Seed Data Specs

**Categories (8 total):**  
Web Development, Data Science, AI & Machine Learning, Mobile Development, Cybersecurity, UI/UX Design, Cloud Computing, Digital Marketing

**Courses per instructor:**  
Uses Faker.js for title, description, tags. One free course (`price: 0`) and one paid course (`price: random 9.99–99.99`).

**Lessons:**  
Video URL = a real YouTube embed URL (use a public video). Duration = random 300–1800 seconds. First lesson of each module is `isFreePreview: true`.

**Quiz questions:**  
Pre-written MCQs relevant to the course category (not random gibberish — use a small bank of real questions per category).

---

## 14. SECURITY CONFIGURATION

### 14.1 Password Hashing
- bcryptjs, salt rounds: 12
- Never log, return, or expose hashed passwords

### 14.2 JWT
- Secret: min 32 characters, stored in env
- Expiry: 1 day
- Payload: minimal (`{ id, role }`)
- Never store sensitive data in JWT payload

### 14.3 HTTP Headers (Helmet defaults)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (production)
- `Content-Security-Policy`

### 14.4 CORS
- Allowed origin: `CLIENT_URL` only (not `*`)
- Credentials: true
- Methods: GET, POST, PUT, PATCH, DELETE

### 14.5 NoSQL Injection
- `express-mongo-sanitize` strips `$` and `.` from request body, query, params

### 14.6 XSS
- `xss-clean` sanitizes user input across all request fields

### 14.7 HTTP Parameter Pollution
- `hpp` removes duplicate query string parameters

### 14.8 Body Size Limit
- `express.json({ limit: "10kb" })` — rejects payloads larger than 10KB

### 14.9 Environment Validation
- On startup, validate all required env vars are present using a startup check. If any are missing, log the missing keys and `process.exit(1)`.

---

## 15. LOGGING

### 15.1 Winston Logger (`utils/logger.js`)

Two transports:
1. **Console** (dev only): colorized, includes timestamp
2. **File — error.log**: only `error` level, persistent
3. **File — combined.log**: all levels (`info`, `warn`, `error`), persistent

Log format: `{ timestamp, level, message, stack (if error) }`

Log rotation: not required for v1, but files should be in `/logs/` which is gitignored.

### 15.2 Morgan HTTP Logging
- Format: `"combined"` in production, `"dev"` in development
- Output piped to Winston info stream

### 15.3 What to Log

| Event | Level |
|-------|-------|
| Server started on port X | info |
| MongoDB connected | info |
| MongoDB connection failed | error |
| Request to route | info (via Morgan) |
| Validation error | warn |
| Auth failure (wrong password, expired token) | warn |
| Resource not found | warn |
| Unhandled error caught by global handler | error |
| Email sent successfully | info |
| Email send failed | error |

---

## 16. SWAGGER / API DOCUMENTATION

### Setup (`config/swagger.js`)
```javascript
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SkillForge API",
      version: "1.0.0",
      description: "REST API for SkillForge Learning Management System"
    },
    servers: [
      { url: "http://localhost:5000/api", description: "Development" },
      { url: "https://skillforge-api.render.com/api", description: "Production" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./routes/*.js"]  // JSDoc comments in route files are parsed
};
```

Served at: `GET /api-docs` (no auth required).

---

## 17. DEPLOYMENT NOTES

### 17.1 Target Platform: Render (free tier)

1. Push backend code to a GitHub repository.
2. Create a new **Web Service** on Render pointing to the repo.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add all environment variables from `.env` into Render's Environment section.
6. MongoDB Atlas: whitelist `0.0.0.0/0` in Network Access to allow Render's dynamic IPs.

### 17.2 Production Environment Changes
- `NODE_ENV=production`
- `CLIENT_URL` = deployed frontend URL (e.g., Vercel URL)
- `GOOGLE_CALLBACK_URL` = `https://your-render-url.onrender.com/api/auth/google/callback`
- Error responses must not include stack traces.
- Morgan logs in `"combined"` format.

### 17.3 server.js Entry Point

```javascript
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

### 17.4 CORS in Production
- Update `CLIENT_URL` to Vercel/Netlify frontend URL.
- Do not use wildcard `*` in production CORS.

### 17.5 .gitignore must include:
```
node_modules/
.env
logs/
```

---

## APPENDIX A — Quick Reference: Who Can Do What

| Action | Student | Pending Instructor | Approved Instructor | Admin |
|--------|---------|--------------------|---------------------|-------|
| Browse approved courses | ✅ | ✅ | ✅ | ✅ |
| Enroll in course | ✅ | ❌ | ❌ | ❌ |
| Watch free preview | ✅ | ✅ | ✅ | ✅ |
| Watch enrolled lesson | ✅ (ordered) | ❌ | ❌ | ✅ |
| Leave review | ✅ (enrolled) | ❌ | ❌ | ❌ |
| Take quiz | ✅ (enrolled + lessons done) | ❌ | ❌ | ❌ |
| Claim certificate | ✅ (course complete) | ❌ | ❌ | ❌ |
| Create course | ❌ | ❌ | ✅ | ❌ |
| Submit course for review | ❌ | ❌ | ✅ | ❌ |
| Edit own course | ❌ | ❌ | ✅ (draft/rejected only) | ✅ |
| Approve/reject course | ❌ | ❌ | ❌ | ✅ |
| Approve/reject instructor | ❌ | ❌ | ❌ | ✅ |
| Ban user | ❌ | ❌ | ❌ | ✅ |
| View analytics | ❌ | ❌ | ❌ | ✅ |
| Manage categories | ❌ | ❌ | ❌ | ✅ |

---

## APPENDIX B — API Base URLs Summary

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:5000/api` |
| Production | `https://your-app.onrender.com/api` |
| Swagger Docs | `http://localhost:5000/api-docs` |

---

*SkillForge Backend Specification v2.0 — Complete and Build-Ready*
*Any AI or developer reading this document has everything needed to build the full backend correctly on the first attempt.*
