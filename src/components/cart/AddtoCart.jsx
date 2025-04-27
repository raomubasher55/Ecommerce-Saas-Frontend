import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { createOrder } from "../../store/actions/orderActions";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../utils/Loader";
import { getSingleProduct } from "../../store/actions/productActions";
import { useLanguage } from "../../context/LanguageContext";

export default function AddToCart() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const token = localStorage.getItem('token');
    const { loading: productLoading, product } = useSelector((state) => state.SingleproductDetails);
    const { loading, success, error, order } = useSelector((state) => state.orderCreate);
    const navigate = useNavigate();
    const { selectedLanguage, translateText } = useLanguage();
    const [translatedProduct, setTranslatedProduct] = useState({
        name: "",
        description: ""
    });

    const [translatedContent, setTranslatedContent] = useState({
        returnBack: "Return Back",
        shippingDetails: "Shipping Details",
        paymentMethod: "Payment Method",
        cashOnDelivery: "Cash on Delivery",
        cardPayment: "Card",
        placeOrder: "Place Order",
        processing: "Processing...",
        fillDetailsError: "Please fill in all shipping details",
        orderSuccess: "Order placed successfully!",
        paymentFailed: "Payment failed: ",
        orderId: "Order ID:",
        status: "Status:",
        totalPrice: "Total Price:",
        orderItems: "Order Items:",
        nextProcess: "Next Process",
        quantity: "Quantity",
        address: "Address",
        city: "City",
        phoneNo: "Phone Number",
        postalCode: "Postal Code",
        country: "Country"
    });

    useEffect(() => {
        const translateContent = async () => {
            const translations = await Promise.all([
                translateText("Return Back"),
                translateText("Shipping Details"),
                translateText("Payment Method"),
                translateText("Cash on Delivery"),
                translateText("Card"),
                translateText("Place Order"),
                translateText("Processing..."),
                translateText("Please fill in all shipping details"),
                translateText("Order placed successfully!"),
                translateText("Payment failed: "),
                translateText("Order ID:"),
                translateText("Status:"),
                translateText("Total Price:"),
                translateText("Order Items:"),
                translateText("Next Process"),
                translateText("Quantity"),
                translateText("Address"),
                translateText("City"),
                translateText("Phone Number"),
                translateText("Postal Code"),
                translateText("Country")
            ]);

            setTranslatedContent({
                returnBack: translations[0],
                shippingDetails: translations[1],
                paymentMethod: translations[2],
                cashOnDelivery: translations[3],
                cardPayment: translations[4],
                placeOrder: translations[5],
                processing: translations[6],
                fillDetailsError: translations[7],
                orderSuccess: translations[8],
                paymentFailed: translations[9],
                orderId: translations[10],
                status: translations[11],
                totalPrice: translations[12],
                orderItems: translations[13],
                nextProcess: translations[14],
                quantity: translations[15],
                address: translations[16],
                city: translations[17],
                phoneNo: translations[18],
                postalCode: translations[19],
                country: translations[20]
            });
        };

        translateContent();
    }, [selectedLanguage, translateText]);

    useEffect(() => {
        dispatch(getSingleProduct(id));
    }, [dispatch, id]);

    const [quantity, setQuantity] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [orderData, setOrderData] = useState({
        address: "",
        city: "",
        phoneNo: "",
        postalCode: "",
        country: ""
    });
    useEffect(() => {
        dispatch(getSingleProduct(id));
    }, [dispatch, id]);

    useEffect(() => {
        const translateProductDetails = async () => {
            if (product?.name || product?.description) {
                const [name, description] = await Promise.all([
                    translateText(product.name),
                    translateText(product.description)
                ]);
                setTranslatedProduct({ name, description });
            }
        };

        translateProductDetails();
    }, [product, translateText]);


    const maxStock = product?.stock || 1;
    const finalPrice = product?.discountedPrice ? product?.discountedPrice : product?.price;

    const handleIncrease = () => {
        setQuantity((prev) => Math.min(prev + 1, maxStock));
    };

    const handleDecrease = () => {
        setQuantity((prev) => Math.max(prev - 1, 1));
    };

    const handleNextProcess = () => {
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 300);
    };

    const handleOrderSubmit = async () => {
        if (Object.values(orderData).some((field) => !field)) {
            toast.error(translatedContent.fillDetailsError);
            return;
        }

        const orderItems = [{
            name: product?.name,
            quantity,
            image: product?.images?.[0]?.url || "",
            price: finalPrice,
            product: product?._id,
            seller: product?.seller
        }];

        if (paymentMethod === "COD") {
            const finalOrder = {
                shippingInfo: orderData,
                orderItems,
                paymentInfo: { method: paymentMethod },
                itemsPrice: finalPrice * quantity,
                shippingPrice: 10,
                taxPrice: 5,
                totalPrice: finalPrice * quantity + 15,
            };
            dispatch(createOrder(finalOrder));
        } else {
            try {
                const body = {
                    orderItems,
                    shippingInfo: orderData,
                    paymentInfo: { method: paymentMethod },
                    itemsPrice: finalPrice * quantity,
                    shippingPrice: 10,
                    taxPrice: 5,
                    totalPrice: finalPrice * quantity + 15,
                };

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                try {
                    const response = await fetch(`${import.meta.env.VITE_APP}/api/v1/order/new`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(body)
                    })
                    const data = await response.json();
                    if (data.success && data.data.paymentUrl) {
                        window.location.href = data.data.paymentUrl;
                    } else {
                        throw new Error(translatedContent.paymentFailed);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    toast.error(translatedContent.paymentFailed + error.message);
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (success) {
            toast.success(translatedContent.orderSuccess);
        }
        setTimeout(() => {
            navigate(`/single-product/${id}`);
        }, 2000);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (sessionId) {
            const createOrderAfterPayment = async () => {
                try {
                    const orderItems = [{
                        name: product?.name,
                        quantity,
                        image: product?.images?.[0]?.url || "",
                        price: finalPrice,
                        product: product?._id
                    }];

                    const finalOrder = {
                        shippingInfo: orderData,
                        orderItems,
                        paymentInfo: {
                            id: sessionId,
                            status: 'paid',
                            method: 'online'
                        },
                        itemsPrice: finalPrice * quantity,
                        shippingPrice: 10,
                        taxPrice: 5,
                        totalPrice: finalPrice * quantity + 15,
                    };

                    dispatch(createOrder(finalOrder));
                    toast.success(translatedContent.orderSuccess);
                    setTimeout(() => {
                        navigate(`/single-product/${id}`);
                    }, 2000);
                } catch (error) {
                    toast.error(translatedContent.paymentFailed);
                }
            };

            createOrderAfterPayment();
        }
    }, [success, error, dispatch]);

    if (productLoading) return <Loader />;

    return (
        <div>
            <HeroBanner />
            <Navbar />


            <button
                className=" bg-blue-600 m-3 sm:m-10 mb-0 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out z-50"
                onClick={() => navigate(`/single-product/${id}`)}
            >
                {translatedContent.returnBack}
            </button>
            <div className="sm:w-[700px] mx-auto mt-10 px-4 relative">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:space-x-8">
                        <div className="w-full md:w-1/3">
                            <img
                                src={product?.images?.[0]?.url ? `${import.meta.env.VITE_APP}/${product.images[0].url.replace(/\\/g, "/")}` : "https://via.placeholder.com/200"}
                                alt={product?.name || "Product Image"}
                                className="w-full h-64 object-cover rounded-lg shadow-md"
                            />
                        </div>
                        <div className="w-full md:w-2/3 mt-6 md:mt-0">
                            <h2 className="text-3xl font-bold text-gray-800">{translatedProduct.name || product?.name}</h2>
                            <p className="text-gray-600 mt-2">{translatedProduct.description || product?.description}</p>


                            <div className="mt-4 flex items-center space-x-6">
                                {product?.discountedPrice !== undefined &&
                                    product?.discountedPrice !== product?.price ? (
                                    <>
                                        <span className="text-xl font-bold text-red-500">
                                            A.D {product.discountedPrice * quantity}
                                        </span>
                                        <span className="text-sm text-gray-400 line-through">
                                            A.D {product.price * quantity}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xl font-bold text-gray-900">
                                        A.D {product.price * quantity}
                                    </span>
                                )}
                            </div>


                            <div className="mt-4 flex items-center space-x-6">
                                <button onClick={handleDecrease} className="bg-gray-200 p-2 rounded-full text-gray-700">-</button>
                                <span className="text-xl">{quantity}</span>
                                <button onClick={handleIncrease} className="bg-gray-200 p-2 rounded-full text-gray-700">+</button>
                            </div>
                            <button onClick={handleNextProcess} className="w-full mt-6 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {translatedContent.nextProcess}
                            </button>
                        </div>
                    </div>

                    {showForm && (
                        <div ref={formRef} className="mt-10 bg-gray-100 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-700">{translatedContent.shippingDetails}</h3>
                            {Object.entries({
                                address: translatedContent.address,
                                city: translatedContent.city,
                                phoneNo: translatedContent.phoneNo,
                                postalCode: translatedContent.postalCode,
                                country: translatedContent.country
                            }).map(([field, placeholder]) => (
                                <input
                                    key={field}
                                    type="text"
                                    placeholder={placeholder}
                                    className="w-full p-3 mt-3 border border-gray-300 rounded-md"
                                    value={orderData[field]}
                                    onChange={(e) => setOrderData({ ...orderData, [field]: e.target.value })}
                                />
                            ))}
                            <h3 className="text-lg font-bold text-gray-700 mt-4">{translatedContent.paymentMethod}</h3>
                            <select className="w-full p-3 mt-3 border border-gray-300 rounded-md" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="COD">{translatedContent.cashOnDelivery}</option>
                                <option value="Online">{translatedContent.cardPayment}</option>
                            </select>
                            <button onClick={handleOrderSubmit} className="w-full mt-6 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                                {loading ? translatedContent.processing : translatedContent.placeOrder}
                            </button>
                        </div>
                    )}

                    {success && order && (
                        <div className="mt-10 bg-green-100 p-1 rounded-lg">
                            <h3 className="text-lg font-bold text-green-700">{translatedContent.orderSuccess}</h3>
                            <p><strong>{translatedContent.orderId}</strong> {order?.order?._id}</p>
                            <p><strong>{translatedContent.status}</strong> {order?.order?.orderStatus}</p>
                            <p><strong>{translatedContent.totalPrice}</strong> ${order?.order?.totalPrice}</p>
                            <h4 className="text-md font-bold mt-2">{translatedContent.shippingDetails}:</h4>
                            <p>{order?.order?.shippingInfo?.address}, {order?.order?.shippingInfo?.city}, {order?.order?.shippingInfo?.country}</p>
                            <h4 className="text-md font-bold mt-2">{translatedContent.orderItems}:</h4>
                            {order?.order?.orderItems.map((item, index) => (
                                <p key={index}>{item.quantity}x {item.name} - ${item.price}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <FooterPrime />
            <AllAbouJumiaFooter />
        </div>
    );
}