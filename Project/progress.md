# SkillForge LMS — Project Progress Tracker
> Last Updated: 2026-05-16

---

## ✅ Backend (skill-forge-backend)

### Status: **COMPLETE & READY TO RUN**

| Component | Status | Notes |
|---|---|---|
| Project scaffold (Express + Mongoose) | ✅ Done | MVC structure |
| Environment config (`.env`) | ✅ Done | MongoDB Atlas connected |
| Database connection | ✅ Done | `/config/db.js` |
| Error handling (ApiError + asyncHandler) | ✅ Done | Centralized error middleware |
| ApiResponse helper | ✅ Done | Consistent `{ status, message, data }` shape |
| Security middleware | ✅ Done | helmet, xss-clean, hpp, mongo-sanitize, rate-limit |
| JWT Authentication | ✅ Done | Passport.js + generateToken util |
| Google OAuth 2.0 | ✅ Done | Requires `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` |
| Joi input validation | ✅ Done | Auth routes validated |

### Models (12 total)

| Model | Status |
|---|---|
| User | ✅ Done — `bcryptjs` hashing, status/role, bio/expertise |
| Category | ✅ Done — slug, icon |
| Course | ✅ Done — status machine (draft→pending→approved/rejected), denormalized counters |
| Module | ✅ Done — order management, cascade delete |
| Lesson | ✅ Done — videoUrl, duration, isFreePreview, attachments |
| Quiz | ✅ Done — passingScore, maxAttempts, waitHours |
| Question | ✅ Done — options array, correctOption |
| Enrollment | ✅ Done — progressPercent, isCompleted |
| LessonProgress | ✅ Done — watchedSeconds, 80% threshold auto-complete |
| QuizAttempt | ✅ Done — score, answers, passed, wait-period logic |
| Review | ✅ Done — auto-recalculates course averageRating via hook |
| Certificate | ✅ Done — idempotent, public verification UUID |

### Controllers (12 total)

| Controller | Key Endpoints |
|---|---|
| auth.controller | POST /register, /login, /forgot-password, /reset-password, GET /me |
| user.controller | GET /me, PUT /me, PATCH /me/password |
| category.controller | CRUD categories (admin protected) |
| course.controller | GET /courses, /courses/my (instructor), /courses/search, GET+PUT+DELETE /courses/:id, POST /courses/:id/submit |
| module.controller | CRUD /courses/:id/modules (order-shifted on create) |
| lesson.controller | CRUD /modules/:id/lessons, GET /lessons/:id/watch (progress-gated) |
| quiz.controller | GET+POST /modules/:id/quiz, POST /quiz/submit (scoring + completion trigger) |
| enrollment.controller | POST /enrollments, GET /enrollments/my, DELETE /enrollments/:courseId |
| progress.controller | POST /progress/ping, GET /progress/course/:id |
| review.controller | GET+POST /courses/:id/reviews |
| certificate.controller | POST /certificates/claim, GET /verify/:id |
| admin.controller | Analytics, user management, instructor approvals, course moderation |

### Routes (all wired in `/routes/index.js`)
All routes mounted under `/api`.

---

## ✅ Frontend (skill-forge-frontend)

### Context Layer

| File | Status | What Changed |
|---|---|---|
| `AuthContext.jsx` | ✅ Fixed | Unwraps `res.data.data.{token,user}`, added `loginWithToken()` for OAuth |
| `EnrollmentContext.jsx` | ✅ Fixed | Correct route `/enrollments/my`, proper field names `progressPercent`/`isCompleted`, added `pingProgress()` and `checkEnrollment()`, removed mock data fallback |

### Pages Fixed

| Page | Status | Issues Resolved |
|---|---|---|
| `public/CourseDetail.jsx` | ✅ Fixed | Single API call `/courses/:id` (modules embedded), correct field names (`category.name`, `module.title`, `lesson.title`, `isFreePreview`), real rating/enrollment counts, correct enroll payload |
| `student/StudentDashboard.jsx` | ✅ Fixed | Correct field names `progressPercent` and `isCompleted`, correct `totalDuration` calculation |
| `student/CoursePlayer.jsx` | ✅ Rewritten | Uses `/courses/:id/full`, `/lessons/:id/watch`, `pingProgress()` every 10s, lesson lock logic, auto-advance on completion |
| `student/QuizPage.jsx` | ✅ Fixed | Now uses nested quiz routes `/modules/:id/quiz` + `/quiz/submit`, correct `selectedOption` field |
| `instructor/InstructorDashboard.jsx` | ✅ Fixed | Uses `/courses/my` endpoint (all statuses), removed multi-request hack, no mock data |
| `admin/AdminDashboard.jsx` | ✅ Fixed | Uses `/admin/analytics`, shows real top courses + recent enrollments |
| `admin/UserManagement.jsx` | ✅ Fixed | Correct response unwrap `.data.data.users`, correct `PATCH /admin/users/:id/status` |
| `admin/InstructorApproval.jsx` | ✅ Fixed | Uses `/admin/instructors/pending`, `PATCH /approve` + `PATCH /reject`, maps User objects to display |
| `admin/CourseModeration.jsx` | ✅ Fixed | Uses `/admin/courses`, correct field names, added Approve/Reject buttons, deleted mock data |

