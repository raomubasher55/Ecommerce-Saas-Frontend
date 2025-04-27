import { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import { IoFilterSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '../../store/actions/categoryActions';
import Loader from '../layout/Loader';

const SearchFilters = () => {
  const { filters, setFilters, handleSearch, searchQuery, setSearchQuery } = useSearch();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: filters['price[gte]'] || '',
    max: filters['price[lte]'] || ''
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const dispatch = useDispatch();
  const { loading, categories } = useSelector((state) => state.categories);


  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Popular", value: "popular" },
    { label: "Best Rating", value: "rating" },
  ];

  const handlePriceChange = () => {
    const min = Number(priceRange.min);
    const max = Number(priceRange.max);
  
    const newFilters = {
      ...filters,
      price: {
        gte: !isNaN(min) && min > 0 ? min : undefined,
        lte: !isNaN(max) && max > 0 ? max : undefined,
      },
      page: 1,
      limit: 10,
    };
  
    setFilters(newFilters);
    handleSearch(searchQuery, newFilters);
  };

  const handleSortChange = (value) => {
    const newFilters = { ...filters, sort: value };
    setFilters(newFilters);
    handleSearch(searchQuery, newFilters);
  };

  const handleCategoryChange = (e) => {
    const category = categories.find(c => c.name === e.target.value);
    if (!category) return;
    
    const newFilters = {
      ...filters,
      category: category.name,
      subcategory: undefined
    };
    handleSearch(searchQuery, newFilters);
  };

  // const handleSubcategoryChange = (subcategory) => {
  //   const newFilters = { 
  //     ...filters,
  //     subcategory: subcategory || undefined
  //   };
  //   handleSearch(searchQuery, newFilters);
  // };

  const handleRatingChange = (rating) => {
    const newFilters = { ...filters, ratings: { gte: rating } };
    setFilters(newFilters);
    handleSearch(searchQuery, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      price: { gte: undefined, lte: undefined },
      ratings: { gte: undefined },
      category: undefined,
      subcategory: undefined,
      sort: undefined,
      page: 1,
      limit: 10,
    };
    setFilters(clearedFilters); // Update filters in context
    handleSearch(searchQuery, clearedFilters);
  };

  const handleNameSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const newFilters = {
      page: 1,
      limit: 10,
      category: '',
      price: { gte: undefined, lte: undefined }, // Reset price filters
      ratings: { gte: undefined }, // Reset ratings filter
    };
    handleSearch(query, newFilters);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center space-x-2 bg-[#4222C4] text-white px-4 py-2 rounded-lg"
        >
          <IoFilterSharp />
          <span>Filters</span>
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-4 bg-white p-4 rounded-lg shadow">
          {/* Filter Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-[#4222C4] hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Price Range</h4>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-1/2 p-2 border rounded"
              />
            </div>
            <button
              onClick={handlePriceChange}
              className="mt-2 w-full bg-[#4222C4] text-white py-2 rounded hover:bg-[#3019A0]"
            >
              Apply
            </button>
          </div>

          {/* Categories with Loading State */}
          {/* <div className="mb-6">
            <h4 className="font-medium mb-2">Categories</h4>
            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader />
                </div>
              ) : categories?.length > 0 ? (
                categories.map((category) => (
                  <div key={category._id}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="category"
                        value={category.name}
                        checked={selectedCategory === category._id}
                        onChange={handleCategoryChange}
                        className="text-[#4222C4]"
                      />
                      <span>{category.name}</span>
                    </label>
                    
                    
                    {selectedCategory === category._id && category.subcategories && (
                      <div className="ml-6 mt-2 space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <label key={subcategory._id} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="subcategory"
                              value={subcategory.name}
                              checked={selectedSubcategory === subcategory.name}
                              onChange={handleSubcategoryChange}
                              className="text-[#4222C4]"
                            />
                            <span className="text-sm">{subcategory.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No categories available</p>
              )}
            </div>
          </div> */}

          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Rating</h4>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.ratings?.gte === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="text-[#4222C4]"
                  />
                  <span>{rating}★ & above</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          {/* <div className="mb-6">
            <h4 className="font-medium mb-2">Sort By</h4>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === option.value}
                    onChange={() => handleSortChange(option.value)}
                    className="text-[#4222C4]"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2"
                >
                  <IoMdClose className="w-6 h-6" />
                </button>
              </div>
              
              {/* Mobile Filter Content - Copy desktop content here */}
              {/* ... */}
            </div>
          </div>
        </div>
      )}

      {/* <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleNameSearch}
        />
      </div> */}
    </>
  );
};

export default SearchFilters; 