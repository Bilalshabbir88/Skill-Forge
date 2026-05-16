# SkillForge: Data Science Edition — Structured User Guide 📖

Welcome to SkillForge! This guide will help you navigate and master the platform, whether you are a Student, Instructor, or Admin.

---

## 🔑 Access Credentials

The platform has been pre-seeded with the following accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@skillforge.com` | `Admin@123456` | Full platform control |
| **Instructor** | `instructor1@skillforge.com` | `Test@123456` | Create courses & labs |
| **Student** | `student1@skillforge.com` | `Test@123456` | Start learning immediately |

*Note: There are 5 instructors (`instructor1-5`) and 50 students (`student1-50`) available with the same password.*

---

## 👨‍🎓 For Students: Your Learning Journey

### 1. Dashboard & Progress
- Once logged in, your **Dashboard** shows your enrolled courses and overall completion status.
- Use the **Course Player** to watch videos and track your progress automatically.

### 2. Interactive Learning
- **In-Video Quizzes:** Some videos will automatically pause at specific timestamps. You must answer the knowledge check correctly to continue.
- **Hands-on Labs:** Click the **"Hands-on Lab"** tab in the course player to open the integrated Monaco Editor. Write Python code and run tests to verify your solution.
- **AI Tutor:** Use the floating bot icon in the bottom-right corner to ask questions. The AI is aware of which lesson you are currently studying.

### 3. Professional Tracks
- Visit the **Specializations** page to enroll in full career paths (e.g., Professional Data Scientist). Completing all courses in a track earns you a Professional Certificate.

---

## 👨‍🏫 For Instructors: Building Content

### 1. Course Creation
- Use your dashboard to create new courses. You can add **Modules** and **Lessons**.
- For each lesson, you can upload video links and attach resources (PDFs, Datasets).

### 2. Interactive Elements
- **Quizzes:** Create technical quizzes for each module.
- **Coding Labs:** (Admin/Dev feature) Instructors can define starter code and test cases for students to execute in the browser.

---

## 🛠️ For Admins: Platform Management

### 1. User Moderation
- Approve or ban users from the **Admin Dashboard**.
- Track platform-wide analytics and enrollment trends.

### 2. Course Approval
- Review and approve courses submitted by instructors before they go live on the public catalog.

---

## 🚀 Advanced Features Setup

### In-Browser Code Execution
- The platform uses the **Judge0 API**. Ensure your `JUDGE0_KEY` is set in the backend `.env` file for live execution.
- If no key is provided, the platform runs in **Simulation Mode** (always passing tests for demo purposes).

### AI Tutoring
- The AI assistant requires an **OpenAI** or **Gemini** API key in the backend `.env`. 
- The proxy logic ensures your API keys are never exposed to the frontend.

---

## 📁 Data Management
- **Dataset Library:** Both public and logged-in users can search the **Data Science Library** for open-source datasets to use in their projects.

*Happy Learning!*
