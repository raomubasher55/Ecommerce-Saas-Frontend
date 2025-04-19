import { HeroBanner } from "../components/homepage/HeroBanner";
import Navbar from "../components/homepage/Navbar";
import { AllAbouJumiaFooter } from "../components/presentation/AllAbouJumiaFooter";
import BestBrands from "../components/presentation/BestBrands";
import BestOffers from "../components/presentation/BestOffers";
import { FooterPrime } from "../components/presentation/FooterPrime";
import ProductByRange from "../components/presentation/ProductByRange";
import TopDeals from "../components/presentation/TopDeals";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getActiveAds } from "../store/actions/adActions";
import { getCategoryById } from "../store/actions/categoryActions";
import { getProductsByCategory } from "../store/actions/productActions";
import Loader from "../utils/Loader";
import AdsSliderPage from "../components/sliders/AdsSliderPage";

export default function PriceRangeFilterProducts() {
  const { loading, ads, error } = useSelector((state) => state.adData);
  const { categories } = useSelector((state) => state.categoryForStore);
  const { products } = useSelector((state) => state.SingleproductDetails);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
const categoryName = categories[0]?.name
  useEffect(() => {
    if (id) {
      dispatch(getActiveAds());
      dispatch(getCategoryById(id));
      if(categoryName){
        dispatch(getProductsByCategory(categoryName));
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % 2);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <HeroBanner />
      <Navbar />

      <div className="container mx-auto mt-10 h-max p-4">
        {/* Breadcrumb */}
        <p className="text-[13px] font-bold">
          <span className="text-gray-800"><Link to={'/'}>Home</Link></span> { '>' } <a className="text-gray-600">{categories ? categories[0]?.name : ' '}</a>
        </p>
        <Link
            to="/"
            className="inline-block mt-3 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 
             rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Return to Home
          </Link>

        {/* Category Banner */}
        <AdsSliderPage ads={ads} />

        {/* Related Top Discounted Products */}
        <TopDeals />

       {/* Beauty Universe */}
<div className="bg-[#5e37fa] w-full h-max rounded mt-10">
  <h1 className="text-[17px] font-medium text-center p-2 pt-5 text-white">
    Discover our best beauty universes
  </h1>
  <div className="bg-white mt-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
    {products?.products?.length > 0 ? (
      products.products
        .filter((item) => {
          const currentDate = new Date();
          const discountStart = new Date(item.discountStartDate);
          const discountEnd = new Date(item.discountEndDate);

          return (
            item.discountPercentage !== null &&
            discountStart <= currentDate &&
            discountEnd >= currentDate
          );
        })
        .map((item) => (
          <Link
            key={item._id}
            to={`/single-product/${item._id}`}
            className="rounded bg-white shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
          >
            <img
              className="w-full h-[140px] md:h-[240px] object-cover rounded mb-2"
              src={`${import.meta.env.VITE_APP}/${item.images[0]?.url.replace(/\\/g, "/")}`}
              alt={item.name}
            />
            <h2 className="text-center text-[14px] font-medium text-gray-800 mb-2">
              {item.name}
            </h2>
            <p className="text-center text-[14px] font-medium text-gray-600 mb-2">
              <span className="line-through text-red-500">{item.price}</span>
              <span className="ml-2 text-green-500">{item.discountedPrice}</span>
            </p>
          </Link>
        ))
    ) : (
      <p className="text-center text-gray-500">No discounted products available.</p>
    )}
  </div>
</div>


        {/* Best Offers */}
        <BestOffers />

        {/* Your Favourite Brands */}
        <BestBrands />

        {/* Price and Category Search */}
        <ProductByRange categories={categories} products={products} />
      </div>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </>
  );
}