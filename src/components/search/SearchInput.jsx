import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/products/suggestions`, {
        params: { query: searchQuery }
      });
      
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Only fetch suggestions if query is at least 2 characters
    if (value.length >= 2) {
      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(query.trim())}&page=1&limit=10`);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
    setSuggestions([]); // Clear suggestions after selection
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('keyword') || '';
    const initialPage = Number(params.get('page')) || 1;

    console.log('Initial Query:', initialQuery);
    console.log('Initial Page:', initialPage);

    if (initialQuery || initialPage) {
        console.log('Calling handleSearch...');
        handleSearch(initialQuery, {
            page: initialPage,
            limit: 10,
            ...Object.fromEntries(params.entries())
        });
    }
  }, []); // Empty dependency array = runs once on mount

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search products..."
        />
      </form>

      {/* Show suggestions only when there are suggestions and query has 2+ characters */}
      {suggestions.length > 0 && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && query.length >= 2 && (
        <div className="absolute right-3 top-3">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default SearchInput; 