import { useState, useEffect } from 'react';
import { Database, Search, Download, ExternalLink, Filter, Tag } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../api/api';
import Loader from '../../components/shared/Loader';

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/datasets', { params: { search: searchTerm } });
      setDatasets(res.data.data || []);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDatasets();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
            <Database className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Data Science Library</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access a curated collection of open-source datasets for your machine learning and analysis projects.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by title, description, or tags (e.g. 'titanic', 'weather')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-7 text-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm"
            />
          </div>
          <Button type="submit" size="lg" className="px-8 h-auto font-bold bg-primary-600 hover:bg-primary-700">
            Search
          </Button>
        </form>

        {/* Grid */}
        {datasets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {datasets.map((ds) => (
              <div key={ds._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
                    <Database className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest bg-gray-50 dark:bg-gray-800">
                    {ds.tags?.[0] || 'Dataset'}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {ds.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-1">
                  {ds.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {ds.tags?.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="flex items-center text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-md">
                      <Tag className="w-3 h-3 mr-1" /> {tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Button asChild variant="default" className="flex-1 bg-gray-900 dark:bg-white dark:text-gray-950">
                    <a href={ds.fileUrl} target="_blank" rel="noreferrer">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </a>
                  </Button>
                  {ds.sourceUrl && (
                    <Button asChild variant="outline" className="flex-1">
                      <a href={ds.sourceUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" /> Source
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No datasets found</h3>
            <p className="text-gray-500">Try a different search term or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Datasets;