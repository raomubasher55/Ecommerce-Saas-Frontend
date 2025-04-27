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

export default function StoreWiseProducts() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, stores, products, error } = useSelector((state) => state.ProductsByReducer);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [translatedProducts, setTranslatedProducts] = useState([]);
    const [store, setStore] = useState(null);
    const [translatedStore, setTranslatedStore] = useState(null);
    const navigate = useNavigate();
    const { selectedLanguage, translateText } = useLanguage();
    
    // Default English content
    const defaultContent = {
        loadingText: "Loading...",
        errorText: "Error:",
        storeStats: "Store Stats",
        totalProducts: "Total Products",
        goBack: "Go Back",
        storeProducts: "Store Products",
        noProducts: "No products available",
        viewButton: "View",
        discountText: "% OFF",
        addressLabel: "Address:",
        nationalityLabel: "Nationality:"
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

    // Translate store data
    const translateStoreData = async (store) => {
        if (!store || selectedLanguage === "English") return store;
        
        try {
            return {
                ...store,
                name: await translateText(store.name),
                description: await translateText(store.description),
                address: await translateText(store.address),
                nationality: await translateText(store.nationality)
            };
        } catch (error) {
            console.error("Store translation error:", error);
            return store;
        }
    };

    // Translate UI content
    const translateUIContent = async () => {
        if (selectedLanguage === "English") {
            setTranslatedContent(defaultContent);
            return;
        }

        try {
            const newContent = {
                loadingText: await translateText("Loading..."),
                errorText: await translateText("Error:"),
                storeStats: await translateText("Store Stats"),
                totalProducts: await translateText("Total Products"),
                goBack: await translateText("Go Back"),
                storeProducts: await translateText("Store Products"),
                noProducts: await translateText("No products available"),
                viewButton: await translateText("View"),
                discountText: await translateText("% OFF"),
                addressLabel: await translateText("Address:"),
                nationalityLabel: await translateText("Nationality:")
            };
            setTranslatedContent(newContent);
        } catch (error) {
            console.error("UI translation error:", error);
            setTranslatedContent(defaultContent);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await translateUIContent();
            
            if (store) {
                const translated = await translateStoreData(store);
                setTranslatedStore(translated);
            }
            
            if (filteredProducts.length) {
                const translated = await translateProductData(filteredProducts);
                setTranslatedProducts(translated);
            }
        };
        
        loadData();
    }, [selectedLanguage, store, filteredProducts, translateText]);

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

    useEffect(() => {
        if (store) {
            translateStoreData(store).then(setTranslatedStore);
        }
    }, [store, selectedLanguage]);

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
                {/* Store Information Section */}
                {translatedStore && (
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between mb-10 transition-all hover:scale-105">
                        {/* Store Image & Details */}
                        <div className="flex flex-col sm:flex-row items-center">
                            <img
                                src={`${import.meta.env.VITE_APP}${translatedStore.photo.url}`}
                                alt={translatedStore.name}
                                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-[#4222C4] shadow-lg"
                            />
                            <div className="ml-4">
                                <h2 className="text-2xl font-bold text-[#4222C4] text-center sm:text-left">
                                    {translatedStore.name}
                                </h2>
                                <p className="text-gray-600 text-center sm:text-left">
                                    {translatedStore.description}
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <strong>{translatedContent.addressLabel}</strong> {translatedStore.address}
                                </p>
                                <p className="text-gray-700">
                                    <strong>{translatedContent.nationalityLabel}</strong> {translatedStore.nationality}
                                </p>
                            </div>
                        </div>

                        {/* Store Stats */}
                        <div className="text-center sm:text-right mt-4 sm:mt-0">
                            <h3 className="text-xl font-bold text-[#4222C4]">
                                {translatedContent.storeStats}
                            </h3>
                            <p className="text-gray-700">
                                <strong>{translatedContent.totalProducts}:</strong> {translatedStore.products.length}
                            </p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="inline-block mb-5 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 
                    rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                    {translatedContent.goBack}
                </button>

                {/* Store Products Section */}
                <h2 className="text-center text-3xl font-bold mb-6 text-[#4222C4]">
                    {translatedContent.storeProducts}
                </h2>

                {displayProducts.length === 0 ? (
                    <div className="text-center text-gray-600 text-xl">
                        {translatedContent.noProducts}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayProducts.map((product) => (
                            <div key={product._id} className="group">
                                <div className="relative bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                                    <img
                                        src={`${import.meta.env.VITE_APP}/${product.images[0].url.replace(/\\/g, "/")}`}
                                        alt={product.name}
                                        className="w-full h-60 object-cover rounded-t-lg"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#4222C4] transition">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 truncate">{product.description}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-[#4222C4] font-medium">{product.storeName}</div>
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