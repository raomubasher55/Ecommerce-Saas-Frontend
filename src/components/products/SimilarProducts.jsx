import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStoreProducts } from '../../store/actions/storeActions';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function SimilarProducts() {
  const dispatch = useDispatch();
  const { loading, stores, products, error } = useSelector(state => state.ProductsByReducer);

  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchStoreProducts());
  }, [dispatch]);

  useEffect(() => {
    if (stores.length && products.length) {
      const flattenedProducts = stores.flatMap(store =>
        products.filter(product => store.products.includes(product._id)).map(product => ({
          ...product,
          storeName: store.name,
        }))
      );
      setSimilarProducts(flattenedProducts);
    }
  }, [stores, products]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5, 
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="relative mt-10 rounded p-4 shadow-lg"
      style={{ boxShadow: '1px 1px 20px 1px lightgray' }}
    >
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: '#4222C4' }}>
          You may also like
        </h2>
      </div>

      <Slider {...settings}>
        {similarProducts.map((product) => (
          <Link
            key={product._id}
            to={`/single-product/${product._id}`}
            className="relative flex-none cursor-pointer w-full md:w-1/5  md:h-[270px] p-4 bg-white border rounded-lg shadow-lg"
          >
            <div className="relative w-full h-30 bg-gray-200">
              <img
                src={`${import.meta.env.VITE_APP}/${product?.images[0]?.url?.replace(/\\/g, '/')}`}
                alt={product.name}
                className="w-full h-[80px] md:h-[120px] object-cover rounded"
              />
              {product.discountPercentage && (
                <div
                  className="absolute top-[-20px] right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                >
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>
            <div className="p-2 mt-2">
              <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
              <p className="text-green-600 font-bold text-xl mt-1"><span className='text-sm'>A.D </span>{product.price}</p>
              {product.discountPercentage != null && (
                <p className="text-gray-400 line-through mt-1"><span className='text-sm'>A.D </span>{product.discountedPrice}</p>
              )}
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} bg-gray-200 hover:bg-gray-300 p-2 rounded-full`}
      style={{ ...style, right: '10px', zIndex: 1 }}
      onClick={onClick}
    >
      <FaArrowRight className="text-xl" style={{ color: '#4222C4' }} />
    </button>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} bg-gray-200 hover:bg-gray-300 p-2 rounded-full`}
      style={{ ...style, left: '10px', zIndex: 1 }}
      onClick={onClick}
    >
      <FaArrowLeft className="text-xl" style={{ color: '#4222C4' }} />
    </button>
  );
}
