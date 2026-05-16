import { CheckCircle } from 'lucide-react';

const ProgressBar = ({ 
  progress = 0, 
  height = 'h-2',
  showPercentage = true,
  showIcon = false,
  variant = 'default', // default, success, warning, error
  animated = true,
  size = 'md' // sm, md, lg
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const isComplete = normalizedProgress === 100;

  // Get color based on variant or progress
  const getColor = () => {
    if (variant === 'success' || isComplete) {
      return 'bg-green-500';
    } else if (variant === 'warning') {
      return 'bg-yellow-500';
    } else if (variant === 'error') {
      return 'bg-red-500';
    } else {
      // Default: color based on progress
      if (normalizedProgress < 30) return 'bg-red-500';
      if (normalizedProgress < 70) return 'bg-yellow-500';
      return 'bg-green-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-1.5',
          text: 'text-xs',
        };
      case 'lg':
        return {
          container: 'h-3',
          text: 'text-base',
        };
      default: // md
        return {
          container: 'h-2',
          text: 'text-sm',
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const barColor = getColor();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showPercentage && (
          <div className="flex items-center space-x-2">
            {showIcon && isComplete && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span className={`font-semibold text-gray-700 dark:text-gray-300 ${sizeClasses.text}`}>
              {normalizedProgress}%
            </span>
          </div>
        )}
      </div>
      
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses.container}`}>
        <div
          className={`${barColor} ${sizeClasses.container} rounded-full transition-all duration-500 ease-out ${
            animated ? 'animate-pulse-slow' : ''
          }`}
          style={{ width: `${normalizedProgress}%` }}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

// Circular Progress variant
export const CircularProgress = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  showPercentage = true 
}) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedProgress / 100) * circumference;

  const getColor = () => {
    if (normalizedProgress === 100) return '#10b981'; // green
    if (normalizedProgress >= 70) return '#3b82f6'; // blue
    if (normalizedProgress >= 30) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {normalizedProgress}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
