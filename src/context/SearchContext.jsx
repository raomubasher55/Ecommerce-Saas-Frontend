import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    products: [],
    count: 0,
    total: 0,
    resPerPage: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    price: {
      gte: '',
      lte: ''
    },
    ratings: {
      gte: ''
    },
    page: 1,
    limit: 10
  });

  const handleSearch = async (query = '', newFilters = {}) => {
    setIsLoading(true);
    // console.log("newFilters", newFilters);
    try {
      const params = {
        keyword: query || undefined,
        page: newFilters.page || 1,
        limit: newFilters.limit || 10,
        ...(newFilters.price?.gte && !isNaN(newFilters.price.gte) && newFilters.price.gte !== ''
          ? { 'price[gte]': Number(newFilters.price.gte) }
          : {}),
        ...(newFilters.price?.lte && !isNaN(newFilters.price.lte) && newFilters.price.lte !== ''
          ? { 'price[lte]': Number(newFilters.price.lte) }
          : {}),
        ...(newFilters.ratings?.gte && !isNaN(newFilters.ratings.gte) && newFilters.ratings.gte !== ''
          ? { 'ratings[gte]': Number(newFilters.ratings.gte) }
          : {}),
        ...(newFilters.category && newFilters.category !== '' ? { category: newFilters.category } : {}),
        ...(newFilters.subcategory && newFilters.subcategory !== '' ? { subcategory: newFilters.subcategory } : {}),
        ...(newFilters.sort && newFilters.sort !== '' ? { sort: newFilters.sort } : {}),
      };
  
      // Remove undefined values
      Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
  
      // console.log("params", params);
  
      // Manually construct the query string without encoding brackets
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
  
      const baseUrl = `${import.meta.env.VITE_APP}/api/v1/products`;
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
      // console.log('Request URL:', url);
  
      const response = await axios.get(url);
  
      // For browser history, we can still use URLSearchParams (encoded) or match the API format
      const searchParams = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      // Only update the URL if the search parameters have changed
      // if (searchParams !== currentSearchParams) {
      //   window.history.replaceState({}, '', `/search?${searchParams}`);
      //   currentSearchParams = searchParams; // Store the current search params
      // }
  
      setSearchResults({
        products: response.data.products,
        count: response.data.count,
        total: response.data.total,
        resPerPage: response.data.resPerPage,
      });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ products: [], count: 0, total: 0, resPerPage: 10 });
    } finally {
      setIsLoading(false);
    }
  };


  // const handleSearch = async (query = '', newFilters = {}) => {
  //   setIsLoading(true);
  //   console.log("newFilters", newFilters);
  //   try {
  //     const params = {
  //       keyword: query || undefined,
  //       page: newFilters.page || 1,
  //       limit: newFilters.limit || 10,
  //       ...(newFilters.price?.gte && !isNaN(newFilters.price.gte) && newFilters.price.gte !== ''
  //         ? { 'price[gte]': Number(newFilters.price.gte) }
  //         : {}),
  //       ...(newFilters.price?.lte && !isNaN(newFilters.price.lte) && newFilters.price.lte !== ''
  //         ? { 'price[lte]': Number(newFilters.price.lte) }
  //         : {}),
  //       ...(newFilters.ratings?.gte && !isNaN(newFilters.ratings.gte) && newFilters.ratings.gte !== ''
  //         ? { 'ratings[gte]': Number(newFilters.ratings.gte) }
  //         : {}),
  //       ...(newFilters.category && newFilters.category !== '' ? { category: newFilters.category } : {}),
  //       ...(newFilters.subcategory && newFilters.subcategory !== '' ? { subcategory: newFilters.subcategory } : {}),
  //       ...(newFilters.sort && newFilters.sort !== '' ? { sort: newFilters.sort } : {}),
  //     };
  
  //     // Remove undefined values
  //     Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
  
  //     console.log("params", params);
  
  //     // Manually construct query string without encoding brackets
  //     const queryString = Object.entries(params)
  //       .map(([key, value]) => `${key}=${value}`)
  //       .join('&');
  
  //     const baseUrl = `${import.meta.env.VITE_APP}/api/v1/products`;
  //     const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  //     console.log('Request URL:', url);
  
  //     const response = await axios.get(url);
  
  //     // Update browser URL without reload (matching backend format)
  //     const searchParams = Object.entries(params)
  //       .map(([key, value]) => `${key}=${value}`)
  //       .join('&');
  //     window.history.replaceState({}, '', `/search?${searchParams}`);
  
  //     setSearchResults({
  //       products: response.data.products,
  //       count: response.data.count,
  //       total: response.data.total,
  //       resPerPage: response.data.resPerPage,
  //     });
  //   } catch (error) {
  //     console.error('Search error:', error);
  //     setSearchResults({ products: [], count: 0, total: 0, resPerPage: 10 });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const getProductsByCategory = async (categoryName) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP}/api/v1/products/category/${categoryName}`);
      if (!response.ok) throw new Error('Category search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Category search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsByStore = async (storeId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/store/${storeId}/products`);
      if (!response.ok) throw new Error('Store products fetch failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Store products error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Read initial search params from URL
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('keyword') || '';
    const initialPage = Number(params.get('page')) || 1;
    
    handleSearch(initialQuery, {
      page: initialPage,
      limit: 10,
      ...Object.fromEntries(params.entries())
    });
  }, []); // Empty dependency array = runs once on mount

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isLoading,
    filters,
    setFilters,
    handleSearch,
    getProductsByCategory,
    getProductsByStore
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use the search context
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

