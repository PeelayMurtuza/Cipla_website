import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  RefreshCw,
  TrendingUp,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  Newspaper,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';

function News() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [displayedNews, setDisplayedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(9);

  // Filter state
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const NEWS_API_KEY = '785ca99749d141babea1d3fbfb6512d3';

  const autoRefreshInterval = useRef(null);

  // Fetch all recent pharmaceutical news from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiStatus('checking');

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=pharmaceutical OR "clinical trial" OR "FDA approval" OR biotechnology OR "drug discovery" OR "medical research" OR medicine OR healthcare&language=en&sortBy=publishedAt&pageSize=100&apiKey=${NEWS_API_KEY}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`NewsAPI error: ${response.status} - ${errorData.message || 'Please check your API key'}`);
      }

      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        const processedArticles = data.articles
          .filter(article => 
            article.title && 
            article.title !== '[Removed]' && 
            article.url &&
            article.description
          )
          .map((article, index) => ({
            ...article,
            id: article.url || `news-${index}-${Date.now()}`,
            trending: index < 5, // First 5 articles as trending
            publishedDate: new Date(article.publishedAt)
          }));

        setNews(processedArticles);
        extractSources(processedArticles);
        setApiStatus('connected');
        setLastUpdated(new Date());
        setCurrentPage(1); // Reset to first page on new fetch
      } else {
        throw new Error('No recent pharmaceutical news found');
      }
      
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message);
      setApiStatus('error');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique sources from articles
  const extractSources = (articles) => {
    const uniqueSources = [...new Set(articles.map(article => article.source?.name).filter(Boolean))];
    setSources(uniqueSources.sort());
  };

  // Apply all filters and sorting
  useEffect(() => {
    let filtered = [...news];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title?.toLowerCase().includes(query) ||
        article.description?.toLowerCase().includes(query) ||
        article.content?.toLowerCase().includes(query) ||
        article.source?.name?.toLowerCase().includes(query)
      );
    }

    // Source filter
    if (selectedSources.length > 0) {
      filtered = filtered.filter(article => 
        selectedSources.includes(article.source?.name)
      );
    }

    // Date range filter
    const now = new Date();
    switch (dateRange) {
      case 'today':
        filtered = filtered.filter(article => {
          const articleDate = new Date(article.publishedAt);
          return articleDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(article => new Date(article.publishedAt) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(article => new Date(article.publishedAt) >= monthAgo);
        break;
      default:
        // 'all' - no date filtering
        break;
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
        break;
      case 'relevance':
        // Simple relevance based on search query presence in title
        if (searchQuery) {
          filtered.sort((a, b) => {
            const aTitleMatch = a.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const bTitleMatch = b.title?.toLowerCase().includes(searchQuery.toLowerCase());
            return (bTitleMatch ? 1 : 0) - (aTitleMatch ? 1 : 0);
          });
        }
        break;
      default:
        break;
    }

    setFilteredNews(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [news, searchQuery, selectedSources, dateRange, sortBy]);

  // Pagination logic
  useEffect(() => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    setDisplayedNews(filteredNews.slice(indexOfFirstArticle, indexOfLastArticle));
  }, [filteredNews, currentPage, articlesPerPage]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshInterval.current = setInterval(() => {
        fetchNews();
      }, 5 * 60 * 1000); // Refresh every 5 minutes
    }

    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, [autoRefresh]);

  // Initial fetch
  useEffect(() => {
    fetchNews();
  }, []);

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter functions
  const toggleSource = (source) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const clearAllFilters = () => {
    setSelectedSources([]);
    setDateRange('all');
    setSortBy('newest');
    setSearchQuery('');
  };

  const toggleSaveArticle = (article) => {
    setSavedArticles(prev => {
      const isSaved = prev.some(saved => saved.id === article.id);
      if (isSaved) {
        return prev.filter(saved => saved.id !== article.id);
      } else {
        return [...prev, { ...article, savedAt: new Date() }];
      }
    });
  };

  const isArticleSaved = (article) => {
    return savedArticles.some(saved => saved.id === article.id);
  };

  const shareArticle = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(article.url);
      alert('Article link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  const getImageUrl = (article) => {
    return article.urlToImage || `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80&text=${encodeURIComponent(article.title?.substring(0, 20) || 'News')}`;
  };

  // Pagination variables
  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Calculate visible page numbers for pagination
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Latest News</h2>
            <p className="text-gray-600">Fetching recent pharmaceutical updates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Newspaper className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pharma News
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Latest pharmaceutical industry updates, research breakthroughs, and healthcare innovations
          </p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            apiStatus === 'connected' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {apiStatus === 'connected' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Live API Connected
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                API Connection Issue
              </>
            )}
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-8 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search pharmaceutical news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all flex-1 lg:flex-none justify-center ${
                  showFilters 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {(selectedSources.length > 0 || dateRange !== 'all' || sortBy !== 'newest') && (
                  <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </button>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all flex-1 lg:flex-none justify-center ${
                  autoRefresh 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Auto-refresh</span>
              </button>

              <button
                onClick={fetchNews}
                className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg flex-1 lg:flex-none justify-center"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sources Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      News Sources
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {sources.map(source => (
                        <div key={source} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={source}
                            checked={selectedSources.includes(source)}
                            onChange={() => toggleSource(source)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={source} className="ml-2 text-sm text-gray-700 truncate">
                            {source}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                    </select>
                  </div>

                  {/* Sort By Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="relevance">Relevance</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                  <div className="text-sm text-gray-500">
                    {filteredNews.length} articles found
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          {lastUpdated && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span>{filteredNews.length} articles</span>
                <span className="hidden sm:inline">•</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Newspaper className="w-4 h-4" />
                <span>Real-time API Data</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Unable to Load News</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={fetchNews}
                  className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* News Grid */}
        <AnimatePresence>
          {displayedNews.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200"
            >
              <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No News Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || selectedSources.length > 0 || dateRange !== 'all'
                  ? 'No articles match your current filters. Try adjusting your search criteria.'
                  : 'No recent pharmaceutical news available at the moment.'
                }
              </p>
              {(searchQuery || selectedSources.length > 0 || dateRange !== 'all') && (
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {displayedNews.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.1, 0.5) }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-200"
                  >
                    {/* Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={getImageUrl(article)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80&text=${encodeURIComponent(article.title?.substring(0, 20) || 'News')}`;
                        }}
                      />
                      {article.trending && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Trending</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-1">
                        <button
                          onClick={() => toggleSaveArticle(article)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                            isArticleSaved(article)
                              ? 'bg-yellow-500 text-white shadow-lg'
                              : 'bg-white/90 text-gray-700 hover:bg-white'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" fill={isArticleSaved(article) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => shareArticle(article)}
                          className="p-2 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm hover:bg-white transition-all"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full line-clamp-1">
                          {article.source?.name || 'News Source'}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg sm:text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3 leading-relaxed">
                        {article.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 truncate mr-2">
                          Via {article.source?.name || 'Source'}
                        </span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold whitespace-nowrap"
                        >
                          <span>Read</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8"
                >
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * articlesPerPage) + 1} to {Math.min(currentPage * articlesPerPage, filteredNews.length)} of {filteredNews.length} articles
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {getVisiblePages().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' && goToPage(page)}
                          className={`min-w-[40px] h-10 rounded-lg border flex items-center justify-center text-sm font-medium ${
                            currentPage === page
                              ? 'bg-blue-500 text-white border-blue-500'
                              : page === '...'
                              ? 'bg-white text-gray-500 border-gray-300 cursor-default'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                          disabled={page === '...'}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Articles Per Page Selector */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Show:</span>
                    <select
                      value={articlesPerPage}
                      onChange={(e) => {
                        setArticlesPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                      <option value={18}>18</option>
                    </select>
                    <span className="text-gray-600">per page</span>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Saved Articles */}
        {savedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-2">
              <Bookmark className="text-yellow-500 w-6 h-6" />
              <span>Saved Articles ({savedArticles.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedArticles.map((article) => (
                <motion.div
                  key={`saved-${article.id}`}
                  layout
                  className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-400 hover:shadow-lg transition-shadow"
                >
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{article.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate mr-2">{article.source?.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="hidden sm:inline">Saved {formatDate(article.savedAt)}</span>
                      <button
                        onClick={() => toggleSaveArticle(article)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

export default News;