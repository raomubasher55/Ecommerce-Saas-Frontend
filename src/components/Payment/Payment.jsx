import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { processPayment, createOrder } from '../../store/actions/orderActions';
import Loader from '../layout/Loader';

const Payment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const { paymentLoading, clientSecret, paymentError } = useSelector(state => state.order);
    
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

    useEffect(() => {
        if (orderInfo) {
            dispatch(processPayment({
                amount: Math.round(orderInfo.totalPrice * 100)
            }));
        }
    }, [dispatch, orderInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        if (!stripe || !elements || !clientSecret) {
            setProcessing(false);
            return;
        }

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    const order = {
                        orderItems: cartItems,
                        shippingInfo,
                        itemsPrice: orderInfo.itemsPrice,
                        taxPrice: orderInfo.taxPrice,
                        shippingPrice: orderInfo.shippingPrice,
                        totalPrice: orderInfo.totalPrice,
                        paymentInfo: {
                            id: result.paymentIntent.id,
                            status: result.paymentIntent.status,
                            method: 'Online'
                        }
                    };

                    await dispatch(createOrder(order));
                    navigate('/order/success');
                }
            }
        } catch (err) {
            setError(err.message);
            setProcessing(false);
        }
    };

    if (paymentLoading) {
        return <Loader />;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Card Payment</h2>
            {(error || paymentError) && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error || paymentError}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!stripe || processing || paymentLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {processing ? 'Processing...' : `Pay ₹${orderInfo?.totalPrice || 0}`}
                </button>
            </form>
        </div>
    );
};

export default Payment;