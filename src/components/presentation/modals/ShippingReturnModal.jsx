import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import companyLogo from '../../../assets/logo.png';
import { useLanguage } from '../../../context/LanguageContext';

export default function ShippingReturnModal({ type, onClose }) {
    const { selectedLanguage, translateText } = useLanguage();
    const [translatedContent, setTranslatedContent] = useState({
        title: '',
        description: '',
        cost: '',
        timeframe: '',
        extraInfo: ''
    });

    useEffect(() => {
        const translateModalContent = async () => {
            let content;
            switch (type) {
                case 'relay':
                    content = {
                        title: await translateText('Relay Points Delivery'),
                        description: await translateText('Relay Points Delivery allows you to receive your package at a secure and convenient pickup location near you. This option is perfect if you have a busy schedule and cannot wait at home for your delivery. Once your order arrives, you will receive a notification with pickup details. Please carry a valid ID when collecting your package.'),
                        cost: await translateText('Delivery costs $10.00.'),
                        timeframe: await translateText('Estimated collection time: 3-5 business days.'),
                        extraInfo: await translateText('Relay Points ensure safety and flexibility. Your package will be held for up to 7 days before being returned if not collected.')
                    };
                    break;
                case 'delivery':
                    content = {
                        title: await translateText('Home Delivery'),
                        description: await translateText('With Home Delivery, your order will be shipped directly to your doorstep. We partner with trusted courier services to ensure a fast and secure delivery experience. Please ensure someone is available to receive the package at the provided address.'),
                        cost: await translateText('Delivery costs $10.00.'),
                        timeframe: await translateText('Estimated delivery time: 3-5 business days.'),
                        extraInfo: await translateText('Tracking details will be shared with you once your order is shipped. In case of delays, our support team is available 24/7.')
                    };
                    break;
                case 'return':
                    content = {
                        title: await translateText('Return & Refund Policy'),
                        description: await translateText('Our return policy allows you to return items within 7 days of delivery if you are not satisfied with your purchase. The item must be in its original condition, unused, and in the original packaging.'),
                        cost: await translateText('Returns are completely free.'),
                        timeframe: await translateText('Refunds will be processed within 3-7 business days after the returned item is received and inspected.'),
                        extraInfo: await translateText('To initiate a return, please contact our support team with your order number. If the product is damaged or incorrect, we will arrange a replacement or full refund.')
                    };
                    break;
                default:
                    content = {
                        title: await translateText('Information'),
                        description: await translateText('No additional details available for this option.'),
                        cost: '',
                        timeframe: '',
                        extraInfo: ''
                    };
            }
            setTranslatedContent(content);
        };

        translateModalContent();
    }, [type, selectedLanguage, translateText]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    aria-label={selectedLanguage === 'ar' ? 'إغلاق' : 'Close'}
                >
                    <FaTimes size={18} />
                </button>

                {/* Company Logo */}
                <div className="flex justify-center mb-4">
                    <img 
                        src={companyLogo} 
                        alt={selectedLanguage === 'ar' ? 'شعار الشركة' : 'Company Logo'} 
                        className="w-24 h-auto" 
                    />
                </div>

                {/* Modal Content */}
                <h2 className="text-xl font-bold text-[#4222C4]">{translatedContent.title}</h2>
                <p className="text-gray-700 mt-2">{translatedContent.description}</p>
                {translatedContent.cost && <p className="text-gray-600 mt-2 font-medium">{translatedContent.cost}</p>}
                {translatedContent.timeframe && <p className="text-gray-600 mt-1">{translatedContent.timeframe}</p>}
                {translatedContent.extraInfo && <p className="text-gray-500 mt-2 text-sm">{translatedContent.extraInfo}</p>}
            </div>
        </div>
    );
}