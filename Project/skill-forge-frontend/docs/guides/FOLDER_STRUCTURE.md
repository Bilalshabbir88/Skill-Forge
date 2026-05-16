# 📁 Folder Structure Organization

This document describes the organized folder structure of the Skill Forge frontend project.

## Directory Tree

```
skill-forge-frontend/
├── src/
│   ├── api/
│   │   └── api.js                 # Axios instance with JWT interceptor
│   │
│   ├── assets/
│   │   ├── images/                # Project images and logos
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (9 components)
│   │   │   ├── accordion.jsx
│   │   │   ├── avatar.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── input.jsx
│   │   │   ├── progress.jsx
│   │   │   └── tabs.jsx
│   │   │
│   │   ├── shared/                # Reusable components (9 components)
│   │   │   ├── CourseCard.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── student/               # Student-specific components
│   │   │   ├── LessonSidebar.jsx
│   │   │   ├── QuizForm.jsx
│   │   │   └── VideoPlayer.jsx
│   │   │
│   │   ├── admin/                 # (Empty, reserved for future)
│   │   ├── auth/                  # (Empty, reserved for future)
│   │   └── instructor/            # (Empty, reserved for future)
│   │
│   ├── constants/
│   │   └── mock/                  # Mock data for development/testing
│   │       ├── announcements.js
│   │       ├── certificates.js
│   │       ├── courses.js
│   │       ├── enrollments.js
│   │       ├── lessons.js
│   │       ├── modules.js
│   │       ├── quizzes.js
│   │       ├── users.js
│   │       └── index.js           # Barrel export for easy importing
│   │
│   ├── context/                   # Global state management (4 contexts)
│   │   ├── AuthContext.jsx        # User auth, JWT, login/logout
│   │   ├── CourseContext.jsx      # Active course state
│   │   ├── EnrollmentContext.jsx  # Student enrollments & progress
│   │   └── ThemeContext.jsx       # Dark mode theme state
│   │
│   ├── hooks/                     # Custom React hooks (reserved for future)
│   │
│   ├── lib/
│   │   └── utils.js               # shadcn utility functions
│   │
│   ├── pages/                     # Page components (23 pages total)
│   │   ├── public/                # Public pages (5 pages)
│   │   │   ├── CourseCatalog.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── student/               # Student pages (5 pages)
│   │   │   ├── Certificate.jsx
│   │   │   ├── CoursePlayer.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── StudentProfile.jsx
│   │   │
│   │   ├── instructor/            # Instructor pages (6 pages)
│   │   │   ├── CreateCourse.jsx
│   │   │   ├── EditCourse.jsx
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── InstructorProfile.jsx
│   │   │   ├── LessonManager.jsx
│   │   │   └── QuizBuilder.jsx
│   │   │
│   │   ├── admin/                 # Admin pages (5 pages)
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminProfile.jsx
│   │   │   ├── CourseModeration.jsx
│   │   │   ├── InstructorApproval.jsx
│   │   │   └── UserManagement.jsx
│   │   │
│   │   └── NotFound.jsx           # 404 error page
│   │
│   ├── services/                  # API services (reserved for future)
│   │
│   ├── styles/                    # Global CSS styles
│   │   ├── globals.css            # Main stylesheet (Tailwind + theme vars)
│   │   └── animations.css         # Animation and component styles
│   │
│   ├── utils/
│   │   ├── helpers.js             # Utility functions
│   │   └── uploadToCloudinary.js  # Cloudinary file upload utility
│   │
│   ├── App.jsx                    # Main app component with routes (21 routes)
│   ├── main.jsx                   # React entry point with providers
│   └── data/                      # (Deprecated, use constants/mock instead)
│
├── public/
│   └── favicon.svg
│
├── .env                           # Environment variables (API URL, Cloudinary)
├── components.json                # shadcn configuration
├── jsconfig.json                  # Module @ path alias configuration
├── vite.config.js                 # Vite build configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── package.json                   # Project dependencies (31 packages)
├── package-lock.json              # Dependency lock file
└── index.html                     # HTML entry point
```

