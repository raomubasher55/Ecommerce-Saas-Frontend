import { useRef, useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaRegEye, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';

export default function RelatedViewProducts({ Products, store }) {
  const productList = Products?.products?.length ? Products.products : [];
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const { selectedLanguage, translateText } = useLanguage();
  
  const [translatedContent, setTranslatedContent] = useState({
    title: "Customers who viewed this item also viewed",
    noProducts: "No related products available",
    noImage: "No Image Available",
    stock: "Stock",
    outOfStock: "Out of Stock",
    wishlistLimit: "You have already added 4 products to your wishlist.",
    addedToWishlist: "Product added to wishlist!",
    alreadyInWishlist: "This product is already in your wishlist."
  });

  const [translatedProductNames, setTranslatedProductNames] = useState([]);

  // Translate static content
  useEffect(() => {
    const translateStaticContent = async () => {
      const translations = await Promise.all([
        translateText("Customers who viewed this item also viewed"),
        translateText("No related products available"),
        translateText("No Image Available"),
        translateText("Stock"),
        translateText("Out of Stock"),
        translateText("You have already added 4 products to your wishlist."),
        translateText("Product added to wishlist!"),
        translateText("This product is already in your wishlist.")
      ]);
      
      setTranslatedContent({
        title: translations[0],
        noProducts: translations[1],
        noImage: translations[2],
        stock: translations[3],
        outOfStock: translations[4],
        wishlistLimit: translations[5],
        addedToWishlist: translations[6],
        alreadyInWishlist: translations[7]
      });
    };
    
    translateStaticContent();
  }, [selectedLanguage, translateText]);

  // Translate product names
  useEffect(() => {
    const translateProductNames = async () => {
      const names = await Promise.all(
        productList.map(product => 
          product.name ? translateText(product.name) : Promise.resolve("")
        )
      );
      setTranslatedProductNames(names);
    };
    
    translateProductNames();
  }, [productList, selectedLanguage, translateText]);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleFavorite = (product) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.length >= 4) {
      toast.warning(translatedContent.wishlistLimit);
      return;
    }
    const isProductInWishlist = wishlist.some(item => item._id === product._id);
    if (!isProductInWishlist) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success(translatedContent.addedToWishlist);
    } else {
      toast.info(translatedContent.alreadyInWishlist);
    }
  };

  const handleRendring = (id) => {
    window.scrollTo(0, 0);
    navigate(`/single-product/${id}`)
  }

  if (productList.length === 0) {
    return <div className="mt-10 text-center text-gray-500">{translatedContent.noProducts}</div>;
  }

  return (
    <div className="relative mt-10 rounded p-4 shadow-lg" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: '#4222C4' }}>
          {translatedContent.title}
        </h2>
      </div>

      <div ref={sliderRef} className="overflow-hidden flex space-x-4 scrollbar-none">
        {productList.map((product, index) => (
          <div key={product._id} id='prodcut_card' className="relative overflow-hidden flex-none cursor-pointer w-40 p-4 bg-white border rounded-lg shadow-lg">
            <div className="relative w-full h-30 bg-gray-200">
              {product.images?.length > 0 ? (
                <img
                  src={`${import.meta.env.VITE_APP}/${product?.images[0].url.replace(/\\/g, "/")}`}
                  alt={translatedProductNames[index] || product.name}
                  className="w-full h-[100px] object-cover rounded"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {translatedContent.noImage}
                </div>
              )}
              {product.discountPercentage ? (
                <div className="absolute top-[-12px] left-1 bg-red-600 text-white text-xs py-1 px-2 rounded-full">
                  -{product.discountPercentage}%
                </div>
              ) : null}
            </div>
            <div className="p-2 mt-1">
              <h3 className="text-[16px] font-bold text-gray-800">
                {translatedProductNames[index] || product.name}
              </h3>
              {product.discountedPrice && product.discountedPrice < product.price ? (
                <div className='flex items-end gap-2'>
                  <p className="text-green-600 font-bold text-[16px] mt-1"><span className='text-sm'>A.D </span> {product.discountedPrice}</p>
                  <p className="text-gray-400 line-through mt-1 text-sm">{product.price}</p>
                </div>
              ) : (
                <p className="text-green-600 font-bold text-[16px] mt-1"><span className='text-sm'>A.D </span> {product.price}</p>
              )}
              <p
                className={`font-bold text-sm mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {product.stock > 0 
                  ? `${translatedContent.stock}: ${product.stock}` 
                  : translatedContent.outOfStock}
              </p>
            </div>
            <h1 className='absolute left-0 text-center w-full bottom-1 text-sm font-bold text-[#4222C4]'>{store}</h1>

            {/* Action Buttons */}
            <div id='viewFav-Icons' className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleFavorite(product)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                aria-label="Add to wishlist"
              >
                <FaHeart />
              </button>
              <button
                onClick={() => handleRendring(product._id)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md"
                aria-label="View product"
              >
                <FaRegEye />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={slideLeft} 
        className="absolute top-1/2 left-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Slide left"
      >
        <FaArrowLeft className="text-xl" style={{ color: '#4222C4' }} />
      </button>
      <button 
        onClick={slideRight} 
        className="absolute top-1/2 right-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Slide right"
      >
        <FaArrowRight className="text-xl" style={{ color: '#4222C4' }} />
      </button>
    </div>
  );
}