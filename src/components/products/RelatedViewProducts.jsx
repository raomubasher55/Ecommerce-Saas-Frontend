import { useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaRegEye, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RelatedViewProducts({ Products, store }) {
  const productList = Products?.products?.length ? Products.products : [];
  const sliderRef = useRef(null);
  const navigate = useNavigate();

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
      toast.warning("You have already added 4 products to your wishlist.");
      return;
    }
    const isProductInWishlist = wishlist.some(item => item._id === product._id);
    if (!isProductInWishlist) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success("Product added to wishlist!");
    } else {
      toast.info("This product is already in your wishlist.");
    }
  };

  const handleRendring = (id) => {
    window.scrollTo(0, 0);
    navigate(`/single-product/${id}`)
  }

  if (productList.length === 0) {
    return <div className="mt-10 text-center text-gray-500">No related products available.</div>;
  }

  return (
    <div className="relative mt-10 rounded p-4 shadow-lg" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: '#4222C4' }}>
          Customers who viewed this item also viewed
        </h2>
      </div>

      <div ref={sliderRef} className="overflow-hidden flex space-x-4 scrollbar-none">
        {productList.map((product) => (
          <div key={product._id} id='prodcut_card' className="relative overflow-hidden flex-none cursor-pointer w-40 p-4 bg-white border rounded-lg shadow-lg">
            <div className="relative w-full h-30 bg-gray-200">
              {product.images?.length > 0 ? (
                <img
                  src={`${import.meta.env.VITE_APP}/${product?.images[0].url.replace(/\\/g, "/")}`}
                  alt={product.name}
                  className="w-full h-[100px] object-cover rounded"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
              {product.discountPercentage ? (
                <div className="absolute top-[-12px] left-1 bg-red-600 text-white text-xs py-1 px-2 rounded-full">
                  -{product.discountPercentage}%
                </div>
              ) : null}
            </div>
            <div className="p-2 mt-1">
              <h3 className="text-[16px] font-bold text-gray-800">{product.name}</h3>
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
                {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
              </p>
            </div>
            <h1 className='absolute left-0 text-center w-full bottom-1 text-sm font-bold text-[#4222C4]'>{store}</h1>

            {/* Action Buttons */}
            <div id='viewFav-Icons' className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleFavorite(product)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
              >
                <FaHeart />
              </button>
              <button
                onClick={() => handleRendring(product._id)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md"
              >
                <FaRegEye />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={slideLeft} className="absolute top-1/2 left-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300">
        <FaArrowLeft className="text-xl" style={{ color: '#4222C4' }} />
      </button>
      <button onClick={slideRight} className="absolute top-1/2 right-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300">
        <FaArrowRight className="text-xl" style={{ color: '#4222C4' }} />
      </button>
    </div>
  );
}
