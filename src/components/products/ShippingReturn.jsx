import { useEffect, useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaCommentDots, FaHome, FaShoppingCart, FaTimes, FaTimesCircle, FaTruck, FaUndo } from 'react-icons/fa';
import Select from 'react-select';
import { MdOutlineArrowDownward } from 'react-icons/md';
import Loader from '../../utils/Loader';
import { Link, useNavigate } from 'react-router-dom';
import ShippingReturnModal from '../presentation/modals/ShippingReturnModal';

const majorCitiesOptions = [
    { value: 'paris', label: 'Paris' },
    { value: 'lyon', label: 'Lyon' },
    { value: 'marseille', label: 'Marseille' },
    { value: 'toulouse', label: 'Toulouse' },
];

const cityOptions = {
    paris: [
        { value: 'paris-5', label: 'Le Marais' },
        { value: 'paris-6', label: 'Montmartre' },
        { value: 'paris-7', label: 'Belleville' },
        { value: 'paris-8', label: 'Butte-aux-Cailles' },
        { value: 'paris-9', label: 'Château d’Eau' },
        { value: 'paris-10', label: 'Père-Lachaise' },
    ],
    lyon: [
        { value: 'lyon-5', label: 'La Croix-Rousse' },
        { value: 'lyon-6', label: 'Part-Dieu' },
        { value: 'lyon-7', label: 'Gerland' },
    ],
    marseille: [
        { value: 'marseille-5', label: 'Old Port' },
        { value: 'marseille-6', label: 'La Joliette' },
        { value: 'marseille-7', label: 'Cité Radieuse' },
    ],
    toulouse: [
        { value: 'toulouse-6', label: 'Minimes' },
        { value: 'toulouse-7', label: 'Grand Rond' },
    ],
};


