import { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../homepage/Navbar';
import { FooterPrime } from '../../components/presentation/FooterPrime';
import SearchFilters from './SearchFilters';
import Loader from '../layout/Loader';
import { HeroBanner } from '../homepage/HeroBanner';
import { AllAbouJumiaFooter } from '../presentation/AllAbouJumiaFooter';
import SponsoredProducts from '../../components/presentation/SponseredProducts'
import AdsSliderPage from '../sliders/AdsSliderPage';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveAds } from '../../store/actions/adActions';
import axios from 'axios';
import SimilarProducts from '../products/SimilarProducts';

const SearchResults = () => {
  const { loading, ads, error } = useSelector((state) => state.adData);
  const { searchResults, handleSearch, isLoading } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
      const handleScrollToTop = () => {
        window.scrollTo(0, 0);
      };
  
      handleScrollToTop();
    }, []);
    
  useEffect(() => {
    dispatch(getActiveAds());
    const query = new URLSearchParams(location.search).get('query');
    const category = new URLSearchParams(location.search).get('category');

    if (query) {
      setDebouncedSearch(query);
      setSearchQuery(query);
      handleSearch(query);
    } else if (category) {
      handleSearch('', { category: category });
      setSearchQuery('');
    }
  }, [location.search]);

  // Handle search input changes and fetch suggestions
  const handleSearchInput = async (value) => {
    setSearchQuery(value);
    if (value.length >= 2) {
      try {
        setShowLoader(true);
        const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/products/suggestions`, {
          params: { query: value }
        });
        
        if (data.success && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setShowLoader(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/single-product/${productId}`);
  };

  if (showLoader) {
    return <div className="p-4"><Loader /></div>;
  }

  return (
    <div>
      <HeroBanner />
      <Navbar />

      {/* <div className="flex flex-col md:flex-row container mx-auto px-4 space-y-4 md:space-y-0 md:space-x-4 overflow-hidden mb-10">
        <CategoryNavigationMenu />
        <WelcomeSalesSlider />
        <HelpCenterCard />
      </div> */}
      {/* <AdsSliderPage ads={ads} /> */}

      <div className="max-w-7xl mx-auto p-4 mt-10">
        {/* Search input with suggestions */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search products..."
          />
          
          {suggestions.length > 0 && searchQuery.length >= 2 && (
            <div 
              className="fixed left-0 right-0 mx-4 md:mx-auto md:relative md:left-auto md:right-auto bg-white border rounded-lg shadow-lg mt-1 z-[99999]"
              style={{ maxWidth: 'calc(100% - 2rem)' }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4">Search Results</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Fixed position on desktop */}
          <div className="md:w-64 md:sticky md:top-4 h-fit">
            <SearchFilters />
          </div>

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="border rounded-lg p-4 animate-pulse">
                    <div className="bg-gray-200 aspect-square mb-2 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : searchResults?.products?.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-xl text-gray-600">No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {searchResults?.products?.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-square mb-2">
                      {product.images?.[0]?.url ? (
                        <Link to={`/single-product/${product._id}`}>
                        <img
                          // src={product.images[0].url}
                          src={`${import.meta.env.VITE_APP}/${product.images[0]?.url.replace(/\\/g, '/')}`}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onLoad={(e) => e.target.classList.remove('animate-pulse')}
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                            e.target.classList.remove('animate-pulse');
                          }}
                        />
                        </Link>
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg" />
                      )}
                    </div>
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-gray-600"><span className='text-sm'>A.D </span>{product.price}</p>
                    {product.discount > 0 && (
                      <div className="text-green-600 text-sm">
                        {product.discount}% OFF
                      </div>
                    )}
                    <div className="text-yellow-400 text-sm flex items-center gap-1">
                      {'★'.repeat(Math.floor(product.ratings))}
                      <span className="text-gray-400">
                        {'★'.repeat(5 - Math.floor(product.ratings))}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">
                        ({product.reviews.length})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SponsoredProducts />
      <div className='p-4'>
      <SimilarProducts />
      </div>
      
      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );

};

export default SearchResults; 