### Pages (No Changes Needed)

- `public/Home.jsx` — Static + course listing ✅
- `public/Login.jsx`, `Register.jsx` — Auth forms ✅
- `public/AuthCallback.jsx` — Google OAuth callback ✅
- `student/CertificatePage.jsx` — Certificate claim ✅
- `admin/AdminProfile.jsx` — Profile management ✅

### New Backend Route Added
- `GET /api/courses/my` — Returns all courses belonging to the authenticated instructor (all statuses), declared before `/:id` to avoid route conflict.

---

## 🚀 How to Start the Project

### 1. Backend
```bash
cd "e:\Bilal\1.University\5th Sem\1. Web Technologies\Skill foirge\Project\skill-forge-backend"
npm install            # First time only
npm run seed           # First time only (populates DB with test data)
npm run dev            # Starts on http://localhost:5000
```

### 2. Frontend
```bash
cd "e:\Bilal\1.University\5th Sem\1. Web Technologies\Skill foirge\Project\skill-forge-frontend"
npm install            # First time only
npm run dev            # Starts on http://localhost:5173
```

---

## 🔑 Test Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@skillforge.com` | `Admin@123456` |
| Instructor | `instructor1@skillforge.com` | `Instructor@123456` |
| Student | `student1@skillforge.com` | `Student@123456` |

---

## ⚠️ Remaining Placeholders in `.env`

| Variable | Purpose | How to Get |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth login | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth login | Google Cloud Console |
| `EMAIL_USER` | Forgot-password emails | Gmail or SMTP provider |
| `EMAIL_PASS` | Forgot-password emails | Gmail App Password |

Google OAuth and email reset are **non-blocking** — all other features work without them.

---

## 🐛 Known Issues / Bugs Fixed

| Bug | Fix Applied |
|---|---|
| `EnrollmentContext` used `course_id` instead of `courseId` | ✅ Fixed |
| `EnrollmentContext` used wrong route `/enrollments/me` | ✅ Fixed → `/enrollments/my` |
| `StudentDashboard` used `enrollment.progress` / `enrollment.completed` | ✅ Fixed → `progressPercent` / `isCompleted` |
| `CoursePlayer` used old mock structure, wrong watch endpoint | ✅ Rewritten |
| `QuizPage` called nonexistent `/quizzes/:courseId` route | ✅ Fixed → nested module quiz routes |
| `InstructorDashboard` imported from `@/data` mock | ✅ Removed |
| `AdminDashboard` called `/admin/stats` (doesn't exist) | ✅ Fixed → `/admin/analytics` |
| `UserManagement` used wrong `/ban` and `/role` PUT endpoints | ✅ Fixed → `PATCH /status` |
| `InstructorApproval` called nonexistent `/admin/instructor-applications` | ✅ Fixed → `/admin/instructors/pending` |
| `CourseModeration` used `enrollments` (wrong) / `rating` (wrong) field names | ✅ Fixed → `totalEnrollments` / `averageRating` |
| `CourseDetail` made duplicate API calls for modules | ✅ Fixed → modules embedded in `/courses/:id` response |
| No instructor endpoint to list own courses by all statuses | ✅ Added `GET /courses/my` |
| `CourseModeration` had no Approve/Reject buttons | ✅ Added |

---

## 📁 Project Structure

```
Project/
├── skill-forge-backend/
│   ├── config/          — db.js, passport.js, swagger.js
│   ├── controllers/     — 12 controllers
│   ├── middleware/       — auth, error, rate-limit, validation
│   ├── models/          — 12 Mongoose models
│   ├── routes/          — nested RESTful routes
│   ├── seed/            — seed.js (populates test data)
│   ├── utils/           — ApiError, ApiResponse, asyncHandler, generateToken
│   ├── .env             — environment variables
│   ├── app.js           — Express app setup
│   └── server.js        — entry point
│
└── skill-forge-frontend/
    ├── src/
    │   ├── api/         — axios instance
    │   ├── context/     — AuthContext, EnrollmentContext, ThemeContext
    │   ├── components/  — shared UI components
    │   ├── pages/
    │   │   ├── public/  — Home, Courses, CourseDetail, Login, Register
    │   │   ├── student/ — Dashboard, CoursePlayer, Quiz, Certificate
    │   │   ├── instructor/ — Dashboard, CourseEditor
    │   │   └── admin/   — Dashboard, Users, Instructors, Courses
    │   └── App.jsx
    └── .env.local       — VITE_API_URL=http://localhost:5000/api
```
