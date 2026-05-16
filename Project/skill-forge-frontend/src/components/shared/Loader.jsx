import { Loader2 } from 'lucide-react';

const Loader = ({ 
  size = 'md', // sm, md, lg, xl
  fullScreen = false,
  text = '',
  variant = 'primary' // primary, white, dark
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-12 h-12';
      case 'xl':
        return 'w-16 h-16';
      default: // md
        return 'w-8 h-8';
    }
  };

  const getColorClasses = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'dark':
        return 'text-gray-900 dark:text-white';
      default: // primary
        return 'text-primary-600 dark:text-primary-400';
    }
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 
        className={`${getSizeClasses()} ${getColorClasses()} animate-spin`}
      />
      {text && (
        <p className={`text-sm font-medium ${getColorClasses()}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/75 dark:bg-gray-900/75 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton Loader for content placeholders
export const SkeletonLoader = ({ variant = 'default' }) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";

  if (variant === 'card') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className={`${baseClasses} h-48 w-full`} />
        <div className="p-5 space-y-3">
          <div className={`${baseClasses} h-4 w-3/4 rounded`} />
          <div className={`${baseClasses} h-4 w-1/2 rounded`} />
          <div className={`${baseClasses} h-8 w-full rounded mt-4`} />
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        <div className={`${baseClasses} h-4 w-full rounded`} />
        <div className={`${baseClasses} h-4 w-5/6 rounded`} />
        <div className={`${baseClasses} h-4 w-4/6 rounded`} />
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className="flex items-center space-x-3">
        <div className={`${baseClasses} w-12 h-12 rounded-full`} />
        <div className="flex-1 space-y-2">
          <div className={`${baseClasses} h-4 w-3/4 rounded`} />
          <div className={`${baseClasses} h-3 w-1/2 rounded`} />
        </div>
      </div>
    );
  }

  // Default
  return <div className={`${baseClasses} h-20 w-full rounded-lg`} />;
};

// Dots Loader
export const DotsLoader = ({ variant = 'primary' }) => {
  const getColorClasses = () => {
    switch (variant) {
      case 'white':
        return 'bg-white';
      case 'dark':
        return 'bg-gray-900 dark:bg-white';
      default:
        return 'bg-primary-600 dark:bg-primary-400';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${getColorClasses()} animate-bounce`}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

// Spinner with overlay (for button loading states)
export const ButtonLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="w-5 h-5 text-white animate-spin" />
    </div>
  );
};

export default Loader;
