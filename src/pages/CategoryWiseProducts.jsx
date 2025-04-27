import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchStoreProducts } from "../store/actions/storeActions";
import { HeroBanner } from "../components/homepage/HeroBanner";
import Navbar from "../components/homepage/Navbar";
import { FooterPrime } from "../components/presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../components/presentation/AllAbouJumiaFooter";
import SponsoredProducts from "../components/presentation/SponseredProducts";
import { useLanguage } from "../context/LanguageContext";

export default function CategoryWiseProducts() {
    const { category, id } = useParams();
    const dispatch = useDispatch();
    const { loading, stores, products, error } = useSelector((state) => state.ProductsByReducer);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [translatedProducts, setTranslatedProducts] = useState([]);
    const [store, setStore] = useState(null);
    const [translatedCategory, setTranslatedCategory] = useState(category);
    const navigate = useNavigate();
    const { selectedLanguage, translateText } = useLanguage();

    // Default English content
    const defaultContent = {
        loadingText: "Loading...",
        errorText: "Error:",
        goBack: "Go Back",
        noProducts: "No products available",
        viewButton: "View",
        discountText: "% OFF",
        productsLabel: "Products"
    };

    const [translatedContent, setTranslatedContent] = useState(defaultContent);

    // Translate product data
    const translateProductData = async (products) => {
        if (selectedLanguage === "English") return products;

        try {
            return await Promise.all(products.map(async (product) => ({
                ...product,
                name: await translateText(product.name),
                description: await translateText(product.description),
                storeName: product.storeName ? await translateText(product.storeName) : ""
            })));
        } catch (error) {
            console.error("Product translation error:", error);
            return products;
        }
    };

    // Translate UI content
    const translateUIContent = async () => {
        if (selectedLanguage === "English") {
            setTranslatedContent(defaultContent);
            setTranslatedCategory(category);
            return;
        }

        try {
            const newContent = {
                loadingText: await translateText("Loading..."),
                errorText: await translateText("Error:"),
                goBack: await translateText("Go Back"),
                noProducts: await translateText("No products available"),
                viewButton: await translateText("View"),
                discountText: await translateText("% OFF"),
                productsLabel: await translateText("Products")
            };
            setTranslatedContent(newContent);

            // Translate category name
            const translatedCat = await translateText(category);
            setTranslatedCategory(translatedCat);
        } catch (error) {
            console.error("UI translation error:", error);
            setTranslatedContent(defaultContent);
            setTranslatedCategory(category);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await translateUIContent();

            if (filteredProducts.length) {
                const translated = await translateProductData(filteredProducts);
                setTranslatedProducts(translated);
            }
        };

        loadData();
    }, [selectedLanguage, filteredProducts, translateText, category]);

    useEffect(() => {
        dispatch(fetchStoreProducts());
    }, [dispatch]);

    useEffect(() => {
        const processStoreData = async () => {
            if (stores.length && products.length) {
                const selectedStore = stores.find((store) => store._id === id);
                setStore(selectedStore);

                if (selectedStore) {
                    const storeProducts = products.filter((product) => product.seller === id);
                    setFilteredProducts(storeProducts);

                    // Translate immediately when data loads
                    const translated = await translateProductData(storeProducts);
                    setTranslatedProducts(translated);
                } else {
                    setFilteredProducts([]);
                    setTranslatedProducts([]);
                }
            }
        };

        processStoreData();
    }, [stores, products, id]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 text-[#4222C4] text-2xl font-semibold">
                {translatedContent.loadingText}
            </div>
        );
    if (error)
        return (
            <div className="flex items-center justify-center h-screen text-red-500 text-xl font-bold">
                {translatedContent.errorText} {error}
            </div>
        );

    const displayProducts = selectedLanguage === "English" ? filteredProducts : translatedProducts;

    return (
        <>
            <HeroBanner />
            <Navbar />

            <div className="container mx-auto px-4 py-8 bg-gray-100 mt-6 rounded-lg shadow-lg">

                <button
                    onClick={() => navigate('/')}
                    className="inline-block mt-3 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 
                    rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    {translatedContent.goBack}
                </button>

                {/* Store Products Section */}
                <h2 className="text-center text-3xl font-bold mb-6 text-[#4222C4]">
                    {translatedCategory} {translatedContent.productsLabel}
                </h2>

                {displayProducts.length === 0 ? (
                    <div className="text-center text-gray-600 text-xl">
                        {translatedContent.noProducts}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {displayProducts.map((product) => (
                            <div key={product._id} className="group">
                                <div className="relative bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                                    <Link to={`/single-product/${product._id}`}>
                                        <img
                                            src={`${import.meta.env.VITE_APP}/${product?.images[0]?.url?.replace(/\\/g, "/")}`}
                                            alt={product.name}
                                            className="w-full h-60 object-cover rounded-t-lg"
                                        />
                                    </Link>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#4222C4] transition">
                                            {product.name.length > 11
                                                ? `${product.name.slice(0, 11)}...`
                                                : product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate">{product.description}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-[#4222C4] font-medium truncate">
                                                {product.storeName}
                                            </div>

                                            <div className='w-full flex justify-between'>
                                                <Link
                                                    to={`/single-product/${product._id}`}
                                                    className="rounded-full px-2 py-1 bg-[#4222C4] text-white text-xs font-medium shadow-md hover:bg-[#311b92] transition"
                                                >
                                                    {translatedContent.viewButton}
                                                </Link>
                                                {product.discountPercentage && (
                                                    <div className="rounded-full px-2 py-1 bg-[#4222C4] text-white text-xs">
                                                        {product.discountPercentage}{translatedContent.discountText}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <SponsoredProducts />
            <FooterPrime />
            <AllAbouJumiaFooter />
        </>
    );
}