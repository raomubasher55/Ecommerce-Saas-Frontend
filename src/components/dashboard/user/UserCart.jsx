import { useState, useEffect , useRef } from "react";
import { createOrder } from "../../../store/actions/orderActions";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function UserCart() {
  const [cart, setCart] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
    const [orderData, setOrderData] = useState({
        address: "",
        city: "",
        phoneNo: "",
        postalCode: "",
        country: ""
    });
    const formRef =useRef(null);
    const dispatch = useDispatch();

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("wishlist")) || [];
      const updatedCart = storedCart.map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));
      setCart(updatedCart);
    } catch (error) {
      console.error("Error fetching cart from localStorage:", error);
      setCart([]);
    }
  }, []);

  const shippingFee = 20;

  const updateQuantity = (id, newQuantity, stock) => {
    if (newQuantity < 1 || newQuantity > stock) return;
    const updatedCart = cart.map(item =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("wishlist", JSON.stringify(updatedCart));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.discountedPrice < item.price ? item.discountedPrice : item.price) * item.quantity, 0);
  const total = subtotal + shippingFee;


  const handleOrderSubmit = async () => {
    setLoading(true);
    if (Object.values(orderData).some((field) => !field)) {
        toast.error("Please fill in all shipping details");
        return;
    }
    
    const orderItems = cart.map((item) => ({
      name: item.name || "Default Name",
      quantity: item.quantity || 1,
      image: item.images?.[0]?.url || "default-image-url",
      price: item.discountedPrice < item.price ? item.discountedPrice : item.price,
      product: item?._id ,
      seller: item?.seller
   }));
   
  

    

    if (paymentMethod === "COD") {
        // Handle COD order
        const finalOrder = {
            shippingInfo: orderData,
            orderItems,
            paymentInfo: { method: paymentMethod },
            itemsPrice: cart?.discountedPrice < cart?.price ? cart?.discountedPrice : cart?.price * cart?.quantity,
            shippingPrice: 10,
            taxPrice: 5,
            totalPrice: cart?.discountedPrice < cart?.price ? cart?.discountedPrice : cart?.price * cart?.quantity + 15,
        };
        dispatch(createOrder(finalOrder));
    } else {
        // Handle online payment with Stripe
        try {
          setLoading(true);
            const body = {
            orderItems,
            shippingInfo: orderData,
            paymentInfo: { method: paymentMethod },
            itemsPrice: cart?.discountedPrice < cart?.price ? cart?.discountedPrice : cart?.price * cart?.quantity,
            shippingPrice: 10,
            taxPrice: 5,
            totalPrice: cart?.discountedPrice < cart?.price ? cart?.discountedPrice : cart?.price * cart?.quantity + 15,
            };

            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            };

          

            try {
              const response = await fetch(`${import.meta.env.VITE_REGISTER_API}api/v1/order/new`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
              });
             

              const data = await response.json();
              console.log(data);

              if (data.success && data.data.paymentUrl) {
                window.location.href = data.data.paymentUrl;
              } else {
                throw new Error('Something went wrong');
              }

            } catch (error) {
              console.error('Error:', error);
              toast.error('Payment failed: ' + error.message);
            }
            setLoading(false);
        } catch (error) {
            // toast.error(error.resonse || "Payment initialization failed");
            console.log(error);
        }
    }
};


const handleForm = ()=> {
  if(cart.length > 0){
    setShowForm(true)
  } else{
    toast.error('Your cart is empty')
  }
}


  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 px-4 py-6">
      {/* Cart Items */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
        <h2 className="text-2xl font-bold text-center text-[#4222C4] mb-4">
          Your Shopping Cart
        </h2>

        {cart.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center flex-col md:flex-row gap-4 border-b pb-4">
                <img
                  src={`${import.meta.env.VITE_APP}/${item?.images[0]?.url.replace(/\\/g, "/")}`}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  {item.discountedPrice < item.price ? (
                    <p className="text-red-500 text-sm">
                      ${item.discountedPrice.toFixed(2)}
                      <span className="line-through text-gray-400 ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">${item.price.toFixed(2)} each</p>
                  )}
                </div>
                <div className="w-amx">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1, item.stock)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1, item.stock)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <div className="font-semibold text-center sm:text-left mt-3 sm:mt-0 text-lg">
                    ${((item.discountedPrice < item.price ? item.discountedPrice : item.price) * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 ml-4 mt-4 sm:mb-0 border border-gray-300 bg-red-100 hover:bg-red-400 hover:text-white rounded p-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-6">Your cart is empty.</p>
        )}
      </div>


      {/* Order Summary */}
      <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-4 border border-gray-200">
        <h3 className="text-xl font-semibold text-[#4222C4] mb-4 text-center sm:text-left">Order Summary</h3>
        <div className="flex justify-between items-center mb-2">
          <span>Subtotal:</span>
          <span>D.A {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>Shipping:</span>
          <span>D.A {shippingFee.toFixed(2)}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total:</span>
          <span>D.A {total.toFixed(2)}</span>
        </div>
        <button onClick={handleForm} className="w-full bg-[#4222C4] text-white py-2 mt-6 rounded hover:bg-opacity-90">
          Proceed to Checkout
        </button>

        {showForm && (
                        <div ref={formRef} className="mt-10 bg-gray-100 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-700">Shipping Details</h3>
                            {Object.keys(orderData).map((field) => (
                                <input key={field} type="text" placeholder={field} className="w-full p-3 mt-3 border border-gray-300 rounded-md" value={orderData[field]} onChange={(e) => setOrderData({ ...orderData, [field]: e.target.value })} />
                            ))}
                            <h3 className="text-lg font-bold text-gray-700 mt-4">Payment Method</h3>
                            <select className="w-full p-3 mt-3 border border-gray-300 rounded-md" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="COD">Cash on Delivery</option>
                                <option value="Online">Card</option>
                            </select>
                            <button onClick={handleOrderSubmit} className="w-full mt-6 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">{loading ? "Processing..." : "Place Order"}</button>
                        </div>
                    )}

      </div>
    </div>
  );
}