export default function ShippingReturn({ store, product, orderGuide, toggleSidebar }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [shipReturnModal, setShipReturnModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedMajorCity, setSelectedMajorCity] = useState(null);
    const [smallCities, setSmallCities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showArrow, setShowArrow] = useState(false);
    const navigate = useNavigate();
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

    const handleMajorCityChange = (selectedOption) => {
        setSelectedMajorCity(selectedOption.value);
        setSmallCities(cityOptions[selectedOption.value] || []);
    };

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
                <h1 className="border-b-2 pb-2 text-lg font-bold ">Shipping & Returns</h1>
                <a href='/' className="italic mt-2 text-[#4222C4] font-bold">Cebelu.com</a>
                <p className="text-gray-600 mt-1 text-[12px]">Fast delivery in major cities.</p>
                {/* <h4 className="text-gray-800 mt-3">Choose location</h4>

                <Select
                    options={majorCitiesOptions}
                    onChange={handleMajorCityChange}
                    placeholder="Select a major city in France"
                    className="border rounded w-full mt-1 p-2 text-gray-600"
                />

                <Select
                    options={smallCities}
                    placeholder="Select a nearby small city or area"
                    className="border rounded w-full mt-1 p-2 text-gray-600"
                /> */}


                <div className="space-y-4">
                    {/* Relay Points */}
                    <div className="relative w-full h-max flex p-4 mt-5">
                        <FaTruck className="text-[90px] text-[#4222C4] mt-2 h-max w-max" />
                        <div className='ml-5'>
                            <h3 className="text-md font-bold text-[#4222C4]">Relay Points</h3>
                            <p className='text-[12px] mt-1'>Delivery costs 10.00 A.D</p>
                            <p className="text-[12px] mt-1">
                                Ready for collection between {formatDate(startDate)} and {formatDate(endDate)} if you order within the next 1hr 52mins
                            </p>
                        </div>
                        <button onClick={() => openShippingReturnModal('relay')} className="absolute right-0 top-2 text-[#4222C4] hover:underline">Detail</button>
                    </div>

                    {/* Home Delivery */}
                    <div className="relative w-full h-max flex p-4 mt-5">
                        <FaHome className="text-[80px] text-[#4222C4] mt-2 h-max" />
                        <div className='ml-5'>
                            <h3 className="text-md font-bold text-[#4222C4]">Home Delivery</h3>
                            <p className='text-[12px] mt-1'>Delivery costs 10.00 A.D</p>
                            <p className='text-[12px] mt-1'>Ready for delivery between {formatDate(startDate)} and {formatDate(endDate)}  if you order within the next 1hrs 52mins</p>
                        </div>
                        <button onClick={() => openShippingReturnModal('delivery')}
                            className="absolute right-0 top-1 text-[#4222C4] hover:underline">Detail</button>
                    </div>

                    {/* Return Policy */}
                    <div className="relative w-full h-max flex p-4 mt-5">
                        <FaUndo className="text-3xl text-[#4222C4]" />

                        <div className='ml-5'>
                            <h3 className="text-md font-bold text-[#4222C4]">Return policy</h3>
                            <p className='text-[12px] mt-1'>Free returns within 7 days of delivery date</p>
                        </div>
                        <button onClick={() => openShippingReturnModal('return')} className="absolute right-0 top-1 text-[#4222C4] hover:underline">Detail</button>
                    </div>
                </div>

            </div>

            <div className="w-full h-max p-4 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                <h1 className="text-xl font-bold text-[#4222C4] mb-4">Seller Information</h1>
                <a href="#" className="text-[16px] mt-3 text-gray-700 flex items-center">
                    {store?.name}

                    {/* Check if documents exist and determine status */}
                    {store?.documents?.length > 0 ? (
                        store.documents[0].status === "approved" ? (
                            <FaCheckCircle className="text-[16px] text-green-500 ml-2" title="Verified" /> // ✅ Verified
                        ) : (
                            <FaTimesCircle className="text-[16px] text-red-500 ml-2" title="Unverified" /> // ❌ Unverified
                        )
                    ) : (
                        <FaTimesCircle className="text-[16px] text-gray-400 ml-2" title="No Documents" /> // ❓ No Documents
                    )}
                </a>
                <p className="text-gray-500 text-[13px] mt-2">Location: {store.address}</p>
                <p className="text-gray-500 text-[13px] mt-2"> Created: {' '}
                    {new Date(store.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>

                <p className="text-gray-500 text-[13px] mt-2">100% Seller Rating</p>
            </div>


            <div className="relative w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                <div className="flex justify-between gap-3 ">
                    <img
                        src={product ? `${import.meta.env.VITE_APP}/${product.images[0]?.url.replace(/\\/g, "/")}` : null}
                        alt="Product" className="w-[35%] h-[50px] border object-cover rounded-t" />
                    <div className="flex flex-col w-full mt-1">
                        <h1 className="text-sm font-bold text-[#4222C4] mt-5">Product: {product.name}</h1>
                        <p className="text-xl font-bold text-[#4222C4] mt-2">Price: <span className='text-sm'>A.D </span>{product.discountedPrice}</p>
                        {product.discountPercentage != null && (
                            <div className="flex mt-3 text-gray-600 text-sm">
                                Discount:
                                <p className="text-gray-600 line-through text-sm ml-1"> <span className='text-sm'>A.D </span>{product.price}</p>
                                <p className="text-red-500 text-sm ml-2">{product.discountPercentage}%</p>
                            </div>
                        )}

                    </div>
                </div>
                <Link to={`/AddToCart/${product._id}`} className="mt-4 w-full py-2 bg-[#4222C4] text-white rounded hover:bg-[#341d89] flex items-center justify-center">
                    <span className="mr-2">I BUY</span>
                    <FaShoppingCart className="text-xl" />
                </Link>

                {showArrow && (
                    <div className="absolute -left-7 bottom-10 p-5 w-max">
                        <MdOutlineArrowDownward className="text-[#4222C4] text-[38px] arrow-bounce" />
                    </div>
                )}

            </div>


            <div className="w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                <p>Do you have any question?</p>
                <button onClick={() => navigate(`/chat/user/${store?._id}`)} className="mt-4 w-full py-2 bg-[#4222C4] text-white rounded hover:bg-[#341d89] flex items-center justify-center">
                    <FaCommentDots className="text-xl mr-2" />
                    <span>Chat with us</span>
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
                        <h1 className="border-b-2 pb-2 text-lg font-bold ">Shipping & Returns</h1>
                        <h1 className="italic mt-2 text-[#4222C4]">Platform Express</h1>
                        <p className="text-gray-600 mt-1 text-[12px]">Fast delivery in major cities. <a href="#" className="text-blue-600 hover:underline">Detail</a></p>
                        {/* <h4 className="text-gray-800 mt-3">Choose location</h4>

                        <Select
                            options={majorCitiesOptions}
                            onChange={handleMajorCityChange}
                            placeholder="Select a major city in France"
                            className="border rounded w-full mt-1 p-2 text-gray-600"
                        />

                        <Select
                            options={smallCities}
                            placeholder="Select a nearby small city or area"
                            className="border rounded w-full mt-1 p-2 text-gray-600"
                        /> */}


                        <div className="space-y-4">
                            {/* Relay Points */}
                            <div className="relative w-full h-max flex p-4 mt-5">
                                <FaTruck className="text-[90px] text-[#4222C4] mt-2 h-max w-max" />
                                <div className='ml-5'>
                                    <h3 className="text-md font-bold text-[#4222C4]">Relay Points</h3>
                                    <p className='text-[12px] mt-1'>Delivery costs 32.00 A.D</p>
                                    <p className='text-[12px] mt-1'>Ready for collection between 24th December and 26th December if you order within the next 1hrs 52mins</p>
                                </div>
                                <button onClick={() => openShippingReturnModal('relay')} className="absolute right-0 top-4 text-[#4222C4] hover:underline">Detail</button>
                            </div>

                            {/* Home Delivery */}
                            <div className="relative w-full h-max flex p-4 mt-5">
                                <FaHome className="text-[80px] text-[#4222C4] mt-2 h-max" />
                                <div className='ml-5'>
                                    <h3 className="text-md font-bold text-[#4222C4]">Home Delivery</h3>
                                    <p className='text-[12px] mt-1'>Delivery costs 46.00 A.D</p>
                                    <p className='text-[12px] mt-1'>Ready for delivery between 24th December and 26th December if you order within the next 1hrs 52mins</p>
                                </div>
                                <button  onClick={() => openShippingReturnModal('delivery')} className="absolute right-0 top-1 text-[#4222C4] hover:underline">Detail</button>
                            </div>

                            {/* Return Policy */}
                            <div className="relative w-full h-max flex p-4 mt-5">
                                <FaUndo className="text-3xl text-[#4222C4]" />

                                <div className='ml-5'>
                                    <h3 className="text-md font-bold text-[#4222C4]">Return policy</h3>
                                    <p className='text-[12px] mt-1'>Free returns within 7 days of delivery date</p>
                                </div>
                                <button onClick={() => openShippingReturnModal('return')} className="absolute right-0 top-1 text-[#4222C4] hover:underline">Detail</button>
                            </div>
                        </div>

                    </div>

                    <div className="w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                        <h1 className="text-xl font-bold text-[#4222C4] mb-4">Seller Information</h1>
                        <a href="#" className="text-[16px] mt-3 text-gray-700 flex items-center">
                            {store?.name}

                            {/* Check if documents exist and determine status */}
                            {store?.documents?.length > 0 ? (
                                store.documents[0].status === "approved" ? (
                                    <FaCheckCircle className="text-[16px] text-green-500 ml-2" title="Verified" /> // ✅ Verified
                                ) : (
                                    <FaTimesCircle className="text-[16px] text-red-500 ml-2" title="Unverified" /> // ❌ Unverified
                                )
                            ) : (
                                <FaTimesCircle className="text-[16px] text-gray-400 ml-2" title="No Documents" /> // ❓ No Documents
                            )}
                        </a>
                        <p className="text-gray-500 text-[13px] mt-2">Location: {store.address}</p>
                        <p className="text-gray-500 text-[13px] mt-2"> Created: {' '}
                            {new Date(store.createdAt).toLocaleDateString("en-GB", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>

                        <p className="text-gray-500 text-[13px] mt-2">100% Seller Rating</p>
                    </div>


                    <div className="w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                        <div className="flex justify-between gap-3 ">
                            <img
                                src={product ? `${import.meta.env.VITE_APP}/${product.images[0]?.url.replace(/\\/g, "/")}` : null}
                                alt="Product" className="w-[35%] h-[50px] border object-cover rounded-t" />
                            <div className="flex flex-col w-full mt-1">
                                <h1 className="text-sm font-bold text-[#4222C4] mt-5">Product: {product.name}</h1>
                                <p className="text-xl font-bold text-[#4222C4] mt-2">Price: <span className='text-sm'>A.D </span>{product.discountedPrice}</p>
                                {product.discountPercentage != null && (
                                    <div className="flex mt-3 text-gray-600 text-sm">
                                        Discount:
                                        <p className="text-gray-600 line-through text-sm ml-1"> <span className='text-sm'>A.D </span>{product.price}</p>
                                        <p className="text-red-500 text-sm ml-2">{product.discountPercentage}%</p>
                                    </div>
                                )}

                            </div>
                        </div>
                        <Link to={`/AddToCart/${product._id}`} className="mt-4 w-full py-2 bg-[#4222C4] text-white rounded hover:bg-[#341d89] flex items-center justify-center">
                            <span className="mr-2">I BUY</span>
                            <FaShoppingCart className="text-xl" />
                        </Link>
                    </div>


                    <div className="w-full h-max p-2 mt-6 rounded" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                        <p>Do you have any question?</p>
                        <button onClick={() => navigate(`/chat/user/${store?._id}`)} className="mt-4 w-full py-2 bg-[#4222C4] text-white rounded hover:bg-[#341d89] flex items-center justify-center">
                            <FaCommentDots className="text-xl mr-2" />
                            <span>Chat with s</span>
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
