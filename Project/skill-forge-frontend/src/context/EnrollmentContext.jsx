import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/api';

const EnrollmentContext = createContext();

export const EnrollmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchEnrollments();
    } else {
      setEnrollments([]);
    }
  }, [user]);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend route: GET /api/enrollments/my
      const res = await api.get('/enrollments/my');
      setEnrollments(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load enrollments');
      console.error('Error fetching enrollments:', err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  // Enroll in a course: POST /api/enrollments
  const enrollInCourse = async (courseId, paymentMethod = 'free') => {
    const res = await api.post('/enrollments', { courseId, paymentMethod });
    await fetchEnrollments(); // refresh
    return res.data.data;
  };

  // Unenroll from a course: DELETE /api/enrollments/:courseId
  const unenrollFromCourse = async (courseId) => {
    await api.delete(`/enrollments/${courseId}`);
    setEnrollments((prev) => prev.filter((e) => e.course?._id !== courseId));
  };

  // Ping progress: POST /api/progress/ping
  const pingProgress = async (lessonId, courseId, watchedSeconds) => {
    try {
      const res = await api.post('/progress/ping', { lessonId, courseId, watchedSeconds });
      // Update local enrollment progress
      setEnrollments((prev) =>
        prev.map((e) =>
          e.course?._id === courseId
            ? { ...e, progressPercent: res.data.data.progressPercent, isCompleted: res.data.data.isCompleted }
            : e
        )
      );
      return res.data.data;
    } catch (err) {
      console.error('Progress ping failed:', err);
    }
  };

  // Check enrollment by courseId (local state lookup)
  const isEnrolled = (courseId) => {
    return enrollments.some((e) => e.course?._id === courseId || e.course === courseId);
  };

  const getEnrollment = (courseId) => {
    return enrollments.find((e) => e.course?._id === courseId || e.course === courseId);
  };

  // Check enrollment via API (for course detail page)
  const checkEnrollment = async (courseId) => {
    try {
      const res = await api.get(`/enrollments/check/${courseId}`);
      return res.data.data;
    } catch {
      return { enrolled: false, enrollment: null };
    }
  };

  return (
    <EnrollmentContext.Provider
      value={{
        enrollments,
        loading,
        error,
        fetchEnrollments,
        enrollInCourse,
        unenrollFromCourse,
        pingProgress,
        isEnrolled,
        getEnrollment,
        checkEnrollment,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (!context) throw new Error('useEnrollment must be used within EnrollmentProvider');
  return context;
};

export default EnrollmentContext;
