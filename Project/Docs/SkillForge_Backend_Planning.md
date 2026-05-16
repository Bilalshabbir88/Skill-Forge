# SkillForge — Backend Planning Document
> Prepared for: Bilal | Project: SkillForge LMS Backend (Rebuild from Scratch)

---

## 1. Database & Hosting

| # | Question | Answer |
|---|----------|--------|
| 1 | MongoDB setup | **Not yet configured.** No local MongoDB or Atlas connection exists. A new MongoDB Atlas free-tier cluster needs to be set up, and a `.env` connection string will be provided after setup. |
| 2 | Database seeder | **Yes.** A seeder script is required that auto-populates the database with fake users (students, instructors, admin), courses, modules, lessons, quizzes, and enrollments for immediate testing. |

---

## 2. Users & Authentication

| # | Question | Answer |
|---|----------|--------|
| 3 | Default role on registration | **User chooses their role.** During registration, the user selects whether they are signing up as a `student` or `instructor`. Admin accounts are created manually — they cannot be self-registered. |
| 4 | Instructor approval | **Yes — Admin approval required.** After an instructor registers, their account is placed in a `pending` state. They cannot create or publish courses until an admin explicitly approves their account. |
| 5 | User profile fields | **Extended profile.** Fields to store: `name`, `email`, `password (hashed)`, `role`, `profile picture`, `bio`, `phone number`, `social links`. |
| 6 | Authentication method | **Google OAuth.** Users can sign in / register using their Google account. Email + password login is also supported as a fallback. |
| 7 | JWT expiry | **1 day (24 hours).** Tokens expire after 24 hours; users must re-authenticate after expiry. |
| 8 | Forgot password / reset | **Yes.** A password reset flow via email is required — user enters their email, receives a reset link, and can set a new password through that link. |

---

## 3. Courses

| # | Question | Answer |
|---|----------|--------|
| 9 | Who can create a course | **Only admin-approved instructors.** A `pending` instructor cannot create courses. Once their account is approved by the admin, course creation is unlocked. |
| 10 | Course fields | **All fields — required + optional.** Required: `title`, `description`, `price`, `category`, `thumbnail`, `instructor`. Optional: `difficulty level` (beginner / intermediate / advanced), `language`, `tags`, `prerequisites`, `what you'll learn` (bullet points). |
| 11 | Free vs paid courses | **Both supported.** A course can have `price = 0` (free) or a positive numeric value (paid). |
| 12 | Course goes live | **Admin approval required.** After an instructor publishes a course, it enters a `pending review` state and is not visible to students until an admin explicitly approves it. |
| 13 | Ratings & reviews | **Yes — enrolled students only.** Only students who are actively enrolled in a course can leave a rating and written review. |
| 14 | Search & category filter | **Yes — handled on the backend.** The API must support full-text course search and filtering by category, difficulty, language, and price range. |

---

## 4. Modules & Lessons

| # | Question | Answer |
|---|----------|--------|
| 15 | Content hierarchy | **Course → Modules → Lessons (3-level hierarchy).** A course contains modules; each module contains one or more lessons. |
| 16 | Lesson fields | **All fields listed.** Each lesson stores: `title`, `video URL` (YouTube or Cloudinary), `duration`, `description`, `attachments / resources` (PDF download links), and a `free preview` flag (certain lessons visible without enrollment). |
| 17 | Lesson order enforcement | **Yes — strictly enforced.** A student cannot access Lesson N until all previous lessons in that module are marked as complete. Order is locked. |

---

## 5. Quizzes

| # | Question | Answer |
|---|----------|--------|
| 18 | Quiz structure | **Multiple quizzes per course.** Quizzes can be attached at the module level — each module can have its own quiz. |
| 19 | Question types | **MCQ only.** Each question has 4 options with exactly 1 correct answer. |
| 20 | Failed quiz retake policy | **Waiting period + attempt limit.** If a student fails, they must wait a defined period before retaking. A maximum of **3 attempts** is allowed. After 3 failed attempts, the quiz is locked. |
| 21 | Certificate requirement | **Quiz pass required.** A student must pass all required quizzes (in addition to completing all lessons) to be eligible for a certificate. |

---

## 6. Enrollment & Progress

