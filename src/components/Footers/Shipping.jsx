import React from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import shippingImage from "../../assets/contact.jpg";

export default function Shipping() {
  return (
    <div className="bg-gray-100">
      <HeroBanner />
      <Navbar />

      {/* Hero Section */}
      <div className="relative">
        <img src={shippingImage} alt="Shipping & Delivery" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-white text-3xl md:text-5xl font-bold">Shipping & Returns</h1>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto p-6">

        {/* Section 1: Shipping Methods */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#4222C4] mb-4">🚚 Shipping Methods & Estimated Delivery</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Standard Shipping:</strong> 5-7 business days</li>
            <li><strong>Express Shipping:</strong> 2-3 business days</li>
            <li><strong>Overnight Shipping:</strong> 1 business day</li>
          </ul>
        </div>

        {/* Section 2: Shipping Costs */}
        <div className="grid  gap-6">
          {/* <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#4222C4] mb-4">💰 Shipping Costs</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Standard Shipping: Free on orders over $50</li>
              <li>Express Shipping: $9.99</li>
              <li>Overnight Shipping: $19.99</li>
            </ul>
          </div> */}

          {/* Section 3: Tracking Orders */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#4222C4] mb-4">📦 Tracking Your Order</h2>
            <p className="text-gray-700">
              You can check your order details in the user dashboard. To track your order, enter your order ID in the "Track Order" section.
            </p>
          </div>

        </div>

        {/* Section 4: International Shipping */}
        <div className="bg-white shadow-md rounded-lg p-6 my-8">
          <h2 className="text-2xl font-bold text-[#4222C4] mb-4">🌍 International Shipping</h2>
          <p className="text-gray-700">
            We offer international shipping to select countries. Delivery times vary based on destination & customs.
          </p>
        </div>

        {/* Section 5: Need Help? */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#4222C4] mb-4">❓ Need Help?</h2>
          <p className="text-gray-700 mb-2">
            Our dedicated support team is here to assist you with any questions regarding your orders, shipping, returns, or any other concerns.
          </p>
          <p className="text-gray-700 mb-2">
            Feel free to reach out to us for quick assistance. We strive to respond as soon as possible to ensure a smooth shopping experience.
          </p>
          <p className="text-gray-700">
            Contact us at
            <a href="mailto:cebleu@contact.com" className="text-[#4222C4] hover:underline"> cebleu@contact.com</a>.
          </p>
        </div>


      </div>

      {/* Footer */}
      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}
