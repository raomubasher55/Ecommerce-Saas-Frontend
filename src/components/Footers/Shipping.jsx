import React, { useEffect, useState } from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import shippingImage from "../../assets/contact.jpg";
import { useLanguage } from "../../context/LanguageContext";

export default function Shipping() {
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    shippingReturns: "Shipping & Returns",
    shippingMethods: "🚚 Shipping Methods & Estimated Delivery",
    standardShipping: "Standard Shipping: 5-7 business days",
    expressShipping: "Express Shipping: 2-3 business days",
    overnightShipping: "Overnight Shipping: 1 business day",
    trackingOrder: "📦 Tracking Your Order",
    trackingText: "You can check your order details in the user dashboard. To track your order, enter your order ID in the \"Track Order\" section.",
    internationalShipping: "🌍 International Shipping",
    internationalText: "We offer international shipping to select countries. Delivery times vary based on destination & customs.",
    needHelp: "❓ Need Help?",
    helpText1: "Our dedicated support team is here to assist you with any questions regarding your orders, shipping, returns, or any other concerns.",
    helpText2: "Feel free to reach out to us for quick assistance. We strive to respond as soon as possible to ensure a smooth shopping experience.",
    contactText: "Contact us at",
    contactEmail: "cebleu@contact.com"
  });

  useEffect(() => {
    const translateAll = async () => {
      const translations = await Promise.all([
        translateText("Shipping & Returns"),
        translateText("🚚 Shipping Methods & Estimated Delivery"),
        translateText("Standard Shipping: 5-7 business days"),
        translateText("Express Shipping: 2-3 business days"),
        translateText("Overnight Shipping: 1 business day"),
        translateText("📦 Tracking Your Order"),
        translateText("You can check your order details in the user dashboard. To track your order, enter your order ID in the \"Track Order\" section."),
        translateText("🌍 International Shipping"),
        translateText("We offer international shipping to select countries. Delivery times vary based on destination & customs."),
        translateText("❓ Need Help?"),
        translateText("Our dedicated support team is here to assist you with any questions regarding your orders, shipping, returns, or any other concerns."),
        translateText("Feel free to reach out to us for quick assistance. We strive to respond as soon as possible to ensure a smooth shopping experience."),
        translateText("Contact us at"),
        translateText("cebleu@contact.com")
      ]);

      setTranslatedContent({
        shippingReturns: translations[0],
        shippingMethods: translations[1],
        standardShipping: translations[2],
        expressShipping: translations[3],
        overnightShipping: translations[4],
        trackingOrder: translations[5],
        trackingText: translations[6],
        internationalShipping: translations[7],
        internationalText: translations[8],
        needHelp: translations[9],
        helpText1: translations[10],
        helpText2: translations[11],
        contactText: translations[12],
        contactEmail: translations[13]
      });
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  return (
    <div className="bg-gray-100">
      <HeroBanner />
      <Navbar />

      {/* Hero Section */}
      <div className="relative">
        <img src={shippingImage} alt="Shipping & Delivery" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-white text-3xl md:text-5xl font-bold">{translatedContent.shippingReturns}</h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto p-6">

        {/* Section 1: Shipping Methods */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#4222C4] mb-4">{translatedContent.shippingMethods}</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>{translatedContent.standardShipping.split(':')[0]}:</strong> {translatedContent.standardShipping.split(':')[1]}</li>
            <li><strong>{translatedContent.expressShipping.split(':')[0]}:</strong> {translatedContent.expressShipping.split(':')[1]}</li>
            <li><strong>{translatedContent.overnightShipping.split(':')[0]}:</strong> {translatedContent.overnightShipping.split(':')[1]}</li>
          </ul>
        </div>

        {/* Section 2: Tracking Orders */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#4222C4] mb-4">{translatedContent.trackingOrder}</h2>
          <p className="text-gray-700">
            {translatedContent.trackingText}
          </p>
        </div>

        {/* Section 3: International Shipping */}
        <div className="bg-white shadow-md rounded-lg p-6 my-8">
          <h2 className="text-2xl font-bold text-[#4222C4] mb-4">{translatedContent.internationalShipping}</h2>
          <p className="text-gray-700">
            {translatedContent.internationalText}
          </p>
        </div>

        {/* Section 4: Need Help? */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#4222C4] mb-4">{translatedContent.needHelp}</h2>
          <p className="text-gray-700 mb-2">
            {translatedContent.helpText1}
          </p>
          <p className="text-gray-700 mb-2">
            {translatedContent.helpText2}
          </p>
          <p className="text-gray-700">
            {translatedContent.contactText}
            <a href="mailto:cebleu@contact.com" className="text-[#4222C4] hover:underline"> {translatedContent.contactEmail}</a>.
          </p>
        </div>

      </div>

      {/* Footer */}
      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}