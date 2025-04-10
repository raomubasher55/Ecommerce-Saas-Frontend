import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStore } from '../../../store/actions/storeActions';
import { format } from 'date-fns';

const WithdrawHistory = () => {
    const dispatch = useDispatch();
    const { store } = useSelector((state) => state.store);

    useEffect(() => {
        dispatch(fetchStore());
    }, [dispatch]);

    return (
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <h3 className="text-xl font-semibold p-4 border-b">Withdrawal History</h3>

            {/* Table Wrapper with Scroll for Mobile */}
            <div className="relative overflow-x-auto md:overflow-hidden pb-4">
                {/* Desktop Table (Hidden on Mobile) */}
                <table className="w-full min-w-[600px] md:table hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {store?.withdraw?.map((withdrawal) => (
                            <tr key={withdrawal.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {format(new Date(withdrawal.createdAt), 'MMM dd, yyyy HH:mm')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    ${withdrawal.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <StatusBadge status={withdrawal.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    {withdrawal.id}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile List View (Hidden on Desktop) */}
            <div className="md:hidden">
                {store?.withdraw?.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-4 border-b">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium text-sm">
                                    {format(new Date(withdrawal.createdAt), 'MMM dd, HH:mm')}
                                </p>
                            </div>
                            <StatusBadge status={withdrawal.status} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Amount:</span>
                            <span className="font-medium">${withdrawal.amount.toFixed(2)}</span>
                        </div>
                                <p className="text-[10px] sm:text-xs text-gray-500">ID: {withdrawal.id}</p>
                    </div>
                ))}
            </div>

            {/* No Data Message */}
            {store?.withdraw?.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                    No withdrawal history found
                </div>
            )}
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => (
    <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'completed'
                ? 'bg-green-100 text-green-800'
                : status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
        }`}
    >
        {status}
    </span>
);

export default WithdrawHistory;