| # | Question | Answer |
|---|----------|--------|
| 22 | Enrollment flow | **Both instant and payment-based.** Free courses enroll the student immediately. Paid courses require a payment step before enrollment is confirmed. |
| 23 | Payment gateway | **Mock payment only.** A "Pay Now" button simulates payment — on click, the backend records the payment as complete and enrolls the student. No real payment gateway (Stripe / PayPal) in this version. |
| 24 | Lesson completion tracking | **Automatic — based on video watch time.** The frontend sends watch-time events to the backend; a lesson is marked complete when the student watches a sufficient percentage of the video (e.g., 80%+). |
| 25 | Course progress calculation | **Percentage of lessons completed.** `Progress % = (lessons completed / total lessons) × 100`. Displayed to the student on their dashboard. |

---

## 7. Certificates

| # | Question | Answer |
|---|----------|--------|
| 26 | Certificate contents & verification | **Full details + unique verification URL.** The certificate includes: `student name`, `course title`, `completion date`, `unique certificate ID`. A public verification URL (`/verify/:certificateId`) allows anyone to confirm the certificate is genuine. |
| 27 | Certificate generation | **Both frontend and backend.** The frontend renders and downloads the certificate using jsPDF. The backend stores certificate records (ID, student, course, date) and serves them via the verification endpoint. |

---

## 8. Admin Panel

| # | Question | Answer |
|---|----------|--------|
| 28 | Admin capabilities | **All of the following:** View all users (students & instructors) · Ban / delete user accounts · Approve or reject instructor registration requests · Approve or reject courses before they go live · View platform analytics (total users, enrollments, revenue) · Manage course categories |
| 29 | Number of admins | **Exactly one admin.** The admin account is created manually (e.g., via a seed script or environment config). There is no self-registration path for admin. Multiple admins are not supported. |

---

## 9. Security & Technical Preferences

| # | Question | Answer |
|---|----------|--------|
| 30 | Rate limiting | **Yes.** Rate limiting will be applied globally — a recommended default is **100 requests per 15 minutes per IP**. Stricter limits on auth routes (login, register, forgot-password). |
| 31 | Input validation | **Yes.** All incoming request data will be validated using a library such as `Joi` or `express-validator`. Invalid formats (wrong email, short password, missing fields) are rejected with clear error messages before reaching the database. |
| 32 | File upload handling | **Frontend uploads directly to Cloudinary.** The backend does not handle file uploads via Multer. Instead, the frontend uploads images / videos directly to Cloudinary and sends back the resulting URL to be stored in the database. |

---

## 10. Architecture & Deployment

| # | Question | Answer |
|---|----------|--------|
| 33 | Backend port | **Flexible — use `5000` as default.** If `5000` is occupied, the server falls back to the next available port via an environment variable (`PORT`). |
| 34 | Deployment target | **Planned deployment.** Currently running locally during development, but the backend must be structured for deployment to a platform such as **Render** or **Railway** (free tiers). Environment variables will be managed via `.env` / platform config. |
| 35 | API documentation | **Yes.** API documentation will be auto-generated — Swagger (OpenAPI) or an exported Postman collection so all endpoints are browsable and testable without reading source code. |
| 36 | Error logging | **Yes.** A logging system will capture all server errors to a log file (e.g., using `winston` or `morgan`). Logs include timestamp, route, error message, and stack trace for debugging. |

---

## Summary Decisions at a Glance

| Area | Decision |
|------|----------|
| Database | MongoDB Atlas (free tier) — not yet set up |
| Auth | Google OAuth + Email/Password · JWT (1 day) · Forgot password ✅ |
| Roles | Student / Instructor (user choice) / Admin (manual only) |
| Instructor approval | Required before course creation |
| Course approval | Required before going live |
| Hierarchy | Course → Module → Lesson |
| Quizzes | Per module · MCQ only · 3 attempts · waiting period |
| Payments | Mock only |
| File uploads | Frontend → Cloudinary (backend stores URL only) |
| Certificates | Frontend render + backend storage + verification URL |
| Admin | Single admin · full platform control |
| Security | Rate limiting + input validation |
| Deployment | Render / Railway (after local dev) |
| Docs & Logging | Swagger + Winston error logs |

---

*Document version: 1.0 — SkillForge Backend Rebuild*
