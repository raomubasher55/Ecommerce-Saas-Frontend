import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStore } from '../../../store/actions/storeActions';
import { paymentWithdraw } from '../../../store/actions/storeActions';
import { toast } from 'react-toastify';
import WithdrawHistory from './WithdrawHistory';

const Withdraw = () => {
    const dispatch = useDispatch();
    const { store } = useSelector((state) => state.store);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
console.log(store)
    useEffect(() => {
        dispatch(fetchStore());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if(amount <= 100) {
            toast.error('Amount must be greater than 100');
            setLoading(false);
            return;
        }

        try {
            await dispatch(paymentWithdraw(amount));
            toast.success('Withdrawal request submitted! Funds will arrive in 3-5 business days');
            setAmount(0);
            dispatch(fetchStore()); // Refresh store data
        } catch (error) {
            toast.error(error.response?.data?.error.message || 'Withdrawal failed');
        } finally {
            setLoading(false);
        }
    };

    return (
<div className="max-w-4xl mx-auto space-y-8 px-4">
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Withdraw Funds</h2>

        {/* Balance Display */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-700">Available Balance</p>
            <p className="text-xl font-bold text-blue-600">${store?.totalSales?.toFixed(2) || 0}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    Withdrawal Amount
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
                    placeholder="Enter amount to withdraw"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {loading ? 'Processing...' : 'Request Withdrawal'}
            </button>
        </form>

        {/* Note */}
        <div className="mt-4 text-sm text-gray-500 text-center">
            <p>Withdrawals typically process within <span className="font-medium">3-5 business days</span>.</p>
        </div>
    </div>

    <div className='w-full'>
    <WithdrawHistory />
    </div>
</div>

    );
};

export default Withdraw;
