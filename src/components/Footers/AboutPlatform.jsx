import React from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import girlLaptop from "../../assets/laptop girl.jpeg";
import manCash from "../../assets/cash.jpg";
import product from "../../assets/product.jpeg";
import support from "../../assets/support.jpg";
import success from "../../assets/success.png";

export default function AboutPlatform() {
  return (
    <div className="bg-gray-100 m-auto flex flex-col items-center">
      <HeroBanner />
      <Navbar />

      {/* Steps Section */}
      <div className="max-w-6xl w-full flex flex-col items-center text-center py-12">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-8">
          Your E-Commerce Success Starts in Just 3 Simple Steps!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[  
            { image: girlLaptop, title: "Sign Up in Just 5 Minutes!", text: "Fill out the form, accept the terms, and take your first step toward financial freedom." },
            { image: manCash, title: "Master the Art of Selling Online", text: "Take a short quiz, sharpen your skills, and become a confident e-commerce seller." },
            { image: product, title: "List Your Products & Start Earning!", text: "The more products you list, the more sales you make. Launch your store today!" },
          ].map((step, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
              <img src={step.image} alt={step.title} className="rounded-lg w-full h-48 object-cover mb-4" />
              <h3 className="text-xl font-semibold text-[#F57224] mb-2">{step.title}</h3>
              <p className="text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us? */}
      <div className="max-w-6xl text-center py-12">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-6">Why Choose Our Platform?</h2>
        <p className="text-gray-700 text-lg">Join thousands of successful sellers and take your business to the next level.</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mt-6">
          <li className="bg-white p-6 shadow-md rounded-xl">✔️ Zero upfront costs – Start selling with no investment!</li>
          <li className="bg-white p-6 shadow-md rounded-xl">✔️ Massive customer base – Reach thousands instantly.</li>
          <li className="bg-white p-6 shadow-md rounded-xl">✔️ Secure payments – Get paid safely and on time.</li>
          <li className="bg-white p-6 shadow-md rounded-xl">✔️ Marketing support – Boost your sales with expert guidance.</li>
        </ul>
      </div>

      {/* Success Stories */}
      <div className="max-w-6xl text-center py-12">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-6">Success Stories from Real Sellers</h2>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center relative">
  <img src={success} alt="Success" className="w-32 h-32 rounded-full absolute top-0 transform -translate-y-1/2" />
  <h3 className="text-xl font-semibold text-[#F57224] mt-16">Success Stories</h3>
  <p className="text-gray-700">
    Discover how entrepreneurs like you turned their ideas into thriving businesses using our platform!
  </p>
</div>

      </div>

      {/* Support & Resources */}
      <div className="max-w-6xl text-center py-12">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-6">24/7 Support & Training</h2>
        <p className="text-gray-700 text-lg">We’re here to help! Get expert support, marketing guidance, and in-depth training.</p>
        <img src={support} alt="Support" className="rounded-lg w-full h-64 object-cover mt-6 shadow-lg" />
      </div>

      {/* Join Us Call-To-Action */}
      <div className="bg-[#F57224] text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Join Us & Start Selling Today!</h2>
        <p className="text-lg mb-6">Don’t miss the opportunity to grow your business. Sign up now and start your journey!</p>
        <button className="bg-white text-[#F57224] font-bold py-3 px-6 rounded-xl text-lg hover:bg-gray-200">Get Started Now</button>
      </div>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}
