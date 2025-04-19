import Navbar from "../components/homepage/Navbar";
import { HeroBanner } from "../components/homepage/HeroBanner";
import ProductDetail from "../components/products/ProductDetail";
import ShippingReturn from "../components/products/ShippingReturn";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSingleProduct } from "../store/actions/productActions";
import { getCategoryById } from "../store/actions/categoryActions";
import { FooterPrime } from '../components/presentation/FooterPrime';
import { AllAbouJumiaFooter } from '../components/presentation/AllAbouJumiaFooter';
import { fetchProductsByStore, getStore } from "../store/actions/storeActions";
import { useLanguage } from "../context/LanguageContext";

const SingleProduct = () => {
  const { id } = useParams();
  const { product } = useSelector((state) => state.SingleproductDetails);
  const { categories } = useSelector((state) => state.categoryForStore);
  const { store } = useSelector((state) => state.store);
  const dispatch = useDispatch();
  const [orderGuide, setOrderGuide] = useState(0);
  const [toggleSidebar, setToggleSidebar] = useState(0);
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    home: "Home",
    goBack: "← Go Back",
    breadcrumbSeparator: "/"
  });
  const [translatedNames, setTranslatedNames] = useState({
    categoryName: "",
    productName: ""
  });

  useEffect(() => {
    const translateStaticContent = async () => {
      const translations = await Promise.all([
        translateText("Home"),
        translateText("← Go Back"),
        translateText("/")
      ]);

      setTranslatedContent({
        home: translations[0],
        goBack: translations[1],
        breadcrumbSeparator: translations[2]
      });
    };

    translateStaticContent();
  }, [selectedLanguage, translateText]);

  useEffect(() => {
    const translateDynamicNames = async () => {
      if (product?.name) {
        const productName = await translateText(product.name);
        let categoryName = "";
        if (categories?.[0]?.name) {
          categoryName = await translateText(categories[0].name);
        }
        setTranslatedNames({
          productName,
          categoryName
        });
      }
    };

    translateDynamicNames();
  }, [product, categories, selectedLanguage, translateText]);

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      dispatch(getCategoryById(product.category));
      dispatch(getStore(product.seller));
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (store) {
      dispatch(fetchProductsByStore(store._id));
    }
  }, [dispatch, store]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const navigate = useNavigate();
  return (
    <>
      <HeroBanner />
      <Navbar />
      <div className="w-full bg-[#F1F1F2] bg-opacity-40 py-10 md:px-5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb and Button Wrapper - Fixed spacing */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
              <Link to="/" className="hover:text-[#4222C4]">{translatedContent.home}</Link>
              {translatedNames.categoryName && (
                <>
                  <span className="mx-1">{translatedContent.breadcrumbSeparator}</span>
                  <span>{translatedNames.categoryName}</span>
                </>
              )}
              <span className="mx-1">{translatedContent.breadcrumbSeparator}</span>
              <span className="text-gray-800 font-semibold">
                {translatedNames.productName || product?.name}
              </span>
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#4222C4] hover:bg-blue-700 
              rounded-md shadow-lg transition-transform transform hover:scale-105 active:scale-95
              whitespace-nowrap"
            >
              {translatedContent.goBack}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-0 overflow-hidden container m-auto flex gap-0 md:gap-2">
          <ProductDetail 
            productId={id} 
            category={translatedNames.categoryName || categories?.[0]?.name} 
            setOrderGuide={setOrderGuide} 
            setToggleSidebar={setToggleSidebar} 
          />

          <ShippingReturn 
            store={store} 
            product={product} 
            orderGuide={orderGuide} 
            toggleSidebar={toggleSidebar} 
          />
        </div>
      </div>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </>
  );
};

export default SingleProduct;