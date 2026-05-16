import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, resetToSystem } = useTheme();
  const isOverride = !!localStorage.getItem('skillforge-theme');

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-gray-600 dark:text-gray-400" />
        )}
      </button>
      {isOverride && (
        <button
          onClick={resetToSystem}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Follow system preference"
          aria-label="Reset to system theme"
        >
          <Monitor size={16} className="text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default ThemeToggle;
