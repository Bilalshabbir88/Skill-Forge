// Format date to readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Format date to short format
export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Calculate time ago
export const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return 'just now';
};

// Format duration in minutes to readable format
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours}h ${mins}min`;
};

// Format price
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Calculate progress percentage
export const calculateProgress = (completedLessons, totalLessons) => {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Generate random color for avatars
export const getRandomColor = () => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // At least 8 characters
  return password.length >= 8;
};

// Generate verification code for certificates
export const generateVerificationCode = (userId, courseId) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `SF-${timestamp}-${random}`.toUpperCase();
};

// Calculate quiz score
export const calculateQuizScore = (userAnswers, correctAnswers) => {
  if (!userAnswers || userAnswers.length === 0) return 0;
  
  let correct = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      correct++;
    }
  });
  
  return Math.round((correct / correctAnswers.length) * 100);
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

// Filter courses by search term
export const filterCourses = (courses, searchTerm, category = 'all') => {
  let filtered = courses;

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter((course) => course.category === category);
  }

  // Filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term)
    );
  }

  return filtered;
};

// Get unique categories from courses
export const getUniqueCategories = (courses) => {
  const categories = courses.map((course) => course.category);
  return [...new Set(categories)].sort();
};

export default {
  formatDate,
  formatDateShort,
  timeAgo,
  formatDuration,
  formatPrice,
  calculateProgress,
  truncateText,
  getRandomColor,
  getInitials,
  isValidEmail,
  isStrongPassword,
  generateVerificationCode,
  calculateQuizScore,
  sortBy,
  filterCourses,
  getUniqueCategories,
};
