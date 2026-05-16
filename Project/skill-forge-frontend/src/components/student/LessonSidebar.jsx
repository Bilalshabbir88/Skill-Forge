import { useState } from 'react';
import { Play, CheckCircle, Lock, Clock, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

const LessonSidebar = ({ modules, currentLesson, onLessonSelect, progress = {} }) => {
  const [expandedModules, setExpandedModules] = useState([modules?.[0]?._id]);

  // Calculate overall progress
  const totalLessons = modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;
  const completedLessons = Object.values(progress).filter((p) => p.completed).length;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const isLessonLocked = (moduleIndex, lessonIndex) => {
    // First module, first lesson is always unlocked
    if (moduleIndex === 0 && lessonIndex === 0) return false;

    // Check if previous lesson is completed
    if (lessonIndex > 0) {
      const prevLesson = modules[moduleIndex].lessons[lessonIndex - 1];
      return !progress[prevLesson._id]?.completed;
    }

    // First lesson of a module - check if last lesson of previous module is completed
    if (moduleIndex > 0) {
      const prevModule = modules[moduleIndex - 1];
      const lastLessonOfPrevModule = prevModule.lessons[prevModule.lessons.length - 1];
      return !progress[lastLessonOfPrevModule._id]?.completed;
    }

    return false;
  };

  const isLessonCompleted = (lessonId) => {
    return progress[lessonId]?.completed || false;
  };

  const getModuleProgress = (module) => {
    if (!module.lessons || module.lessons.length === 0) return 0;
    const completed = module.lessons.filter((lesson) => isLessonCompleted(lesson._id)).length;
    return (completed / module.lessons.length) * 100;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Course Content</h2>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Your Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {completedLessons}/{totalLessons} Lessons
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(overallProgress)}% Complete
          </p>
        </div>
      </div>

      {/* Modules and Lessons */}
      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" value={expandedModules} onValueChange={setExpandedModules}>
          {modules?.map((module, moduleIndex) => {
            const moduleProgress = getModuleProgress(module);
            const isModuleCompleted = moduleProgress === 100;

            return (
              <AccordionItem key={module._id} value={module._id} className="border-b border-gray-200 dark:border-gray-800">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isModuleCompleted
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        {isModuleCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {moduleIndex + 1}
                          </span>
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {module.module_title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {module.lessons?.length || 0} lessons • {Math.round(moduleProgress)}% complete
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={isModuleCompleted ? 'success' : 'secondary'}
                      className="ml-2 text-xs"
                    >
                      {Math.round(moduleProgress)}%
                    </Badge>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-6 pb-2">
                  <div className="space-y-1">
                    {module.lessons?.map((lesson, lessonIndex) => {
                      const isActive = currentLesson?._id === lesson._id;
                      const isCompleted = isLessonCompleted(lesson._id);
                      const isLocked = isLessonLocked(moduleIndex, lessonIndex);

                      return (
                        <button
                          key={lesson._id}
                          onClick={() => !isLocked && onLessonSelect(lesson)}
                          disabled={isLocked}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600'
                              : isLocked
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {/* Status Icon */}
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : isLocked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                              ) : (
                                <Play
                                  className={`w-5 h-5 ${
                                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
                                  }`}
                                />
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isActive
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <div className="flex items-center space-x-3 mt-1">
                                {lesson.duration && (
                                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Clock size={12} />
                                    <span>{formatDuration(lesson.duration)}</span>
                                  </div>
                                )}
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                    <FileText size={12} />
                                    <span>{lesson.resources.length} files</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Chevron for active lesson */}
                            {isActive && <ChevronRight className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Footer - Next Lesson CTA */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        {overallProgress === 100 ? (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Course Completed! 🎉
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Ready to take the quiz?
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Keep Learning</p>
            <div className="flex items-center space-x-2 text-sm">
              <Play className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {completedLessons} of {totalLessons} lessons done
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonSidebar;
