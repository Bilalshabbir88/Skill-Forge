import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [activeCourse, setActiveCourse] = useState(null); // Full course with modules and lessons
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch course with modules and lessons
  const fetchCourse = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const [courseRes, modulesRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/courses/${courseId}/modules`),
      ]);
      
      setActiveCourse({
        ...courseRes.data,
        modules: modulesRes.data,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course');
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearActiveCourse = () => {
    setActiveCourse(null);
    setError(null);
  };

  return (
    <CourseContext.Provider
      value={{
        activeCourse,
        loading,
        error,
        fetchCourse,
        clearActiveCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within CourseProvider');
  }
  return context;
};

export default CourseContext;
