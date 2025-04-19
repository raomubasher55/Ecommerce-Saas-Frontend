import { useEffect, useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaCommentDots, FaHome, FaShoppingCart, FaTimes, FaTimesCircle, FaTruck, FaUndo } from 'react-icons/fa';
import { MdOutlineArrowDownward } from 'react-icons/md';
import Loader from '../../utils/Loader';
import { Link, useNavigate } from 'react-router-dom';
import ShippingReturnModal from '../presentation/modals/ShippingReturnModal';
import { useLanguage } from '../../context/LanguageContext';


export default function ShippingReturn({ store, product, orderGuide, toggleSidebar }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [shipReturnModal, setShipReturnModal] = useState(false);
    const { selectedLanguage, translateText } = useLanguage();
    const [modalType, setModalType] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showArrow, setShowArrow] = useState(false);
    const [translatedProduct, setTranslatedProduct] = useState({});
    const [translatedStore, setTranslatedStore] = useState({});

    const [translatedContent, setTranslatedContent] = useState({
        shippingReturns: "Shipping & Returns",
        fastDelivery: "Fast delivery in major cities.",
        relayPoints: "Relay Points",
        homeDelivery: "Home Delivery",
        returnPolicy: "Return policy",
        freeReturns: "Free returns within 7 days of delivery date",
        sellerInfo: "Seller Information",
        location: "Location:",
        created: "Created:",
        sellerRating: "100% Seller Rating",
        productLabel: "Product:",
        priceLabel: "Price:",
        discountLabel: "Discount:",
        iBuy: "I BUY",
        questions: "Do you have any question?",
        chatWithUs: "Chat with us",
        detail: "Detail",
        verified: "Verified",
        unverified: "Unverified",
        noDocuments: "No Documents",
        readyBetween : "Ready for collection between",
        readyTime: "if you order within the next 1hr 52mins",
        deliveryCost: "Delivery costs",
        and: "And"
    });

    const navigate = useNavigate();

    useEffect(() => {
        const translateStaticContent = async () => {
            const translations = await Promise.all([
                translateText("Shipping & Returns"),
                translateText("Fast delivery in major cities."),
                translateText("Relay Points"),
                translateText("Home Delivery"),
                translateText("Return policy"),
                translateText("Free returns within 7 days of delivery date"),
                translateText("Seller Information"),
                translateText("Location:"),
                translateText("Created:"),
                translateText("100% Seller Rating"),
                translateText("Product:"),
                translateText("Price:"),
                translateText("Discount:"),
                translateText("I BUY"),
                translateText("Do you have any question?"),
                translateText("Chat with us"),
                translateText("Detail"),
                translateText("Verified"),
                translateText("Unverified"),
                translateText("No Documents"),
                translateText("Ready for collection between"),
                translateText("if you order within the next 1hr 52mins"),
                translateText("Delivery costs"),
                translateText("And"),
            ]);
            setTranslatedContent({
                shippingReturns: translations[0],
                fastDelivery: translations[1],
                relayPoints: translations[2],
                homeDelivery: translations[3],
                returnPolicy: translations[4],
                freeReturns: translations[5],
                sellerInfo: translations[6],
                location: translations[7],
                created: translations[8],
                sellerRating: translations[9],
                productLabel: translations[10],
                priceLabel: translations[11],
                discountLabel: translations[12],
                iBuy: translations[13],
                questions: translations[14],
                chatWithUs: translations[15],
                detail: translations[16],
                verified: translations[17],
                unverified: translations[18],
                noDocuments: translations[19],
                readyBetween: translations[20],
                readyTime: translations[21],
                deliveryCost: translations[22],
                and: translations[23]
            });
        };        
        translateStaticContent();
    }, [selectedLanguage, translateText]);

    useEffect(() => {
        const translateDynamicContent = async () => {
            if (store && product) {
                const [storeName, storeAddress, productName] = await Promise.all([
                    translateText(store.name),
                    translateText(store.address),
                    translateText(product.name)
                ]);
                
                setTranslatedStore({
                    name: storeName,
                    address: storeAddress
                });
                
                setTranslatedProduct({
                    name: productName
                });
                
                setIsLoading(false);
            }
        };
        
        translateDynamicContent();
    }, [store, product, selectedLanguage, translateText]);

    useEffect(() => {
        if (orderGuide > 0) {
            setShowArrow(true);

            const timer = setTimeout(() => {
                setShowArrow(false);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [orderGuide]);
    const toggleSidebarAction = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if (store && product) {
            setIsLoading(false);
        }
        if (toggleSidebar) {
            setIsSidebarOpen(true);
        }
    }, [store, product, toggleSidebar]);

    if (isLoading) {
        return (
            <Loader />
        );
    }

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate());

    const endDate = new Date();
    endDate.setDate(today.getDate() + 10);

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
    };
    const closeModal = () => {
        setShipReturnModal(false);
    };

    const openShippingReturnModal = (type) => {
        setModalType(type);
        setShipReturnModal(true);
    };

    return (
        <div className='w-[300px] h-auto relative mr-5 '>
            {/* Main content (hidden on lg screens) */}
            <div className="relative mt-8 p-4 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                <h1 className="border-b-2 pb-2 text-lg font-bold ">{translatedContent.shippingReturns}</h1>
                <a href='/' className="italic mt-2 text-[#4222C4] font-bold">Cebelu.com</a>
                <p className="text-gray-600 mt-1 text-[12px]">{translatedContent.fastDelivery}</p>


                <div className="space-y-4">
                    {/* Relay Points */}
                    <div className="relative w-full h-max flex p-4 mt-5">
                        <FaTruck className="text-[90px] text-[#4222C4] mt-2 h-max w-max" />
                        <div className='ml-5'>
                            <h3 className="text-md font-bold text-[#4222C4]">{translatedContent.relayPoints}</h3>
                            <p className='text-[12px] mt-1'>{translatedContent.deliveryCost} 10.00 A.D</p>
                            <p className="text-[12px] mt-1">
                                {translatedContent.readyBetween} {formatDate(startDate)} {translatedContent.and} {formatDate(endDate)} {translatedContent.readyTime}
                            </p>
                        </div>
                        <button onClick={() => openShippingReturnModal('relay')} className="absolute right-0 top-2 text-[#4222C4] hover:underline">{translatedContent.detail}</button>
                    </div>

                    {/* Home Delivery */}
                    <div className="relative w-full h-max flex p-4 mt-5">
                        <FaHome className="text-[80px] text-[#4222C4] mt-2 h-max" />
                        <div className='ml-5'>
                            <h3 className="text-md font-bold text-[#4222C4]">{translatedContent.homeDelivery}</h3>
                            <p className='text-[12px] mt-1'>{translatedContent.deliveryCost} 10.00 A.D</p>
                            <p className='text-[12px] mt-1'>{translatedContent.readyBetween} {formatDate(startDate)} {translatedContent.and} {formatDate(endDate)}  {translatedContent.readyTime}</p>
                        </div>
                        <button onClick={() => openShippingReturnModal('delivery')}
                            className="absolute right-0 top-1 text-[#4222C4] hover:underline">{translatedContent.detail}</button>
                    </div>

                    {/* Return Policy */}
                    <div className="relative w-full h-max flex p-4 mt-5">
                        <FaUndo className="text-3xl text-[#4222C4]" />

                        <div className='ml-5'>
                            <h3 className="text-md font-bold text-[#4222C4]">{translatedContent.returnPolicy}</h3>
                            <p className='text-[12px] mt-1'>{translatedContent.freeReturns}</p>
                        </div>
                        <button onClick={() => openShippingReturnModal('return')} className="absolute right-0 top-1 text-[#4222C4] hover:underline">{translatedContent.detail}</button>
                    </div>
                </div>

            </div>

            <div className="w-full h-max p-4 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                <h1 className="text-xl font-bold text-[#4222C4] mb-4">{translatedContent.sellerInfo}</h1>
                <a href="#" className="text-[16px] mt-3 text-gray-700 flex items-center">
                    {translatedStore.name}

                    {/* Check if documents exist and determine status */}
                    {store?.documents?.length > 0 ? (
                        store.documents[0].status === "approved" ? (
                            <FaCheckCircle className="text-[16px] text-green-500 ml-2" title={translatedContent.verified} /> // ✅ Verified
                        ) : (
                            <FaTimesCircle className="text-[16px] text-red-500 ml-2" title={translatedContent.unverified} /> // ❌ Unverified
                        )
                    ) : (
                        <FaTimesCircle className="text-[16px] text-gray-400 ml-2" title={translatedContent.noDocuments} /> // ❓ No Documents
                    )}
                </a>
                <p className="text-gray-500 text-[13px] mt-2">{translatedContent.location} {translatedStore.address}</p>
                <p className="text-gray-500 text-[13px] mt-2"> {translatedContent.created}: {' '}
                    {new Date(store.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>

                <p className="text-gray-500 text-[13px] mt-2">{translatedContent.sellerRating}</p>
            </div>


            <div className="relative w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                <div className="flex justify-between gap-3 ">
                    <img
                        src={product ? `${import.meta.env.VITE_APP}/${product.images[0]?.url.replace(/\\/g, "/")}` : null}
                        alt="Product" className="w-[35%] h-[50px] border object-cover rounded-t" />
                    <div className="flex flex-col w-full mt-1">
                        <h1 className="text-sm font-bold text-[#4222C4] mt-5">{translatedContent.productLabel} {translatedProduct.name}</h1>
                        <p className="text-xl font-bold text-[#4222C4] mt-2">{translatedContent.priceLabel}: <span className='text-sm'>A.D </span>{product.discountedPrice}</p>
                        {product.discountPercentage != null && (
                            <div className="flex mt-3 text-gray-600 text-sm">
                                {translatedContent.discountLabel}:
                                <p className="text-gray-600 line-through text-sm ml-1"> <span className='text-sm'>A.D </span>{product.price}</p>
                                <p className="text-red-500 text-sm ml-2">{product.discountPercentage}%</p>
                            </div>
                        )}

                    </div>
                </div>
                <Link to={`/AddToCart/${product._id}`} className="mt-4 w-full py-2 bg-[#4222C4] text-white rounded hover:bg-[#341d89] flex items-center justify-center">
                    <span className="mr-2">{translatedContent.iBuy}</span>
                    <FaShoppingCart className="text-xl" />
                </Link>

                {showArrow && (
                    <div className="absolute -left-7 bottom-10 p-5 w-max">
                        <MdOutlineArrowDownward className="text-[#4222C4] text-[38px] arrow-bounce" />
                    </div>
                )}

            </div>


            <div className="w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                <p>{translatedContent.questions}</p>
                <button onClick={() => navigate(`/chat/user/${store?._id}`)} className="mt-4 w-full py-2 bg-[#4222C4] text-white rounded hover:bg-[#341d89] flex items-center justify-center">
                    <FaCommentDots className="text-xl mr-2" />
                    <span>{translatedContent.chatWithUs}</span>
                </button>
            </div>




            {/* Right-side icon for toggling sidebar */}
            <div className="fixed lg:hidden top-1/2 right-0 transform cursor-pointer" onClick={toggleSidebarAction}>
                <FaArrowRight className="text-3xl text-gray-800" />
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 w-[300px] h-full overflow-x-scroll bg-white p-5 shadow-md transition-transform transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="relative">
                    {/* Close icon for sidebar */}


                    <div className="relative mt-8 p-2 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                        <h1 className="border-b-2 pb-2 text-lg font-bold ">{translatedContent.shippingReturns}</h1>
                        <h1 className="italic mt-2 text-[#4222C4]">Cebleu.com</h1>
                        <p className="text-gray-600 mt-1 text-[12px]">{translatedContent.fastDelivery} <a href="#" className="text-blue-600 hover:underline">Detail</a></p>

                        <div className="space-y-4">
                            {/* Relay Points */}
                            <div className="relative w-full h-max flex p-4 mt-5">
                                <FaTruck className="text-[90px] text-[#4222C4] mt-2 h-max w-max" />
                                <div className='ml-5'>
                                    <h3 className="text-md font-bold text-[#4222C4]">{translatedContent.relayPoints}</h3>
                                    <p className='text-[12px] mt-1'>{translatedContent.deliveryCost} 32.00 A.D</p>
                                    <p className='text-[12px] mt-1'>{translatedContent.readyBetween} {formatDate(startDate)} {translatedContent.and} {formatDate(endDate)} {translatedContent.readyTime}</p>
                                </div>
                                <button onClick={() => openShippingReturnModal('relay')} className="absolute right-0 top-4 text-[#4222C4] hover:underline">Detail</button>
                            </div>

                            {/* Home Delivery */}
                            <div className="relative w-full h-max flex p-4 mt-5">
                                <FaHome className="text-[80px] text-[#4222C4] mt-2 h-max" />
                                <div className='ml-5'>
                                    <h3 className="text-md font-bold text-[#4222C4]">{translatedContent.homeDelivery}</h3>
                                    <p className='text-[12px] mt-1'>{translatedContent.deliveryCost} 46.00 A.D</p>
                                    <p className='text-[12px] mt-1'>{translatedContent.readyBetween} {formatDate(startDate)} {translatedContent.and} {formatDate(endDate)} {translatedContent.readyTime}</p>
                                </div>
                                <button  onClick={() => openShippingReturnModal('delivery')} className="absolute right-0 top-1 text-[#4222C4] hover:underline">{translatedContent.detail}</button>
                            </div>

                            {/* Return Policy */}
                            <div className="relative w-full h-max flex p-4 mt-5">
                                <FaUndo className="text-3xl text-[#4222C4]" />

                                <div className='ml-5'>
                                    <h3 className="text-md font-bold text-[#4222C4]">{translatedContent.returnPolicy}</h3>
                                    <p className='text-[12px] mt-1'>{translatedContent.freeReturns}</p>
                                </div>
                                <button onClick={() => openShippingReturnModal('return')} className="absolute right-0 top-1 text-[#4222C4] hover:underline">{translatedContent.detail}</button>
                            </div>
                        </div>

                    </div>

                    <div className="w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                        <h1 className="text-xl font-bold text-[#4222C4] mb-4">{translatedContent.sellerInfo}</h1>
                        <a href="#" className="text-[16px] mt-3 text-gray-700 flex items-center">
                        {translatedStore.name}

                            {/* Check if documents exist and determine status */}
                            {store?.documents?.length > 0 ? (
                                store.documents[0].status === "approved" ? (
                                    <FaCheckCircle className="text-[16px] text-green-500 ml-2" title={translatedContent.verified} /> // ✅ Verified
                                ) : (
                                    <FaTimesCircle className="text-[16px] text-red-500 ml-2" title={translatedContent.unverified} /> // ❌ Unverified
                                )
                            ) : (
                                <FaTimesCircle className="text-[16px] text-gray-400 ml-2" title={translatedContent.noDocuments} /> // ❓ No Documents
                            )}
                        </a>
                        <p className="text-gray-500 text-[13px] mt-2">{translatedContent.location}: {translatedStore.address}</p>
                        <p className="text-gray-500 text-[13px] mt-2"> {translatedContent.created}: {' '}
                            {new Date(store.createdAt).toLocaleDateString("en-GB", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        <p className="text-gray-500 text-[13px] mt-2">{translatedContent.sellerRating}</p>
                    </div>


                    <div className="w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                        <div className="flex justify-between gap-3 ">
                            <img
                                src={product ? `${import.meta.env.VITE_APP}/${product.images[0]?.url.replace(/\\/g, "/")}` : null}
                                alt="Product" className="w-[35%] h-[50px] border object-cover rounded-t" />
                            <div className="flex flex-col w-full mt-1">
                                <h1 className="text-sm font-bold text-[#4222C4] mt-5">{translatedContent.productLabel}: {translatedProduct.name}</h1>
                                <p className="text-xl font-bold text-[#4222C4] mt-2">{translatedContent.priceLabel}: <span className='text-sm'>A.D </span>{product.discountedPrice}</p>
                                {product.discountPercentage != null && (
                                    <div className="flex mt-3 text-gray-600 text-sm">
                                        {translatedContent.discountLabel}:
                                        <p className="text-gray-600 line-through text-sm ml-1"> <span className='text-sm'>A.D </span>{product.price}</p>
                                        <p className="text-red-500 text-sm ml-2">{product.discountPercentage}%</p>
                                    </div>
                                )}

                            </div>
                        </div>
                        <Link to={`/AddToCart/${product._id}`} className="mt-4 w-full py-2 bg-[#4222C4] text-white rounded hover:bg-[#341d89] flex items-center justify-center">
                            <span className="mr-2">{translatedContent.iBuy}</span>
                            <FaShoppingCart className="text-xl" />
                        </Link>
                    </div>


                    <div className="w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                        <p>{translatedContent.questions}</p>
                        <button onClick={() => navigate(`/chat/user/${store?._id}`)} className="mt-4 w-full py-2 bg-[#4222C4] text-white rounded hover:bg-[#341d89] flex items-center justify-center">
                            <FaCommentDots className="text-xl mr-2" />
                            <span>{translatedContent.chatWithUs}</span>
                        </button>
                    </div>

                    <div className="absolute top-2 right-2 cursor-pointer" onClick={toggleSidebarAction}>
                        <FaTimes className="text-2xl text-gray-800" />
                    </div>

                </div>
            </div>




            {/* modal shipping  */}
            {shipReturnModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10">
                    <ShippingReturnModal type={modalType} onClose={closeModal} />
                </div>
            )}
        </div>
    );
}
