import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStoreProducts } from '../../store/actions/storeActions';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function SimilarProducts() {
  const dispatch = useDispatch();
  const { loading, stores, products, error } = useSelector(state => state.ProductsByReducer);
  const { selectedLanguage, translateText } = useLanguage();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [translatedContent, setTranslatedContent] = useState({
    title: "You may also like",
    loading: "Loading...",
    error: "Error",
    discountLabel: "% OFF"
  });
  const [translatedProductNames, setTranslatedProductNames] = useState([]);

  useEffect(() => {
    const translateStaticContent = async () => {
      const translations = await Promise.all([
        translateText("You may also like"),
        translateText("Loading..."),
        translateText("Error"),
        translateText("% OFF")
      ]);

      setTranslatedContent({
        title: translations[0],
        loading: translations[1],
        error: translations[2],
        discountLabel: translations[3]
      });
    };

    translateStaticContent();
  }, [selectedLanguage, translateText]);

  useEffect(() => {
    const translateProductNames = async () => {
      const names = await Promise.all(
        similarProducts.map(product =>
          product.name ? translateText(product.name) : Promise.resolve("")
        )
      );
      setTranslatedProductNames(names);
    };

    if (similarProducts.length > 0) {
      translateProductNames();
    }
  }, [similarProducts, selectedLanguage, translateText]);

  useEffect(() => {
    dispatch(fetchStoreProducts());
  }, [dispatch]);

  useEffect(() => {
    if (stores.length && products.length) {
      const flattenedProducts = stores.flatMap(store =>
        products.filter(product => store.products.includes(product._id)).map(product => ({
          ...product,
          storeName: store.name,
        })
        ));
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
  if (loading) return <div>{translatedContent.loading}</div>;
  if (error) return <div>{translatedContent.error}: {error}</div>;

  return (
    <div
      className="relative mt-10 rounded p-4 shadow-lg"
      style={{ boxShadow: '1px 1px 20px 1px lightgray' }}
    >
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: '#4222C4' }}>
          {translatedContent.title}
        </h2>
      </div>

      <Slider {...settings}>
        {similarProducts.map((product, index) => {
          const isSamePrice = product.discountedPrice === product.price;
          return (
            <Link
              key={product._id}
              to={`/single-product/${product._id}`}
              className="relative flex-none cursor-pointer w-full md:w-1/5 md:h-[270px] p-4 bg-white border rounded-lg shadow-lg"
            >
              <div className="relative w-full h-30 bg-gray-200">
                <img
                  src={`${import.meta.env.VITE_APP}/${product?.images[0]?.url?.replace(/\\/g, '/')}`}
                  alt={translatedProductNames[index] || product.name}
                  className="w-full h-[80px] md:h-[120px] object-cover rounded"
                />
                {product.discountedPrice !== 0 &&
                  product.discountedPrice !== product.price &&
                  product.discountPercentage > 0 && (
                    <div className="absolute top-[-20px] right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discountPercentage}
                      {translatedContent.discountLabel}
                    </div>
                  )}

              </div>
              <div className="p-2 mt-2">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {translatedProductNames[index] || product.name}
                </h3>

                <p className="text-gray-800 mt-1 text-xl font-bold">
                  <span className="text-sm">A.D </span>
                  {(product.discountedPrice !== 0 &&
                    product.discountedPrice !== product.price)
                    ? product.discountedPrice
                    : product.price}
                </p>

                {(product.discountedPrice !== 0 &&
                  product.discountedPrice !== product.price) && (
                    <p className="text-green-600 font-medium text-sm mt-1 line-through">
                      <span className="text-sm">A.D </span>{product.price}
                    </p>
                  )}

              </div>
            </Link>
          );
        })}

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
      aria-label="Next product"
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
      aria-label="Previous product"
    >
      <FaArrowLeft className="text-xl" style={{ color: '#4222C4' }} />
    </button>
  );
}