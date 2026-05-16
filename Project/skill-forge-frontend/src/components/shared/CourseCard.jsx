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
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary-500/50 group flex flex-col h-full">
      {/* Thumbnail */}
      <Link to={`/courses/${course._id}`} className="block relative overflow-hidden aspect-video">
        <img
          src={course.thumbnail || `https://picsum.photos/seed/${course._id}/800/450`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${course._id}/800/450`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
           <span className="text-white font-black text-sm tracking-widest uppercase flex items-center gap-2">
             Quick Preview <Play className="w-4 h-4 fill-current" />
           </span>
        </div>
        {level && (
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md ${getLevelColor(level)}`}>
              {level}
            </span>
          </div>
        )}
        {categoryName && (
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-black/40 text-white rounded-full backdrop-blur-md border border-white/10">
              {categoryName}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <Link to={`/courses/${course._id}`} className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-tight">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed font-medium">
            {course.description}
          </p>
        </Link>

        {/* Instructor */}
        <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent group-hover:border-gray-100 dark:group-hover:border-gray-700 transition-all">
          <img
            src={instructorAvatar}
            alt={instructorName}
            className="w-10 h-10 rounded-xl border-2 border-white dark:border-gray-700 object-cover shadow-sm"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName)}&background=6366f1&color=fff`; }}
          />
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Instructor</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{instructorName}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            {duration && (
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{duration}</span>
              </div>
            )}
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{students} Students</span>
            </div>
          </div>
          {renderStars(rating)}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Enrolling Price</p>
             <p className="text-2xl font-black text-primary-600 dark:text-primary-400">{formatPrice(course.price)}</p>
          </div>
          {showEnrollButton && (
            <Link
              to={`/courses/${course._id}`}
              className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 active:scale-95 flex items-center space-x-2 uppercase tracking-widest"
            >
              <span>Explore</span>
              <TrendingUp className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
