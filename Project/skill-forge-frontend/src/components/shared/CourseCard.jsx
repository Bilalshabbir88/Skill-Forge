import { Link } from 'react-router-dom';
import { Star, Clock, Users, TrendingUp, Play } from 'lucide-react';

// Formats price: 0 → 'Free', otherwise '$XX.XX'
const formatPrice = (price) => {
  if (!price || price === 0) return 'FREE';
  return `$${Number(price).toFixed(2)}`;
};

const CourseCard = ({ course, enrollment = null, onClick = null }) => {
  if (!course) return null;

  const instructorName = course.instructor?.name || 'Expert Instructor';
  const instructorAvatar = course.instructor?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName)}&background=6366f1&color=fff`;
  const categoryName = course.category?.name || 'Data Science';
  const rating = course.averageRating || 5.0;
  const students = course.totalEnrollments || 0;
  const duration = course.totalDuration ? `${Math.round(course.totalDuration / 3600)}h ${Math.floor((course.totalDuration % 3600) / 60)}m` : null;
  const level = course.difficulty || 'Beginner';

  const getLevelColor = (lvl) => {
    switch (lvl.toLowerCase()) {
      case 'beginner': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'intermediate': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'advanced': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const renderStars = (rat) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-black text-gray-700 dark:text-gray-300">{rat.toFixed(1)}</span>
      </div>
    );
  };

  const cardContent = (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary-500/50 group flex flex-col h-full relative">
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={course.thumbnail || `https://picsum.photos/seed/${course._id}/800/450`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${course._id}/800/450`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
           <span className="text-white font-black text-[10px] tracking-[0.2em] uppercase flex items-center gap-2">
             Jump into lab <Play className="w-3 h-3 fill-current" />
           </span>
        </div>
        <div className="absolute top-4 left-4 flex gap-2">
           <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md border ${getLevelColor(level)}`}>
             {level}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
           <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{categoryName}</span>
           {renderStars(rating)}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-tight min-h-[3.5rem]">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center space-x-3 mt-4 mb-8">
          <img
            src={instructorAvatar}
            alt=""
            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
          />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{instructorName}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
           <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{students}</span>
              </div>
              {duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{duration}</span>
                </div>
              )}
           </div>
           
           <div className="text-right">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Enrolling Path</p>
              <p className="text-xl font-black text-primary-600 dark:text-primary-400 leading-none">{formatPrice(course.price)}</p>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link 
      to={enrollment ? `/student/courses/${course._id}` : `/courses/${course._id}`} 
      onClick={onClick}
      className="block h-full"
    >
      {cardContent}
    </Link>
  );
};

export default CourseCard;
