import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaHourglassHalf } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const WatingForAp = () => {
  const navigate = useNavigate();
  const { selectedLanguage, translateText } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(120);
  const [translatedContent, setTranslatedContent] = useState({
    title: "Documents Under Review",
    description: "Your documents are currently being reviewed by our team. This process typically takes 24-48 hours.",
    whatsNext: {
      title: "What's Next?",
      items: [
        "Our team will verify your submitted documents",
        "You'll receive an email notification once approved",
        "You can then proceed with setting up your store"
      ]
    },
    countdownText: "Auto-returning home in:",
    buttons: {
      makePayment: "Make Payment",
      returnHome: "Return Home",
      contactSupport: "Contact Support"
    },
    helpText: "Need help? Contact our support team at",
    statusTitle: "Document Status",
    statusItems: [
      {
        title: "Documents Submitted",
        status: "Completed"
      },
      {
        title: "Under Review",
        status: "In Progress"
      },
      {
        title: "Final Approval",
        status: "Pending"
      }
    ]
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleReturnHome();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const translateAll = async () => {
      if (selectedLanguage === "English") return;

      try {
        const newContent = { ...translatedContent };
        
        // Translate main content
        newContent.title = await translateText("Documents Under Review");
        newContent.description = await translateText("Your documents are currently being reviewed by our team. This process typically takes 24-48 hours.");
        
        // Translate "What's Next" section
        newContent.whatsNext.title = await translateText("What's Next?");
        newContent.whatsNext.items = await Promise.all(
          translatedContent.whatsNext.items.map(item => translateText(item))
        );
        
        // Translate buttons and other text
        newContent.countdownText = await translateText("Auto-returning home in:");
        newContent.buttons.makePayment = await translateText("Make Payment");
        newContent.buttons.returnHome = await translateText("Return Home");
        newContent.buttons.contactSupport = await translateText("Contact Support");
        newContent.helpText = await translateText("Need help? Contact our support team at");
        
        // Translate status items
        newContent.statusTitle = await translateText("Document Status");
        newContent.statusItems = await Promise.all(
          translatedContent.statusItems.map(async (item) => ({
            title: await translateText(item.title),
            status: await translateText(item.status)
          }))
        );

        setTranslatedContent(newContent);
      } catch (error) {
        console.error("Translation error:", error);
      }
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaFileAlt className="text-6xl text-purple-600" />
            <div className="absolute -top-2 -right-2">
              <FaHourglassHalf className="text-3xl text-yellow-500 animate-pulse" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {translatedContent.title}
        </h1>

        <p className="text-gray-600 mb-6">
          {translatedContent.description}
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="font-semibold text-purple-700 mb-2">{translatedContent.whatsNext.title}</h2>
            <ul className="text-left text-gray-600 space-y-2">
              {translatedContent.whatsNext.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="text-lg font-semibold text-gray-800 mb-6">
          {translatedContent.countdownText} <span className="text-red-600">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>

        <button
          onClick={() => navigate('/upload-documents/choose-plans')}
          className="w-full bg-[#4222C4] text-white py-3 px-6 rounded-lg hover:bg-[#3618a0] transition-colors duration-300"
        >
          {translatedContent.buttons.makePayment}
        </button>

        {/* Return Home Button */}
        <button
          onClick={handleReturnHome}
          className="w-full bg-red-500 text-white py-3 px-6 mt-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
        >
          {translatedContent.buttons.returnHome}
        </button>

        <div className="space-y-4 mt-4">
          <button
            onClick={() => navigate('/contact-us')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-300"
          >
            {translatedContent.buttons.contactSupport}
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>{translatedContent.helpText}</p>
          <a href="mailto:contact@cebleu.com" className="text-purple-600 hover:text-purple-700">
            contact@cebleu.com
          </a>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mt-8 bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{translatedContent.statusTitle}</h2>
        <div className="space-y-4">
          {translatedContent.statusItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex-shrink-0 h-4 w-4 rounded-full ${
                index === 0 ? 'bg-green-500' : 
                index === 1 ? 'bg-yellow-500 animate-pulse' : 'bg-gray-200'
              }`}></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatingForAp;