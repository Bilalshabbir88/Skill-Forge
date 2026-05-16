# Plan: SkillForge Data Science Extensions

This document outlines the technical implementation plan for transforming SkillForge into a specialized Data Science learning platform ("Coursera for Data Science").

## 1. Scope & Objectives
The goal is to implement five major features requested by the user:
1.  **Specializations:** Grouping related courses into learning tracks.
2.  **Dataset Repository:** A centralized library of open-source datasets for practice.
3.  **In-Video Quizzes:** Interactive video lessons that pause at specific timestamps for knowledge checks.
4.  **Hands-On Coding Labs:** In-browser Python/R coding environments.
5.  **AI Tutoring Assistant:** An integrated AI helper to assist students with debugging and concepts.

## 2. Backend Architecture Changes

### 2.1 Database Models
*   **Specialization Model:**
    *   Fields: `title`, `slug`, `description`, `category`, `courses` (Array of Course ObjectIds), `thumbnail`, `status`.
*   **Dataset Model:**
    *   Fields: `title`, `description`, `sourceUrl` (e.g., Kaggle link), `fileUrl` (direct download), `tags`, `uploadedBy` (Admin/Instructor).
*   **CodingLab Model:**
    *   Fields: `module` (ObjectId), `title`, `instructions`, `starterCode` (String), `solutionCode` (String), `language` (e.g., 'python'), `testCases` (Array of objects with input/expected output).
*   **Lesson Model Updates:**
    *   Add: `interactiveQuizzes` (Array: `{ timestamp: Number, questionId: ObjectId }`).

### 2.2 API Integrations
*   **Code Execution Engine:** Integrate with a service like **Judge0** or build a lightweight Docker-based runner to execute untrusted user code safely. *Recommendation: Judge0 API for initial speed and reliability.*
*   **AI API:** Integrate with the **Gemini API** or **OpenAI API** to provide the tutoring service. The backend will act as a proxy to keep API keys secure.

### 2.3 New API Routes
*   `GET /api/specializations`, `GET /api/specializations/:id`
*   `GET /api/datasets`
*   `POST /api/labs/:id/execute` (Submits code to Judge0, runs test cases)
*   `POST /api/ai/chat` (Handles requests to the AI tutor with context about the current lesson/lab)

## 3. Frontend Architecture Changes

### 3.1 New Components
*   **CodeEditor:** Integration with **Monaco Editor** (the engine behind VS Code) for syntax highlighting and code completion.
*   **AITutorPanel:** A floating chat interface available during lessons and coding labs.
*   **VideoPlayer Enhancements:** Custom controls over the YouTube/Video player to monitor timestamps and trigger modals when an interactive quiz is hit.
*   **Specialization Views:** Pages to browse and enroll in full specializations.
*   **Dataset Library View:** A searchable grid of available datasets.

### 3.2 State Management
*   Extend existing contexts to track specialization progress and AI chat history.

## 4. Implementation Phases

*   **Phase 1: Foundation (Specializations & Datasets)**
    *   Create MongoDB models and backend routes.
    *   Build frontend views for browsing and enrolling.
*   **Phase 2: Interactive Video**
    *   Update Lesson schema.
    *   Build custom VideoPlayer wrapper to handle timestamp events.
*   **Phase 3: Hands-On Coding**
    *   Implement Judge0 API integration on backend.
    *   Build Monaco Editor component on frontend.
    *   Create Lab creation tools for instructors.
*   **Phase 4: AI Tutoring**
    *   Implement AI provider backend proxy.
    *   Build frontend chat interface.

## 5. Next Steps for Approval
1.  Review this high-level architecture.
2.  Confirm the choice of **Judge0 API** for code execution (it has a free tier for development).
3.  Confirm which AI provider (Gemini/OpenAI) you prefer for the Tutor.