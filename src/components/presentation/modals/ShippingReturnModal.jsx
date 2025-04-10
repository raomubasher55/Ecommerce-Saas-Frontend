import React from 'react';
import { FaTimes } from 'react-icons/fa';
import companyLogo from '../../../assets/logo.png';

export default function ShippingReturnModal({ type, onClose }) {
    const getModalContent = () => {
        switch (type) {
            case 'relay':
                return {
                    title: 'Relay Points Delivery',
                    description: 'Relay Points Delivery allows you to receive your package at a secure and convenient pickup location near you. This option is perfect if you have a busy schedule and cannot wait at home for your delivery. Once your order arrives, you will receive a notification with pickup details. Please carry a valid ID when collecting your package.',
                    cost: 'Delivery costs $10.00.',
                    timeframe: 'Estimated collection time: 3-5 business days.',
                    extraInfo: 'Relay Points ensure safety and flexibility. Your package will be held for up to 7 days before being returned if not collected.',
                };
            case 'delivery':
                return {
                    title: 'Home Delivery',
                    description: 'With Home Delivery, your order will be shipped directly to your doorstep. We partner with trusted courier services to ensure a fast and secure delivery experience. Please ensure someone is available to receive the package at the provided address.',
                    cost: 'Delivery costs $10.00.',
                    timeframe: 'Estimated delivery time: 3-5 business days.',
                    extraInfo: 'Tracking details will be shared with you once your order is shipped. In case of delays, our support team is available 24/7.',
                };
            case 'return':
                return {
                    title: 'Return & Refund Policy',
                    description: 'Our return policy allows you to return items within 7 days of delivery if you are not satisfied with your purchase. The item must be in its original condition, unused, and in the original packaging.',
                    cost: 'Returns are completely free.',
                    timeframe: 'Refunds will be processed within 3-7 business days after the returned item is received and inspected.',
                    extraInfo: 'To initiate a return, please contact our support team with your order number. If the product is damaged or incorrect, we will arrange a replacement or full refund.',
                };
            default:
                return {
                    title: 'Information',
                    description: 'No additional details available for this option.',
                    cost: '',
                    timeframe: '',
                    extraInfo: '',
                };
        }
    };

    const { title, description, cost, timeframe, extraInfo } = getModalContent();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
                    <FaTimes size={18} />
                </button>

                {/* Company Logo */}
                <div className="flex justify-center mb-4">
                    <img src={companyLogo} alt="Company Logo" className="w-24 h-auto" />
                </div>

                {/* Modal Content */}
                <h2 className="text-xl font-bold text-[#4222C4]">{title}</h2>
                <p className="text-gray-700 mt-2">{description}</p>
                {cost && <p className="text-gray-600 mt-2 font-medium">{cost}</p>}
                {timeframe && <p className="text-gray-600 mt-1">{timeframe}</p>}
                {extraInfo && <p className="text-gray-500 mt-2 text-sm">{extraInfo}</p>}
            </div>
        </div>
    );
}
