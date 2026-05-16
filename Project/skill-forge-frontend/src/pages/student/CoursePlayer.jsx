import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import api from '../../api/api';
import {
  ChevronLeft, ChevronRight, Download, FileText, Award, Menu, X, CheckCircle, Lock, Code, PlayCircle, HelpCircle, XCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../../components/ui/dialog';
import Navbar from '../../components/shared/Navbar';
import AITutor from '../../components/student/AITutor';
import CodeLab from '../../components/student/CodeLab';
import VideoPlayer from '../../components/student/VideoPlayer';

const CoursePlayer = () => {
  const { id } = useParams(); // course ID
  const { user } = useAuth();
  const { pingProgress } = useEnrollment();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentLab, setCurrentLab] = useState(null);
  const [viewMode, setViewMode] = useState('video'); // 'video' or 'lab'
  const [progress, setProgress] = useState({}); // { [lessonId]: { isCompleted, watchedSeconds } }
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [labs, setLabs] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizResult, setQuizResult] = useState(null); // 'correct' or 'incorrect'
  const pingInterval = useRef(null);
  const watchedSeconds = useRef(0);

  useEffect(() => { fetchCourseData(); }, [id]);

  useEffect(() => {
    if (id) fetchProgress();
  }, [id]);

  useEffect(() => {
    if (currentLesson) {
      fetchLessonVideo(currentLesson);
      fetchModuleLabs(currentLesson.module);
    }
  }, [currentLesson?._id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}/full`);
      const courseData = res.data.data;
      setCourse(courseData);
      const mods = courseData?.modules || [];
      setModules(mods);
      if (mods.length > 0 && mods[0]?.lessons?.length > 0) {
        setCurrentLesson(mods[0].lessons[0]);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      navigate('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleLabs = async (moduleId) => {
    if (!moduleId) return;
    try {
      const res = await api.get(`/modules/${moduleId}/labs`);
      setLabs(res.data.data || []);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await api.get(`/progress/course/${id}`);
      const progressData = res.data.data;
      setEnrollmentId(progressData?._id);
      const map = {};
      (progressData?.lessonProgresses || []).forEach((p) => {
        map[p.lesson] = { isCompleted: p.isCompleted, watchedSeconds: p.watchedSeconds };
      });
      setProgress(map);
    } catch { /* ignore */ }
  };

  const fetchLessonVideo = async (lesson) => {
    try {
      const res = await api.get(
        `/courses/${id}/modules/${lesson.module}/lessons/${lesson._id}/watch`
      );
      setVideoUrl(res.data.data?.videoUrl || lesson.videoUrl);
    } catch (err) {
      setVideoUrl(lesson.videoUrl);
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

  const handleQuizSubmit = () => {
    if (!activeQuiz?.question) return;
    if (selectedOption === activeQuiz.question.correctOption) {
      setQuizResult('correct');
      setTimeout(() => {
        setActiveQuiz(null);
        setSelectedOption(null);
        setQuizResult(null);
      }, 2000);
    } else {
      setQuizResult('incorrect');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading course player...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
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
          <h1 className="hidden md:block text-lg font-bold text-white truncate max-w-md">{course?.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
           {labs?.length > 0 && (
             <div className="flex bg-gray-800 rounded-lg p-1 mr-4">
                <button 
                  onClick={() => setViewMode('video')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1 ${viewMode === 'video' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <PlayCircle size={14} /> <span>Video</span>
                </button>
                <button 
                  onClick={() => { setViewMode('lab'); if (!currentLab) setCurrentLab(labs[0]); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1 ${viewMode === 'lab' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Code size={14} /> <span>Hands-on Lab</span>
                </button>
             </div>
           )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video + info */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0a0c12]">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            {viewMode === 'video' ? (
              <>
                {/* Video */}
                <div className="mb-6 shadow-2xl">
                  {videoUrl ? (
                    <VideoPlayer
                      videoUrl={videoUrl}
                      lessonId={currentLesson?._id}
                      enrollmentId={enrollmentId} 
                      interactiveQuizzes={currentLesson?.interactiveQuizzes || []}
                      onQuizTrigger={(quiz) => setActiveQuiz(quiz)}
                      onLessonComplete={() => {}}
                    />
                  ) : (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden flex flex-col items-center justify-center text-gray-500">
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

                  {/* Resources */}
                  {currentLesson?.attachments?.length > 0 && (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-primary-500" /> Lesson Resources
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {currentLesson.attachments.map((att, i) => (
                          <a
                            key={i}
                            href={att?.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-primary-400" />
                              <span className="text-sm font-medium text-white">{att?.name}</span>
                            </div>
                            <Download className="w-5 h-5 text-gray-500" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                    <Button
                      onClick={() => { stopProgressPing(); const p = getPreviousLesson(currentLesson?._id); if (p) setCurrentLesson(p); }}
                      disabled={!getPreviousLesson(currentLesson?._id)}
                      variant="outline"
                      className="border-gray-700 text-gray-300"
                    >
                      <ChevronLeft size={16} /> Previous
                    </Button>
                    <Button
                      onClick={() => { stopProgressPing(); const n = getNextLesson(currentLesson?._id); if (n) setCurrentLesson(n); }}
                      disabled={!getNextLesson(currentLesson?._id)}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Next <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 min-h-0">
                {currentLab ? (
                  <CodeLab lab={currentLab} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Select a lab from the list below</p>
                  </div>
                )}
                {labs?.length > 1 && (
                   <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                      {labs.map((l, idx) => (
                        <button 
                          key={l?._id}
                          onClick={() => setCurrentLab(l)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${currentLab?._id === l?._id ? 'bg-primary-600/20 border-primary-500 text-primary-400' : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-white'}`}
                        >
                          Lab {idx + 1}: {l?.title}
                        </button>
                      ))}
                   </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-full md:w-96 flex-shrink-0 bg-gray-900 border-l border-gray-800 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Course Content</h3>
              {modules?.map((mod, mIdx) => (
                <div key={mod?._id} className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
                    Module {mIdx + 1}: {mod?.title}
                  </h4>
                  <div className="space-y-1">
                    {(mod?.lessons || []).map((lesson) => {
                      const isActive = currentLesson?._id === lesson?._id;
                      const isCompleted = progress[lesson?._id]?.isCompleted;
                      const locked = isLessonLocked(lesson);
                      return (
                        <button
                          key={lesson?._id}
                          onClick={() => { if (!locked) { stopProgressPing(); setCurrentLesson(lesson); setViewMode('video'); } }}
                          disabled={locked}
                          className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-center gap-3 ${
                            isActive
                              ? 'bg-primary-600 text-white shadow-lg'
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
                            <p className="text-sm font-medium truncate">{lesson?.title}</p>
                            <p className="text-xs opacity-60">{Math.round((lesson?.duration || 0) / 60)} min</p>
                          </div>
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

      {/* AI Tutor */}
      {course && <AITutor context={`Student is watching ${course?.title}, currently at module "${currentLesson?.module}" and lesson "${currentLesson?.title}". Description: ${currentLesson?.description}`} />}

      {/* In-Video Quiz Modal */}
      {activeQuiz && (
        <Dialog open={!!activeQuiz} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="text-primary-500" /> Knowledge Check
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Pause and reflect! Answer this question to continue.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <h3 className="text-lg font-bold mb-4">{activeQuiz?.question?.text}</h3>
              <div className="space-y-2">
                {activeQuiz?.question?.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedOption === idx 
                        ? 'border-primary-500 bg-primary-500/10' 
                        : 'border-gray-800 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                  >
                    <span className="font-bold mr-3">{opt?.label || String.fromCharCode(65 + idx)}.</span> {opt?.text}
                  </button>
                ))}
              </div>

              {quizResult === 'correct' && (
                <p className="mt-4 text-green-400 font-bold flex items-center gap-2 animate-bounce">
                  <CheckCircle size={18} /> Correct! Resuming video...
                </p>
              )}
              {quizResult === 'incorrect' && (
                <p className="mt-4 text-red-400 font-bold flex items-center gap-2">
                  <XCircle size={18} /> Not quite. Try again!
                </p>
              )}
            </div>

            <DialogFooter>
              <Button 
                onClick={handleQuizSubmit} 
                disabled={selectedOption === null || quizResult === 'correct'}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                Submit Answer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CoursePlayer;