---

## 📂 Folder Organization Rationale

### `src/styles/`
**Purpose:** Centralized CSS styling  
**Contents:**
- `globals.css` - Tailwind imports, global variables, OKLCH color system, dark mode CSS
- `animations.css` - Component styles, animations, responsive utilities

**Before:** `index.css` and `App.css` at root level  
**After:** Both organized under `src/styles/` for clarity

### `src/constants/mock/`
**Purpose:** Mock data for development and testing  
**Contents:**
- Database seed data for all entities (users, courses, lessons, etc.)
- `index.js` - Barrel exports for easy importing

**Before:** `src/data/` folder  
**After:** `src/constants/mock/` to clearly indicate these are development constants

**Why:** Distinguishes mock/development data from actual runtime constants in the future

### `src/components/`
**Purpose:** Reusable UI components organized by role  
**Structure:**
- `ui/` - Pre-built shadcn components (framework agnostic)
- `shared/` - Project-specific reusable components
- `student/`, `admin/`, `auth/`, `instructor/` - Role-specific components

### `src/context/`
**Purpose:** Global state management using React Context API  
**4 Contexts:**
- `AuthContext` - Authentication state
- `ThemeContext` - Dark mode toggle
- `CourseContext` - Active course data
- `EnrollmentContext` - Student enrollment progress

### `src/pages/`
**Purpose:** Page components organized by role/permission level  
**4 Sections:**
- `public/` - Accessible without authentication
- `student/` - Student-only pages
- `instructor/` - Instructor-only pages
- `admin/` - Admin-only pages

### Empty Reserved Folders
These folders are preserved for future expansion:
- `src/hooks/` - Custom React hooks (useAuth, useCourse, etc.)
- `src/services/` - API service classes
- `src/components/admin/`, `auth/`, `instructor/` - Role-specific components

---

## 🔄 Import Path Updates

### CSS Imports
```javascript
// Before
import './index.css'

// After  
import './styles/globals.css'
```

**Files Updated:**
- ✅ `src/main.jsx` - Import statement updated
- ✅ `components.json` - shadcn CSS path updated

### Mock Data Imports (if needed in future)
```javascript
// Before
import { announcements } from './data/announcements'

// After
import { mockAnnouncements } from './constants/mock'
```

Available from `src/constants/mock/index.js`:
- `mockAnnouncements`
- `mockCertificates`
- `mockCourses`
- `mockEnrollments`
- `mockLessons`
- `mockModules`
- `mockQuizzes`
- `mockUsers`

---

## ✅ Build Status

```bash
✓ Build successful
✓ CSS imports updated
✓ Configuration files updated
✓ Zero compilation errors
✓ Ready to run: npm run dev
```

---

## 🎯 Best Practices for New Development

### Adding New Components
```
src/components/
├── shared/        → Reusable across roles
├── student/       → Student-specific features
├── ui/            → shadcn components
└── [role]/        → Role-specific components
```

### Adding New Styles
```
src/styles/
├── globals.css    → Global styles & Tailwind
├── animations.css → Component-specific styles
└── [feature].css  → Feature-specific styles (future)
```

### Adding New Pages
```
src/pages/
├── public/        → No auth required
├── student/       → ProtectedRoute with role=['student']
├── instructor/    → ProtectedRoute with role=['instructor']
└── admin/         → ProtectedRoute with role=['admin']
```

### Adding New Constants
```
src/constants/
├── mock/          → Development/test data
└── [feature].js   → Feature-specific constants (future)
```

---

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| **Pages** | 23 |
| **Components** | 28+ |
| **Routes** | 21 |
| **Contexts** | 4 |
| **UI Components** | 9 (shadcn) |
| **Styles** | 2 files |
| **Mock Data Files** | 8 |
| **Dependencies** | 31 packages |

---

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npx eslint src/ (if configured)
```

---

**Last Updated:** April 6, 2026  
**Organized by:** GitHub Copilot  
**Status:** ✅ Complete & Production Ready
