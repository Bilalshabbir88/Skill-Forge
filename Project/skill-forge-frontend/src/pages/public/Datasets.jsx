import { useState, useEffect } from 'react';
import { Database, Search, Download, ExternalLink, Filter, Tag } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import api from '../../api/api';
import Loader from '../../components/shared/Loader';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

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
      setDatasets(res.data?.data || []);
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

  if (loading) return <div className="min-h-screen bg-white dark:bg-[#0a0c12] flex items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0c12]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary-50 text-primary-600 border-none px-4 py-1 font-black">OPEN DATA</Badge>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Data Science <span className="text-primary-600">Library</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Curated collection of high-quality datasets for machine learning, analysis, and visualization projects.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16 flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <Input
              type="text"
              placeholder="Search datasets (e.g. 'titanic', 'nlp')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 py-8 text-lg bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button type="submit" size="lg" className="px-10 h-auto font-black uppercase tracking-widest bg-primary-600 hover:bg-primary-700 rounded-2xl shadow-lg shadow-primary-500/30">
            Search
          </Button>
        </form>

        {/* Grid */}
        {datasets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {datasets.map((ds) => (
              <div key={ds?._id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 flex flex-col hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 blur-2xl rounded-full translate-x-8 -translate-y-8"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600">
                    <Database className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-gray-50 dark:bg-gray-800 border-none px-3 py-1">
                    {ds.tags?.[0] || 'Dataset'}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors">
                  {ds.title}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-8 flex-1 font-medium leading-relaxed">
                  {ds.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {ds.tags?.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[9px] font-black text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10 px-3 py-1 rounded-lg">
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-50 dark:border-gray-800">
                  <Button asChild variant="default" className="flex-1 bg-gray-900 dark:bg-white dark:text-gray-950 h-12 rounded-xl font-bold">
                    <a href={ds.fileUrl} target="_blank" rel="noreferrer">
                      <Download className="w-4 h-4 mr-2" /> Get Data
                    </a>
                  </Button>
                  {ds.sourceUrl && (
                    <Button asChild variant="outline" className="h-12 rounded-xl px-4 border-2">
                      <a href={ds.sourceUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800 shadow-inner">
            <Search className="w-20 h-20 mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">No datasets found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Datasets;
