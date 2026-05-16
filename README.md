# SkillForge: Data Science Edition 🚀

SkillForge is a comprehensive, production-ready Learning Management System (LMS) specifically designed for Data Science education. It combines standard video-based learning with advanced interactive features like in-browser coding, AI tutoring, and specialization tracks.

## ✨ Key Features

### 📊 Data Science Specialized
- **Hands-on Coding Labs:** Integrated Monaco Editor (VS Code engine) for writing Python and R code directly in your browser.
- **Judge0 Execution:** Secure backend execution of student code with real-time feedback and test case validation.
- **AI Tutoring Assistant:** A context-aware AI helper that guides students through difficult concepts and debugging.
- **Professional Specializations:** Grouped course tracks leading to professional certifications.
- **Dataset Library:** A searchable repository of open-source datasets for student practice.

### 🎓 Advanced LMS Capabilities
- **Interactive Video Player:** Videos automatically pause at specific timestamps for knowledge-check quizzes.
- **Course Management:** Full CRUD for courses, modules, and lessons.
- **Role-Based Access Control:** Distinct workflows for Students, Instructors, and Admins.
- **Progress Tracking:** Granular tracking of lesson completion and quiz scores.
- **Certificates:** Automated generation of certificates upon course completion.

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Monaco Editor, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Passport.js (JWT & Google OAuth).
- **Integrations:** Judge0 (Code Execution), OpenAI/Gemini (AI Tutoring), Cloudinary (Media Storage).

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd Project/skill-forge-backend
npm install
# Configure your .env file with MongoDB URI and API Keys
npm run seed:ds  # Seed high-quality Data Science content
npm run dev      # Start development server
```

### 2. Frontend Setup
```bash
cd Project/skill-forge-frontend
npm install
# Configure VITE_API_URL in .env
npm run dev
```

## 📂 Project Structure

- `/Project/skill-forge-backend`: Express API and Database Models.
- `/Project/skill-forge-frontend`: React Application and UI Components.
- `/Project/Docs`: Project reports, SRS documentation, and technical specs.
- `/Assets`: Brand assets and logos.

## 🛡️ Security & Stability
- Global Error Boundaries to prevent site crashes.
- Robust JWT-based authentication.
- NoSQL injection and XSS protection middleware.
- Secure API proxying for AI and Code Execution services.

---
Created by Bilal Shabbir | 2026
