import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import CourseCard from '../../components/shared/CourseCard';
import Loader from '../../components/shared/Loader';
import api from '../../api/api';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, priceFilter, courses]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, categoriesRes] = await Promise.all([
        api.get('/courses', { params: { limit: 100 } }),
        api.get('/categories')
      ]);

      const coursesData = coursesRes.data.data?.courses || [];
      const categoriesData = categoriesRes.data.data || [];
      
      setCourses(coursesData);
      setFilteredCourses(coursesData);
      setCategories(['all', ...categoriesData.map(c => c.name)]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter — category is populated: { name, slug }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (course) => (course.category?.name || course.category) === selectedCategory
      );
    }

    // Price filter
    if (priceFilter === 'free') {
      filtered = filtered.filter((course) => course.price === 0);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter((course) => course.price > 0);
    }

    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceFilter('all');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || priceFilter !== 'all';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Courses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover {courses.length} courses to boost your skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-6 text-base"
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Filter className="inline w-4 h-4 mr-2" />
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className={`cursor-pointer px-4 py-2 text-sm ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Price
              </label>
              <div className="flex gap-2">
                <Badge
                  variant={priceFilter === 'all' ? 'default' : 'outline'}
                  className={`cursor-pointer px-4 py-2 ${
                    priceFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setPriceFilter('all')}
                >
                  All Prices
                </Badge>
                <Badge
                  variant={priceFilter === 'free' ? 'default' : 'outline'}
                  className={`cursor-pointer px-4 py-2 ${
                    priceFilter === 'free'
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setPriceFilter('free')}
                >
                  Free
                </Badge>
                <Badge
                  variant={priceFilter === 'paid' ? 'default' : 'outline'}
                  className={`cursor-pointer px-4 py-2 ${
                    priceFilter === 'paid'
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setPriceFilter('paid')}
                >
                  Paid
                </Badge>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                <X className="w-4 h-4 mr-2" />
                Clear all filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'}
          </p>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;
