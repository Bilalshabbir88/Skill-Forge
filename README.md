# SkillForge: Data Science Edition 🚀

SkillForge is a world-class Learning Management System (LMS) optimized for the next generation of Data Scientists. Built with **React 19** and **Node.js**, it offers a Coursera-like experience featuring high-end interactive tools and specialized career tracks.

## 📖 Essential Documentation
- **[Full User Guide](./Project/Docs/USER_GUIDE.md):** Detailed instructions for Students, Instructors, and Admins.
- **[Technical Specification](./Project/Docs/SkillForge_Backend_Spec_v2.md):** Deep dive into the API architecture.

## ✨ High-End Features
- **Hands-on Coding Labs:** Write and run Python/R code in-browser using the **Monaco Editor** and **Judge0 API**.
- **AI Tutoring Assistant:** Context-aware bot to help students debug and learn technical concepts.
- **Interactive Video Player:** Automated in-video knowledge checks (Quizzes) triggered by timestamps.
- **Professional Specializations:** Grouped learning paths (e.g., *Deep Learning Specialization*) leading to certifications.
- **Data Library:** A searchable repository for open-source datasets (Kaggle-style).

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Monaco Editor, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Passport.js (JWT & OAuth).
- **Automation:** Specialized Data Science Seeder with 50+ students and technical curricula.

## 🚀 Quick Start

### 1. Clone and Install
```bash
# Install Backend
cd Project/skill-forge-backend
npm install

# Install Frontend
cd ../skill-forge-frontend
npm install
```

### 2. Seed and Launch
```bash
# From the backend directory
npm run seed:ds  # Populates 50 students, 5 instructors, and technical courses
npm run dev

# From the frontend directory
npm run dev
```

## 🔑 Demo Access
| Account | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@skillforge.com` | `Admin@123456` |
| **Student** | `student1@skillforge.com` | `Test@123456` |

---
Created by Bilal Shabbir | 5th Semester Web Technologies Project
