import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import api from '../../api/api';
import {
  ChevronLeft, ChevronRight, Download, FileText, Award, Menu, X, CheckCircle, Lock,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import Navbar from '../../components/shared/Navbar';

const CoursePlayer = () => {
  const { id } = useParams(); // course ID
  const { user } = useAuth();
  const { pingProgress } = useEnrollment();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState({}); // { [lessonId]: { isCompleted, watchedSeconds } }
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const pingInterval = useRef(null);
  const watchedSeconds = useRef(0);

  useEffect(() => { fetchCourseData(); }, [id]);

  useEffect(() => {
    if (id) fetchProgress();
  }, [id]);

  useEffect(() => {
    if (currentLesson) fetchLessonVideo(currentLesson);
  }, [currentLesson?._id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      // GET /api/courses/:id/full — returns full course with all lesson data
      const res = await api.get(`/courses/${id}/full`);
      const courseData = res.data.data;
      setCourse(courseData);
      const mods = courseData.modules || [];
      setModules(mods);
      if (mods.length > 0 && mods[0].lessons?.length > 0) {
        setCurrentLesson(mods[0].lessons[0]);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      navigate('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await api.get(`/progress/course/${id}`);
      const progressData = res.data.data;
      const map = {};
      (progressData.lessonProgresses || []).forEach((p) => {
        map[p.lesson] = { isCompleted: p.isCompleted, watchedSeconds: p.watchedSeconds };
      });
      setProgress(map);
    } catch { /* ignore — not enrolled or first visit */ }
  };

  const fetchLessonVideo = async (lesson) => {
    try {
      // GET /api/courses/:courseId/modules/:moduleId/lessons/:lessonId/watch
      const res = await api.get(
        `/courses/${id}/modules/${lesson.module}/lessons/${lesson._id}/watch`
      );
      setVideoUrl(res.data.data?.videoUrl || lesson.videoUrl);
    } catch (err) {
      if (err.response?.status === 403) {
        setVideoUrl(null);
      } else {
        // Fallback to stored URL
        setVideoUrl(lesson.videoUrl);
      }
    }
  };

  // Start pinging progress every 10 seconds while video is playing
  const startProgressPing = (lesson) => {
    if (pingInterval.current) clearInterval(pingInterval.current);
    watchedSeconds.current = progress[lesson._id]?.watchedSeconds || 0;
    pingInterval.current = setInterval(async () => {
      watchedSeconds.current += 10;
      const result = await pingProgress(lesson._id, id, watchedSeconds.current);
      if (result) {
        setProgress((prev) => ({
          ...prev,
          [lesson._id]: { ...prev[lesson._id], isCompleted: result.isCompleted, watchedSeconds: watchedSeconds.current },
        }));
        if (result.isCompleted && !progress[lesson._id]?.isCompleted) {
          const next = getNextLesson(lesson._id);
          if (next) setTimeout(() => setCurrentLesson(next), 1500);
        }
      }
    }, 10000);
  };

  const stopProgressPing = () => {
    if (pingInterval.current) { clearInterval(pingInterval.current); pingInterval.current = null; }
  };

  useEffect(() => {
    return () => stopProgressPing();
  }, []);

  const getNextLesson = (currentLessonId) => {
    for (let i = 0; i < modules.length; i++) {
      const lessons = modules[i].lessons || [];
      const idx = lessons.findIndex((l) => l._id === currentLessonId);
      if (idx !== -1) {
        if (idx < lessons.length - 1) return lessons[idx + 1];
        if (i < modules.length - 1 && modules[i + 1].lessons?.length > 0) return modules[i + 1].lessons[0];
      }
    }
    return null;
  };

  const getPreviousLesson = (currentLessonId) => {
    for (let i = 0; i < modules.length; i++) {
      const lessons = modules[i].lessons || [];
      const idx = lessons.findIndex((l) => l._id === currentLessonId);
      if (idx !== -1) {
        if (idx > 0) return lessons[idx - 1];
        if (i > 0) {
          const prev = modules[i - 1];
          return prev.lessons?.[prev.lessons.length - 1] || null;
        }
      }
    }
    return null;
  };

  const isLessonLocked = (lesson) => {
    if (!lesson || lesson.isFreePreview) return false;
    if (user?.role === 'instructor' || user?.role === 'admin') return false;
    if (lesson.order === 1) return false;
    const prev = getPreviousLesson(lesson._id);
    if (!prev) return false;
    return !progress[prev._id]?.isCompleted;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
          <p className="text-gray-400 mb-6">You may not have access to this course.</p>
          <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <div className="hidden md:block h-6 w-px bg-gray-700"></div>
          <h1 className="hidden md:block text-lg font-bold text-white truncate max-w-md">{course.title}</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video + info */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Video */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
              {videoUrl ? (
                <iframe
                  key={videoUrl}
                  src={videoUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => currentLesson && startProgressPing(currentLesson)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <Lock size={48} className="mb-3" />
                  <p>Complete the previous lesson to unlock this one</p>
                </div>
              )}
            </div>

            {/* Lesson info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{currentLesson?.title}</h2>
                {currentLesson?.description && (
                  <p className="text-gray-400">{currentLesson.description}</p>
                )}
              </div>

              {/* Attachments */}
              {currentLesson?.attachments?.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText size={20} /> Lesson Resources
                  </h3>
                  <div className="space-y-2">
                    {currentLesson.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-medium text-white">{att.name}</span>
                        </div>
                        <Download className="w-5 h-5 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <Button
                  onClick={() => { stopProgressPing(); const p = getPreviousLesson(currentLesson?._id); if (p) setCurrentLesson(p); }}
                  disabled={!getPreviousLesson(currentLesson?._id)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <Button
                  onClick={() => { stopProgressPing(); const n = getNextLesson(currentLesson?._id); if (n) setCurrentLesson(n); }}
                  disabled={!getNextLesson(currentLesson?._id)}
                  className="flex items-center gap-2"
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-full md:w-96 flex-shrink-0 bg-gray-900 border-l border-gray-800 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Course Content</h3>
              {modules.map((mod, mIdx) => (
                <div key={mod._id} className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                    Module {mIdx + 1}: {mod.title}
                  </h4>
                  <div className="space-y-1">
                    {(mod.lessons || []).map((lesson) => {
                      const isActive = currentLesson?._id === lesson._id;
                      const isCompleted = progress[lesson._id]?.isCompleted;
                      const locked = isLessonLocked(lesson);
                      return (
                        <button
                          key={lesson._id}
                          onClick={() => { if (!locked) { stopProgressPing(); setCurrentLesson(lesson); } }}
                          disabled={locked}
                          className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-center gap-3 ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : locked
                              ? 'text-gray-600 cursor-not-allowed'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle size={18} className="text-green-400" />
                            ) : locked ? (
                              <Lock size={18} />
                            ) : (
                              <div className={`w-5 h-5 rounded-full border-2 ${isActive ? 'border-white' : 'border-gray-600'}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                            <p className="text-xs opacity-60">{Math.round((lesson.duration || 0) / 60)} min</p>
                          </div>
                          {lesson.isFreePreview && !isActive && (
                            <span className="text-xs text-blue-400 flex-shrink-0">Free</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
