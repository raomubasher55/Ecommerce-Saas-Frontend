import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribePackage } from '../store/actions/packageActions';
import { FooterPrime } from '../components/presentation/FooterPrime';
import { AllAbouJumiaFooter } from '../components/presentation/AllAbouJumiaFooter';
import { HeroBanner } from '../components/homepage/HeroBanner';
import Navbar from '../components/homepage/Navbar';
import { useLanguage } from '../context/LanguageContext';

const PackageSubscription = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.package);
  const { selectedLanguage, translateText } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    title: "Available Packages",
    priceLabel: "Price:",
    subscribeButton: "Subscribe",
    modalTitle: "Subscribe to",
    paymentMethodLabel: "Payment Method",
    selectPayment: "Select Payment Method",
    cardPayment: "Card Payment",
    cancelButton: "Cancel",
    confirmButton: "Confirm Subscription",
    processingButton: "Processing...",
    validationAlert: "Please select a package and payment method",
    featureLabels: {
      Products: "Products",
      Support: "Support",
      Analytics: "Analytics",
      Payments: "Payments",
      Marketing_Tools: "Marketing Tools",
      Global_Reach: "Global Reach",
      Referral_Program: "Referral Program",
      Transactions: "Transactions"
    },
    featureValues: {
      Basic: "Basic",
      Priority: "Priority",
      Advanced: "Advanced",
      Standard: "Standard",
      Premium: "Premium",
      Full: "Full",
      Unlimited: "Unlimited",
      Customized: "Customized",
      Yes: "Yes",
      No: "No"
    }
  });

  useEffect(() => {
    const translateContent = async () => {
      const translations = await Promise.all([
        translateText("Available Packages"),
        translateText("Price:"),
        translateText("Subscribe"),
        translateText("Subscribe to"),
        translateText("Payment Method"),
        translateText("Select Payment Method"),
        translateText("Card Payment"),
        translateText("Cancel"),
        translateText("Confirm Subscription"),
        translateText("Processing..."),
        translateText("Please select a package and payment method"),
        // Feature labels
        translateText("Products"),
        translateText("Support"),
        translateText("Analytics"),
        translateText("Payments"),
        translateText("Marketing Tools"),
        translateText("Global Reach"),
        translateText("Referral Program"),
        translateText("Transactions"),
        // Feature values
        translateText("Basic"),
        translateText("Priority"),
        translateText("Advanced"),
        translateText("Standard"),
        translateText("Premium"),
        translateText("Full"),
        translateText("Unlimited"),
        translateText("Customized"),
        translateText("Yes"),
        translateText("No")
      ]);

      setTranslatedContent({
        title: translations[0],
        priceLabel: translations[1],
        subscribeButton: translations[2],
        modalTitle: translations[3],
        paymentMethodLabel: translations[4],
        selectPayment: translations[5],
        cardPayment: translations[6],
        cancelButton: translations[7],
        confirmButton: translations[8],
        processingButton: translations[9],
        validationAlert: translations[10],
        featureLabels: {
          Products: translations[11],
          Support: translations[12],
          Analytics: translations[13],
          Payments: translations[14],
          Marketing_Tools: translations[15],
          Global_Reach: translations[16],
          Referral_Program: translations[17],
          Transactions: translations[18]
        },
        featureValues: {
          Basic: translations[19],
          Priority: translations[20],
          Advanced: translations[21],
          Standard: translations[22],
          Premium: translations[23],
          Full: translations[24],
          Unlimited: translations[25],
          Customized: translations[26],
          Yes: translations[27],
          No: translations[28]
        }
      });
    };

    translateContent();
  }, [selectedLanguage, translateText]);

  const packageData = {
    Starter: {
      name: "Starter",
      price: 800,
      features: {
        Products: 3,
        Support: translatedContent.featureValues.Basic + " Email Support",
        Analytics: translatedContent.featureValues.Basic + " Analytics",
        Payments: translatedContent.featureValues.Standard + " Gateways",
        Marketing_Tools: translatedContent.featureValues.No,
        Global_Reach: translatedContent.featureValues.No,
        Referral_Program: translatedContent.featureValues.No,
        Transactions: "Up to 800 DZD/month",
      },
    },
    Classic: {
      name: "Classic",
      price: 1500,
      features: {
        Products: 6,
        Support: translatedContent.featureValues.Priority + " Email Support",
        Analytics: translatedContent.featureValues.Advanced + " Analytics",
        Payments: translatedContent.featureValues.Standard + " + " + translatedContent.featureValues.Premium + " Gateways",
        Marketing_Tools: translatedContent.featureValues.Yes,
        Global_Reach: translatedContent.featureValues.Yes,
        Referral_Program: translatedContent.featureValues.No,
        Transactions: "Up to 1500 DZD/month",
      },
    },
    Growth: {
      name: "Growth",
      price: 2400,
      features: {
        Products: 10,
        Support: "24/7 Support",
        Analytics: translatedContent.featureValues.Full + " Analytics Suite",
        Payments: "All Gateways + Custom Integrations",
        Marketing_Tools: translatedContent.featureValues.Yes,
        Global_Reach: translatedContent.featureValues.Yes,
        Referral_Program: translatedContent.featureValues.Yes,
        Transactions: "Up to 2,400 DZD/month",
      },
    },
    Enterprise: {
      name: "Enterprise",
      price: translatedContent.featureValues.OnRequest,
      features: {
        Products: translatedContent.featureValues.Customized,
        Support: "Dedicated Account Manager",
        Analytics: "Custom Analytics and Reporting",
        Payments: "All Gateways + Custom Integrations",
        Marketing_Tools: translatedContent.featureValues.Yes,
        Global_Reach: translatedContent.featureValues.Yes,
        Referral_Program: translatedContent.featureValues.Yes,
        Transactions: translatedContent.featureValues.Unlimited,
      },
    },
  };

  const openModal = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setPaymentMethod('');
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPackage || !paymentMethod) {
      alert(translatedContent.validationAlert);
      return;
    }
    dispatch(subscribePackage(selectedPackage.name, paymentMethod));
  };

  return (
    <>
      <HeroBanner />
      <Navbar />
      <div className="my-10 p-6 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-extrabold text-center text-[#4222C4] mb-8">
          {translatedContent.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.values(packageData).map((pkg) => (
            <div
              key={pkg.name}
              className="p-3 bg-gradient-to-b from-[#f5f8ff] to-[#ffffff] shadow-lg border rounded-lg transform hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300"
            >
              <h3 className="text-2xl font-bold text-[#4222C4] mb-4">
                {pkg.name}
              </h3>
              <p className="text-lg text-gray-700 font-medium mb-3">
                {translatedContent.priceLabel} <span className="font-bold text-[#4222C4]">{pkg.price} DZD</span>
              </p>
              <ul className="space-y-2">
                {Object.entries(pkg.features).map(([feature, value]) => (
                  <li key={feature} className="flex items-center text-gray-800 text-sm">
                    <span className="font-semibold text-[#4222C4] mr-2">
                      {translatedContent.featureLabels[feature] || feature}:
                    </span>
                    <span>{value.toString()}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openModal(pkg)}
                className="mt-6 w-full bg-[#4222C4] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#3618a0] transition-colors duration-300"
              >
                {translatedContent.subscribeButton}
              </button>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold mb-6">
                {translatedContent.modalTitle} {selectedPackage.name}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    {translatedContent.paymentMethodLabel}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4222C4] transition duration-300"
                  >
                    <option value="">{translatedContent.selectPayment}</option>
                    <option value="Card">{translatedContent.cardPayment}</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={closeModal} 
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                  >
                    {translatedContent.cancelButton}
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="px-4 py-2 bg-[#4222C4] text-white rounded-lg hover:bg-[#3618a0] transition-colors duration-300"
                  >
                    {loading ? translatedContent.processingButton : translatedContent.confirmButton}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <FooterPrime />
      <AllAbouJumiaFooter />
    </>
  );
};

export default PackageSubscription;