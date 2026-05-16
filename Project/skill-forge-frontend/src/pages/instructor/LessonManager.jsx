import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/api';
import uploadToCloudinary from '@/utils/uploadToCloudinary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  X,
  Save,
  Play,
} from 'lucide-react';

export default function LessonManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseRes, modulesRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/courses/${id}/modules`)
      ]);

      setCourse(courseRes.data);
      setModules(modulesRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModuleModal = () => {
    setEditingModule(null);
    setShowModuleModal(true);
  };

  const openEditModuleModal = (module) => {
    setEditingModule(module);
    setShowModuleModal(true);
  };

  const openAddLessonModal = (moduleId) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setShowLessonModal(true);
  };

  const openEditLessonModal = (moduleId, lesson) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(lesson);
    setShowLessonModal(true);
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Delete this module and all its lessons?')) return;

    try {
      await api.delete(`/modules/${moduleId}`);
      await fetchCourseData();
    } catch (err) {
      console.error('Error deleting module:', err);
      alert('Failed to delete module');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Delete this lesson?')) return;

    try {
      await api.delete(`/lessons/${lessonId}`);
      await fetchCourseData();
    } catch (err) {
      console.error('Error deleting lesson:', err);
      alert('Failed to delete lesson');
    }
  };

  const moveLessonUp = async (moduleId, lessonIndex) => {
    if (lessonIndex === 0) return;

    const module = modules.find(m => m._id === moduleId);
    const lessons = [...module.lessons];
    [lessons[lessonIndex - 1], lessons[lessonIndex]] = 
      [lessons[lessonIndex], lessons[lessonIndex - 1]];

    try {
      await api.put(`/modules/${moduleId}/reorder`, { lessons: lessons.map(l => l._id) });
      await fetchCourseData();
    } catch (err) {
      console.error('Error reordering lessons:', err);
      alert('Failed to reorder lessons');
    }
  };

  const moveLessonDown = async (moduleId, lessonIndex) => {
    const module = modules.find(m => m._id === moduleId);
    if (lessonIndex >= module.lessons.length - 1) return;

    const lessons = [...module.lessons];
    [lessons[lessonIndex], lessons[lessonIndex + 1]] = 
      [lessons[lessonIndex + 1], lessons[lessonIndex]];

    try {
      await api.put(`/modules/${moduleId}/reorder`, { lessons: lessons.map(l => l._id) });
      await fetchCourseData();
    } catch (err) {
      console.error('Error reordering lessons:', err);
      alert('Failed to reorder lessons');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/instructor/dashboard"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {course?.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage modules and lessons
              </p>
            </div>
            <Button
              onClick={openAddModuleModal}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
            <CardContent className="p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Modules List */}
        {modules.length === 0 ? (
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No modules yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start building your course by adding modules and lessons
              </p>
              <Button
                onClick={openAddModuleModal}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Module
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {modules.map((module, moduleIndex) => (
              <ModuleCard
                key={module._id}
                module={module}
                moduleIndex={moduleIndex}
                onEdit={() => openEditModuleModal(module)}
                onDelete={() => handleDeleteModule(module._id)}
                onAddLesson={() => openAddLessonModal(module._id)}
                onEditLesson={(lesson) => openEditLessonModal(module._id, lesson)}
                onDeleteLesson={handleDeleteLesson}
                onMoveLessonUp={(lessonIndex) => moveLessonUp(module._id, lessonIndex)}
                onMoveLessonDown={(lessonIndex) => moveLessonDown(module._id, lessonIndex)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Module Modal */}
      {showModuleModal && (
        <ModuleModal
          module={editingModule}
          courseId={id}
          onClose={() => setShowModuleModal(false)}
          onSuccess={() => {
            setShowModuleModal(false);
            fetchCourseData();
          }}
        />
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <LessonModal
          lesson={editingLesson}
          moduleId={selectedModuleId}
          onClose={() => setShowLessonModal(false)}
          onSuccess={() => {
            setShowLessonModal(false);
            fetchCourseData();
          }}
        />
      )}
    </div>
  );
}

// Module Card Component
function ModuleCard({ 
  module, 
  moduleIndex, 
  onEdit, 
  onDelete, 
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onMoveLessonUp,
  onMoveLessonDown
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardContent className="p-6">
        {/* Module Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold flex-shrink-0">
              {moduleIndex + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {module.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {module.lessons?.length || 0} lessons
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Lessons List */}
        {expanded && (
          <div className="ml-14 space-y-3">
            {module.lessons?.map((lesson, lessonIndex) => (
              <LessonCard
                key={lesson._id}
                lesson={lesson}
                lessonIndex={lessonIndex}
                totalLessons={module.lessons.length}
                onEdit={() => onEditLesson(lesson)}
                onDelete={() => onDeleteLesson(lesson._id)}
                onMoveUp={() => onMoveLessonUp(lessonIndex)}
                onMoveDown={() => onMoveLessonDown(lessonIndex)}
              />
            ))}

            {/* Add Lesson Button */}
            <button
              onClick={onAddLesson}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors group"
            >
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                Add Lesson
              </p>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Lesson Card Component
function LessonCard({ lesson, lessonIndex, totalLessons, onEdit, onDelete, onMoveUp, onMoveDown }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Play className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {lesson.title}
        </h4>
        {lesson.duration && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button
          onClick={onMoveUp}
          disabled={lessonIndex === 0}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button
          onClick={onMoveDown}
          disabled={lessonIndex >= totalLessons - 1}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
        <Button
          onClick={onEdit}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={onDelete}
          variant="ghost"
          size="sm"
          className="p-1 text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Module Modal Component
function ModuleModal({ module, courseId, onClose, onSuccess }) {
  const [title, setTitle] = useState(module?.title || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSaving(true);

      if (module) {
        await api.put(`/modules/${module._id}`, { title });
      } else {
        await api.post(`/courses/${courseId}/modules`, { title });
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving module:', err);
      alert('Failed to save module');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 max-w-md w-full">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {module ? 'Edit Module' : 'Add Module'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Module Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to React"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  module ? 'Update' : 'Add Module'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Lesson Modal Component
function LessonModal({ lesson, moduleId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    description: lesson?.description || '',
    video_url: lesson?.video_url || '',
    duration: lesson?.duration || '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file, 'video');
      setFormData(prev => ({ ...prev, video_url: url }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (lesson) {
        await api.put(`/lessons/${lesson._id}`, formData);
      } else {
        await api.post(`/modules/${moduleId}/lessons`, formData);
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving lesson:', err);
      alert('Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 max-w-2xl w-full my-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {lesson ? 'Edit Lesson' : 'Add Lesson'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., What is React?"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what students will learn..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Video <span className="text-red-500">*</span>
              </label>
              {formData.video_url ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Video className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-800 dark:text-green-200 flex-1 truncate">
                      {formData.video_url}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, video_url: '' }))}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900/40 rounded"
                    >
                      <X className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block w-full cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                    {uploading ? (
                      <>
                        <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">Uploading video...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Click to upload video
                        </p>
                        <p className="text-xs text-gray-500 mt-1">MP4, WebM up to 100MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 300"
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving || uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || uploading || !formData.video_url}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  lesson ? 'Update Lesson' : 'Add Lesson'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
