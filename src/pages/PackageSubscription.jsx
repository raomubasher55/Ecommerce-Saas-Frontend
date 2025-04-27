import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribePackage } from '../store/actions/packageActions';
import { FooterPrime } from '../components/presentation/FooterPrime';
import { AllAbouJumiaFooter } from '../components/presentation/AllAbouJumiaFooter';
import { HeroBanner } from '../components/homepage/HeroBanner';
import Navbar from '../components/homepage/Navbar';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const PackageSubscription = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.package);
  const { selectedLanguage, translateText } = useLanguage();
  const [plans, setPlans] = useState([]);
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
  });



  useEffect(() => {
    fetchPlans();
  }, []);

  console.log(plans)
  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/subscription`);
      const fetchedPlans = res.data;
      setPlans(fetchedPlans);

      const featureSet = new Set();
      fetchedPlans.forEach(plan => {
        Object.keys(plan.features).forEach(feature => featureSet.add(feature));
      });
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

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
      });
    };

    translateContent();
  }, [selectedLanguage, translateText]);


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
    // if (!selectedPackage || !paymentMethod) {
    //   alert(translatedContent.validationAlert);
    //   return;
    // }
    dispatch(subscribePackage(selectedPackage.name, paymentMethod));
  };

  function formatFeatureName(feature) {
    return feature
      .replace(/([A-Z])/g, ' $1')      
      .replace(/\s+/g, ' ')   
      .trim()
      .replace(/^./, str => str.toUpperCase());
  }
  
  function formatFeatureValue(value) {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return value; 
  }
  

  return (
    <>
      <HeroBanner />
      <Navbar />
      <div className="my-10 p-6 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-extrabold text-center text-[#4222c4] mb-8">
          {translatedContent.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {[...plans]
    .sort((a, b) => a.price - b.price)
    .map((pkg, idx) => (
      <div
        key={pkg._id}
        className={`relative p-3 bg-gradient-to-b from-[#f5f8ff] to-[#ffffff] shadow-lg border rounded-lg transform hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300
          ${idx === 1 ? 'border-4 border-[#4222C4]' : ''}
        `}
      >
        {/* Recommended Badge */}
        {idx === 1 && (
          <div className="absolute top-2 right-2 bg-[#4222C4] text-white text-xs font-bold px-2 py-1 rounded">
            Recommended
          </div>
        )}

        <h3 className="text-2xl font-bold text-[#4222C4] mb-4">
          {pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)}
        </h3>

        <p className="text-lg text-gray-700 font-medium mb-3">
          {translatedContent.priceLabel}{" "}
          <span className="font-bold text-[#4222C4]">{pkg.price} A.D</span>
        </p>

        <ul className="space-y-2">
  {pkg.features &&
    Object.entries(pkg.features)
      .map(([feature, value]) => (
        <li
          key={feature}
          className="flex items-center justify-between text-gray-800 text-sm 
                     border border-gray-300 rounded-md px-3 py-2 
                     hover:shadow-md hover:border-[#4222C4] transition-all duration-300"
        >
          {/* Fixed width for feature name */}
          <span className="font-semibold text-[#4222C4] w-40 text-left">
            {formatFeatureName(feature)}:
          </span>
          {/* Fixed width for value */}
          <span className="w-32 text-left">
            {formatFeatureValue(value)}
          </span>
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