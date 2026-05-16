import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/public/Landing';
import CourseCatalog from './pages/public/CourseCatalog';
import CourseDetail from './pages/public/CourseDetail';
import Specializations from './pages/public/Specializations';
import Datasets from './pages/public/Datasets';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import AuthCallback from './pages/public/AuthCallback';
import StudentDashboard from './pages/student/StudentDashboard';
import CoursePlayer from './pages/student/CoursePlayer';
import QuizPage from './pages/student/QuizPage';
import Certificate from './pages/student/Certificate';
import StudentProfile from './pages/student/StudentProfile';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import EditCourse from './pages/instructor/EditCourse';
import LessonManager from './pages/instructor/LessonManager';
import QuizBuilder from './pages/instructor/QuizBuilder';
import InstructorProfile from './pages/instructor/InstructorProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import InstructorApproval from './pages/admin/InstructorApproval';
import CourseModeration from './pages/admin/CourseModeration';
import AdminProfile from './pages/admin/AdminProfile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/specializations" element={<Specializations />} />
          <Route path="/datasets" element={<Datasets />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/verify/:certificateId" element={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Certificate verification coming soon.</p></div>} />
          
          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/courses/:id" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CoursePlayer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/quiz/:courseId" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <QuizPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/certificate/:id" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Certificate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Instructor Routes */}
          <Route 
            path="/instructor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/courses/new" 
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <CreateCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/courses/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <EditCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/courses/:id/lessons" 
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <LessonManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/courses/:id/quiz" 
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <QuizBuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor/profile" 
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/instructor-approvals" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <InstructorApproval />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CourseModeration />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/profile" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Unauthorized */}
          <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><div className="text-center"><h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1><p className="text-gray-600 dark:text-gray-400">You don't have permission to view this page</p></div></div>} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
