import React from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import securityImg from "../../assets/support.jpg";
import dataUsageImg from "../../assets/success.png";
import privacyImg from "../../assets/privacy.jpeg";

export default function PrivacyNotice() {
  return (
    <div className="bg-gray-50">
      <HeroBanner />
      <Navbar />

      {/* Page Header */}
      <div className="text-center py-16 bg-[#4222C4] text-white">
        <h1 className="text-4xl font-bold">Privacy Notice</h1>
        <p className="text-lg mt-2">Your privacy is our priority. Learn how we handle your data.</p>
      </div>

      {/* Privacy Content */}
      <div className="max-w-6xl bg-white shadow-lg rounded-xl p-10 mt-12 mx-auto">
        <Section 
          title="Information We Collect" 
          content="We collect data you provide when registering, making a purchase, or contacting customer support. This includes your name, email, phone number, and payment details."
          listItems={["Name, email, and phone number", "Payment details", "Order history", "Customer support interactions"]}
          image={privacyImg}
          reverse={false}
        />

        <Section 
          title="How We Use Your Information" 
          content="Your data helps us process transactions, enhance user experience, and provide customer support. We may also send marketing communications, which you can opt out of anytime."
          listItems={["Process transactions", "Improve user experience", "Customer support assistance", "Marketing communications"]}
          image={dataUsageImg}
          reverse={true}
        />

        <Section 
          title="Data Security" 
          content="We implement industry-standard security measures to protect your data from unauthorized access, misuse, or disclosure."
          listItems={["Encryption protocols", "Secure data storage", "Access control measures", "Regular security audits"]}
          image={securityImg}
          reverse={false}
        />
      </div>

      {/* Contact Section */}
      <div className="text-center py-16 bg-[#4222C4] text-white mt-12">
        <h2 className="text-3xl font-bold">Need Assistance?</h2>
        <p className="text-lg mt-2">For any privacy-related inquiries, reach out to us at</p>
        <a href="mailto:cebleu@contact.com" className="text-lg font-semibold underline">
          cebleu@contact.com
        </a>
      </div>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}

const Section = ({ title, content, listItems, image, reverse }) => (
  <div className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} items-center gap-6 mb-10`}>
    <img src={image} alt={title} className="w-full md:w-1/3 rounded-lg shadow-md" />
    <div className="w-full md:w-2/3">
      <h3 className="text-xl font-semibold text-[#4222C4] mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-2">{content}</p>
      <ul className="list-disc list-inside text-gray-600">
        {listItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);
