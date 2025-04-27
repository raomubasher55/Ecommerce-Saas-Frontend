import { useEffect, useState } from "react";
import axios from "axios";
import {
    FaRegCreditCard, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCcDinersClub, FaCcJcb,
    FaSimCard
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function ShopPaymentCard() {
    const { store } = useSelector((state) => state.store);
    const [cardData, setCardData] = useState({
        holderName: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        cardType: "",
    });
    const [loading, setLoading] = useState(false);
    const [card, setCard] = useState();
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        setCardData({ ...cardData, [e.target.name]: e.target.value });
    };

    const handleCardType = (type) => {
        setCardData({ ...cardData, cardType: type });
    };


    useEffect(() => {
        if (store?.paymentDetails) {
            setCard({
                holderName: store.paymentDetails.holderName,
                cardNumber: store.paymentDetails.cardNumber,
                expiryDate: store.paymentDetails.expiryDate,
                cvc: store.paymentDetails.cvc,
                cardType: store.paymentDetails.cardType,
            });
        }
    }, [store]);

    const handleSubmit = async () => {
        const token = localStorage.getItem("storeToken");
        if (!token) return alert("Please login first!");

        if (!cardData.holderName || !cardData.cardNumber || !cardData.expiryDate || !cardData.cvc || !cardData.cardType) {
            return alert("Please fill in all fields.");
        }

        try {
            setLoading(true);
            const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/v1/store/payment-details`, cardData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success(response.data.message);

            setCardData({ holderName: "", cardNumber: "", expiryDate: "", cvc: "", cardType: "" });
            setShowModal(false);
        } catch (error) {
            console.error("Error submitting payment:", error);
            alert(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };


    const cardStyles = {
        Visa: { bg: "bg-gradient-to-r from-blue-500 to-blue-800", icon: <FaCcVisa className="text-blue-600" /> },
        MasterCard: { bg: "bg-gradient-to-r from-red-500 to-orange-600", icon: <FaCcMastercard className="text-red-600" /> },
        Amex: { bg: "bg-gradient-to-r from-green-500 to-green-700", icon: <FaCcAmex className="text-green-600" /> },
        Discover: { bg: "bg-gradient-to-r from-orange-500 to-yellow-500", icon: <FaCcDiscover className="text-orange-600" /> },
        DinersClub: { bg: "bg-gradient-to-r from-purple-500 to-purple-800", icon: <FaCcDinersClub className="text-purple-600" /> },
        JCB: { bg: "bg-gradient-to-r from-yellow-500 to-yellow-800", icon: <FaCcJcb className="text-yellow-600" /> },
        Default: { bg: "bg-gradient-to-r from-gray-600 to-gray-800", icon: <FaRegCreditCard className="text-white" /> },
    };


    return (
        <div className="p-6 bg-gray-100 flex flex-col items-center min-h-screen">
            <p className="text-red-600 font-semibold text-center text-lg mt-2 mb-4">
                Only Algerian CCP accounts are accepted for receiving earnings from your store.
            </p>

            <button onClick={() => setShowModal(true)} className="mb-4 bg-[#4222C4] text-white px-4 py-2 rounded-lg">Add Card</button>

            {card ? (
                <div className="flex justify-center px-4">
                    <div
                        className={`relative w-full max-w-sm p-4 sm:p-6 rounded-xl shadow-xl text-white 
            flex flex-col justify-between transform transition-transform hover:scale-105
            aspect-[16/9] ${cardStyles[card.cardType]?.bg || cardStyles.Default.bg}`}
                    >
                        {/* Chip Icon */}
                        <div className="absolute top-3 left-3 text-2xl sm:text-3xl md:text-4xl text-gray-200">
                            <FaSimCard />
                        </div>

                        {/* Card Number */}
                        <h3 className="text-sm sm:text-lg tracking-widest mt-6 sm:mt-10">
                            {card.cardNumber}
                        </h3>

                        {/* Holder Name & Expiry */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs uppercase text-gray-200">Card Holder</p>
                                <p className="text-sm sm:text-lg font-semibold">{card.holderName}</p>
                            </div>
                            <div className="mr-6 sm:mr-10">
                                <p className="text-xs uppercase text-gray-200">Expires</p>
                                <p className="text-sm sm:text-lg font-semibold">{card.expiryDate}</p>
                            </div>
                        </div>

                        {/* Card Type Icon */}
                        <div className="absolute bottom-3 right-3 text-2xl sm:text-3xl md:text-4xl">
                            { cardStyles.Default.icon}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-400">No card added yet</p>
            )}



            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-[#4222C4] text-center mb-4">Payment Details</h2>

                        {/* Cardholder Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-1">Cardholder Name</label>
                            <input
                                type="text"
                                name="holderName"
                                value={cardData.holderName}
                                onChange={handleChange}
                                placeholder="Enter cardholder name"
                                className="w-full p-3 border rounded-lg focus:outline-[#4222C4]"
                            />
                        </div>

                        {/* Card Number */}
                        <div className="mb-4 relative">
                            <label className="block text-gray-700 font-semibold mb-1">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={cardData.cardNumber}
                                onChange={handleChange}
                                placeholder="1234 5678 9101 1121"
                                className="w-full p-3 border rounded-lg pr-12 focus:outline-[#4222C4]"
                            />
                            <FaRegCreditCard className="absolute right-3 top-12 text-gray-500 text-xl" />
                        </div>

                        {/* Expiry Date & CVC */}
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-gray-700 font-semibold mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={cardData.expiryDate}
                                    onChange={handleChange}
                                    placeholder="MM/YY"
                                    className="w-full p-3 border rounded-lg focus:outline-[#4222C4]"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-gray-700 font-semibold mb-1">CVC</label>
                                <input
                                    type="text"
                                    name="cvc"
                                    value={cardData.cvc}
                                    onChange={handleChange}
                                    placeholder="123"
                                    className="w-full p-3 border rounded-lg focus:outline-[#4222C4]"
                                />
                            </div>
                        </div>

                        {/* Card Type Selection */}
                        <div className="mt-4">
                            <label className="block text-gray-700 font-semibold mb-2">Bottom shape is only for Card Color</label>
                            <div className="flex justify-between text-3xl flex-wrap gap-2">
                                {[
                                    { type: "Visa", icon: <FaCcVisa className="text-blue-600" /> },
                                    { type: "MasterCard", icon: <FaCcMastercard className="text-red-600" /> },
                                    { type: "Amex", icon: <FaCcAmex className="text-green-600" /> },
                                    { type: "Discover", icon: <FaCcDiscover className="text-orange-600" /> },
                                    { type: "Diners Club", icon: <FaCcDinersClub className="text-purple-600" /> },
                                    { type: "JCB", icon: <FaCcJcb className="text-yellow-600" /> }
                                ].map((card, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleCardType(card.type)}
                                        className={`p-2 rounded-lg transition ${cardData.cardType === card.type ? "bg-gray-200 shadow-md" : "text-gray-500"
                                            }`}
                                    >
                                        {card.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className={`mt-6 w-full bg-[#4222C4] text-white py-3 rounded-lg font-semibold transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#31189e]"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Card Detail"}
                        </button>
                        <button onClick={() => setShowModal(false)} className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

