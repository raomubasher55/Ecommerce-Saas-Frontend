import React from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import accountImage from "../../assets/account.jpg";
import productImage from "../../assets/product.jpeg";
import paymentImage from "../../assets/refund.jpeg";
import shippingImage from "../../assets/shipping.jpeg";
import refundImage from "../../assets/refund2.png";
import privacyImage from "../../assets/privacy.jpeg";
import userImage from "../../assets/laptop girl.jpeg";

export default function ReturnPolicy() {
  return (
    <div className="bg-gray-100 m-auto">
      <HeroBanner />
      <Navbar />

      <div className="max-w-5xl bg-white shadow-lg rounded-lg p-8 mt-10 mx-auto">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-6 text-center">Terms & Conditions</h2>

        <p className="text-gray-700 text-lg text-center mb-8">
          Welcome to our e-commerce platform. By accessing or using our website, you agree to comply with and be
          bound by the following terms and conditions. Please read them carefully.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-8">
          <img src={accountImage} alt="Account Registration" className="w-full rounded-lg shadow-md" />
          <div>
            <h3 className="text-xl font-semibold text-[#4222C4] mb-4">1. Account Registration</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Users must create an account to access certain features.</li>
              <li>Maintaining the confidentiality of login credentials is the user's responsibility.</li>
              <li>Providing false information may result in suspension or termination.</li>
              <li>Users must be at least 18 years old to register.</li>
              <li>Account sharing is not permitted.</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          <div>
            <h3 className="text-xl font-semibold text-[#4222C4] mb-4">2. Product Listings & Sales</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Sellers must provide accurate product descriptions and pricing.</li>
              <li>Fraudulent or misleading listings are prohibited.</li>
              <li>Products must comply with quality and safety standards.</li>
              <li>Counterfeit products are strictly prohibited.</li>
              <li>Sellers must respond to buyer inquiries promptly.</li>
            </ul>
          </div>
          <img src={productImage} alt="Product Listings" className="w-full rounded-lg shadow-md" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          <img src={paymentImage} alt="Payments" className="w-full rounded-lg shadow-md" />
          <div>
            <h3 className="text-xl font-semibold text-[#4222C4] mb-4">3. Payments & Transactions</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>All transactions are securely processed via encrypted gateways.</li>
              <li>Users must provide correct payment details.</li>
              <li>Unauthorized transactions should be reported immediately.</li>
              <li>Refunds for payment issues are subject to verification.</li>
              <li>We do not store users' payment details.</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          <div>
            <h3 className="text-xl font-semibold text-[#4222C4] mb-4">4. Shipping & Delivery</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Delivery times depend on the chosen method and location.</li>
              <li>External factors may cause delays.</li>
              <li>Tracking details are provided upon shipment.</li>
              <li>Lost packages must be reported within 7 days.</li>
              <li>Shipping fees are non-refundable.</li>
            </ul>
          </div>
          <img src={shippingImage} alt="Shipping & Delivery" className="w-full rounded-lg shadow-md" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          <img src={refundImage} alt="Returns & Refunds" className="w-full rounded-lg shadow-md" />
          <div>
            <h3 className="text-xl font-semibold text-[#4222C4] mb-4">5. Returns & Refunds</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Return policies vary by seller.</li>
              <li>Refunds are processed as per our refund policy.</li>
              <li>Returned items must be in their original packaging.</li>
              <li>Customers must request returns within the allowed period.</li>
              <li>Items damaged due to misuse are not eligible for refunds.</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          <div>
            <h3 className="text-xl font-semibold text-[#4222C4] mb-4">6. User Conduct</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Fraudulent, abusive, or illegal activities are prohibited.</li>
              <li>Harassment, spamming, and impersonation are not allowed.</li>
              <li>Violations may result in suspension or legal action.</li>
              <li>Users must not engage in unauthorized data scraping.</li>
              <li>Respectful communication is expected in all interactions.</li>
            </ul>
          </div>
        <img src={userImage} alt="Privacy Policy" className="w-full rounded-lg shadow-md" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
          <img src={privacyImage} alt="Privacy Policy" className="w-full rounded-lg shadow-md" />
          <div>
            <h3 className="text-xl font-semibold text-[#4222C4] mb-4">7. Privacy Policy</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>We prioritize user privacy and comply with data protection laws.</li>
              <li>Personal data is never shared without consent.</li>
              <li>Users should review our privacy policy for details.</li>
              <li>Data breaches will be communicated transparently.</li>
              <li>Users can request data deletion at any time.</li>
            </ul>
          </div>
        </div>

      </div>
        <FooterPrime />
        <AllAbouJumiaFooter />
    </div>
  );
}
