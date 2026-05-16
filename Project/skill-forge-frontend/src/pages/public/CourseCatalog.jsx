import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import CourseCard from '../../components/shared/CourseCard';
import Loader from '../../components/shared/Loader';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
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

      const coursesData = coursesRes.data?.data?.courses || [];
      const categoriesData = categoriesRes.data?.data || [];
      
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

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (course) => (course.category?.name || course.category) === selectedCategory
      );
    }

    if (priceFilter === 'free') {
      filtered = filtered.filter((course) => (course.price || 0) === 0);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter((course) => (course.price || 0) > 0);
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
      <div className="min-h-screen bg-white dark:bg-[#0a0c12] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0c12]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Explore <span className="text-primary-600">Data Science</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
            Discover {courses.length} specialized courses and labs
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 mb-12">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by topic, library, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-8 text-lg rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 shadow-inner"
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Specialized Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 translate-y-[-2px]'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category === 'all' ? 'All Path' : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
               <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">Pricing</span>
                  {['all', 'free', 'paid'].map(p => (
                    <button 
                      key={p} 
                      onClick={() => setPriceFilter(p)}
                      className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tighter border-2 transition-all ${priceFilter === p ? 'border-primary-500 text-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                    >
                      {p}
                    </button>
                  ))}
               </div>
               
               {hasActiveFilters && (
                 <button onClick={clearFilters} className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-1 hover:underline">
                    <X size={14} /> Clear All
                 </button>
               )}
            </div>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <CourseCard key={course?._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
            <Search className="w-16 h-16 mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No results found</h3>
            <p className="text-gray-500 mt-2 mb-8">Try different keywords or filters.</p>
            <Button onClick={clearFilters} variant="outline" className="rounded-xl border-2 font-bold px-8">
               Clear All Filters
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CourseCatalog;
