import React from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import sellImg from "../../assets/success.png";
import reachImg from "../../assets/laptop girl.jpeg";
import paymentImg from "../../assets/refund.jpeg";
import productsImg from "../../assets/product.jpeg";

export default function SellonPlatform() {
  return (
    <div className="bg-gray-100 m-auto">
      <HeroBanner />
      <Navbar />
      
      {/* Header Section */}
      <div className="text-center py-10 bg-[#4222C4] text-white">
        <h1 className="text-4xl font-bold">Grow Your Business with Us</h1>
        <p className="text-lg mt-2">Join thousands of sellers and reach more customers.</p>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Section 1 */}
        <div className="flex flex-col md:flex-row items-center mb-10">
          <img src={sellImg} alt="Sell on Platform" className="w-full md:w-1/2 rounded-lg shadow-md" />
          <div className="md:w-1/2 md:pl-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#4222C4] mb-4">Why Sell on Our Platform?</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>🌍 Expand your business and reach a global audience.</li>
              <li>💰 Increase your revenue with high conversion rates.</li>
              <li>📈 Utilize data-driven insights to optimize your sales.</li>
              <li>🚚 Benefit from fast and reliable shipping options.</li>
              <li>🤝 Get dedicated support from our expert team.</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-10">
          <img src={reachImg} alt="Reach Customers" className="w-full md:w-1/2 rounded-lg shadow-md" />
          <div className="md:w-1/2 md:pr-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#4222C4] mb-4">How to Get Started?</h2>
            <ol className="list-decimal list-inside text-gray-700">
              <li>📝 Sign up and create your seller account.</li>
              <li>📸 Upload high-quality images of your products.</li>
              <li>💲 Set competitive prices and attractive offers.</li>
              <li>📦 Manage your orders and deliveries seamlessly.</li>
              <li>🚀 Start earning and growing your business.</li>
            </ol>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col md:flex-row items-center mb-10">
          <img src={paymentImg} alt="Secure Payments" className="w-full md:w-1/2 rounded-lg shadow-md" />
          <div className="md:w-1/2 md:pl-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#4222C4] mb-4">Secure Payments & Fast Transactions</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>🔒 Get paid securely with multiple payment options.</li>
              <li>⏳ Fast transactions to ensure smooth cash flow.</li>
              <li>🏦 Direct bank deposits with no hidden fees.</li>
              <li>💳 Accept credit, debit, and digital payments.</li>
              <li>🛡️ Fraud protection for both buyers and sellers.</li>
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-10">
          <img src={productsImg} alt="Product Categories" className="w-full md:w-1/2 rounded-lg shadow-md" />
          <div className="md:w-1/2 md:pr-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#4222C4] mb-4">What Can You Sell?</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>📱 Electronics & Gadgets</li>
              <li>👗 Fashion & Clothing</li>
              <li>🏠 Home & Kitchen Essentials</li>
              <li>🛍️ Beauty & Personal Care</li>
              <li>🎮 Gaming & Entertainment</li>
              <li>🔧 Automobile Accessories</li>
            </ul>
          </div>
        </div>

        <div className="text-center bg-[#f8f9fa] py-10 rounded-lg shadow-md">
  <h2 className="text-3xl font-extrabold text-[#4222C4] mb-4">
    🚀 Start Selling Today & Elevate Your Business!
  </h2>
  <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-4">
    Join a thriving marketplace and showcase your products to a vast audience. Whether you're a startup or an 
    established brand, our platform provides the tools and support to maximize your sales and scale effortlessly.
  </p>
  <p className="text-gray-700 font-semibold mb-6">
    Enjoy secure transactions, seamless logistics, and round-the-clock seller support.
  </p>
  <a href="/register-store" className="bg-[#4222C4] text-white px-6 py-3 rounded-lg text-lg font-semibold 
    hover:bg-[#33199f] transition-all duration-300">
    📢 Sign Up & Start Selling Now
  </a>
</div>

      </div>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}
