import { Link } from 'react-router-dom';
import { Star, Clock, Users, TrendingUp } from 'lucide-react';

// Formats price: 0 → 'Free', otherwise '$XX.XX'
const formatPrice = (price) => {
  if (!price || price === 0) return 'Free';
  return `$${Number(price).toFixed(2)}`;
};

// Format seconds → 'Xh Ym' or 'Xm'
const formatDuration = (seconds) => {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const CourseCard = ({ course, showEnrollButton = true, compact = false }) => {
  // Backend populates instructor as { _id, name, profilePicture }
  const instructor = course.instructor;
  const instructorName = instructor?.name || 'Unknown Instructor';
  const instructorAvatar =
    instructor?.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName)}&background=6366f1&color=fff`;

  // Category may be populated object { name, slug } or raw string
  const categoryName = course.category?.name || course.category || '';

  // Backend field names
  const rating = course.averageRating || 0;
  const students = course.totalEnrollments || 0;
  const duration = formatDuration(course.totalDuration);

  // Difficulty → display label (backend stores lowercase)
  const difficultyMap = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  const level = difficultyMap[course.difficulty] || course.difficulty || '';

  const getLevelColor = (lv) => {
    switch (lv) {
      case 'Beginner':    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Advanced':    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const renderStars = (r) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= Math.floor(r) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
        />
      ))}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
        {r > 0 ? r.toFixed(1) : 'New'}
      </span>
    </div>
  );

  if (compact) {
    return (
      <Link
        to={`/courses/${course._id}`}
        className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-md"
      >
        <img
          src={course.thumbnail || `https://picsum.photos/seed/${course._id}/80/80`}
          alt={course.title}
          className="w-20 h-20 object-cover rounded-lg"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${course._id}/80/80`; }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{course.title}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{instructorName}</p>
          <div className="flex items-center space-x-2 mt-2">{renderStars(rating)}</div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatPrice(course.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 group">
      {/* Thumbnail */}
      <Link to={`/courses/${course._id}`} className="block relative overflow-hidden">
        <img
          src={course.thumbnail || `https://picsum.photos/seed/${course._id}/800/450`}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${course._id}/800/450`; }}
        />
        {level && (
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(level)}`}>{level}</span>
          </div>
        )}
        {categoryName && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-semibold bg-black/50 text-white rounded-full backdrop-blur-sm">
              {categoryName}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link to={`/courses/${course._id}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {course.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{course.description}</p>

        {/* Instructor */}
        <div className="flex items-center space-x-2 mb-4">
          <img
            src={instructorAvatar}
            alt={instructorName}
            className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName)}&background=6366f1&color=fff`; }}
          />
          <p className="text-sm font-medium text-gray-900 dark:text-white">{instructorName}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
            {duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{students} students</span>
            </div>
          </div>
          {renderStars(rating)}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatPrice(course.price)}</p>
          {showEnrollButton && (
            <Link
              to={`/courses/${course._id}`}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>View Course</span>
              <TrendingUp className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
