import React, { useEffect, useState } from "react";
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
import { useLanguage } from "../../context/LanguageContext";

export default function TermsAndConditions() {
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    pageTitle: "Terms & Conditions",
    welcomeText: "Welcome to our e-commerce platform. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.",
    sections: [
      {
        title: "1. Account Registration",
        items: [
          "Users must create an account to access certain features.",
          "Maintaining the confidentiality of login credentials is the user's responsibility.",
          "Providing false information may result in suspension or termination.",
          "Users must be at least 18 years old to register.",
          "Account sharing is not permitted."
        ]
      },
      {
        title: "2. Product Listings & Sales",
        items: [
          "Sellers must provide accurate product descriptions and pricing.",
          "Fraudulent or misleading listings are prohibited.",
          "Products must comply with quality and safety standards.",
          "Counterfeit products are strictly prohibited.",
          "Sellers must respond to buyer inquiries promptly."
        ]
      },
      {
        title: "3. Payments & Transactions",
        items: [
          "All transactions are securely processed via encrypted gateways.",
          "Users must provide correct payment details.",
          "Unauthorized transactions should be reported immediately.",
          "Refunds for payment issues are subject to verification.",
          "We do not store users' payment details."
        ]
      },
      {
        title: "4. Shipping & Delivery",
        items: [
          "Delivery times depend on the chosen method and location.",
          "External factors may cause delays.",
          "Tracking details are provided upon shipment.",
          "Lost packages must be reported within 7 days.",
          "Shipping fees are non-refundable."
        ]
      },
      {
        title: "5. Returns & Refunds",
        items: [
          "Return policies vary by seller.",
          "Refunds are processed as per our refund policy.",
          "Returned items must be in their original packaging.",
          "Customers must request returns within the allowed period.",
          "Items damaged due to misuse are not eligible for refunds."
        ]
      },
      {
        title: "6. User Conduct",
        items: [
          "Fraudulent, abusive, or illegal activities are prohibited.",
          "Harassment, spamming, and impersonation are not allowed.",
          "Violations may result in suspension or legal action.",
          "Users must not engage in unauthorized data scraping.",
          "Respectful communication is expected in all interactions."
        ]
      },
      {
        title: "7. Privacy Policy",
        items: [
          "We prioritize user privacy and comply with data protection laws.",
          "Personal data is never shared without consent.",
          "Users should review our privacy policy for details.",
          "Data breaches will be communicated transparently.",
          "Users can request data deletion at any time."
        ]
      }
    ]
  });

  useEffect(() => {
    const translateContent = async () => {
      if (selectedLanguage === "English") {
        // Use default English content
        return;
      }

      try {
        // Translate page title and welcome text
        const translatedTitle = await translateText("Terms & Conditions");
        const translatedWelcome = await translateText("Welcome to our e-commerce platform. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.");

        // Translate all sections
        const translatedSections = await Promise.all(
          translatedContent.sections.map(async (section) => {
            const translatedTitle = await translateText(section.title);
            const translatedItems = await Promise.all(
              section.items.map(item => translateText(item))
            );
            return {
              title: translatedTitle,
              items: translatedItems
            };
          })
        );

        setTranslatedContent({
          pageTitle: translatedTitle,
          welcomeText: translatedWelcome,
          sections: translatedSections
        });
      } catch (error) {
        console.error("Translation error:", error);
      }
    };

    translateContent();
  }, [selectedLanguage, translateText]);

  const sectionImages = [
    accountImage,
    productImage,
    paymentImage,
    shippingImage,
    refundImage,
    userImage,
    privacyImage
  ];

  return (
    <div className="bg-gray-100 m-auto">
      <HeroBanner />
      <Navbar />

      <div className="max-w-5xl bg-white shadow-lg rounded-lg p-8 mt-10 mx-auto">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-6 text-center">
          {translatedContent.pageTitle}
        </h2>

        <p className="text-gray-700 text-lg text-center mb-8">
          {translatedContent.welcomeText}
        </p>

        {translatedContent.sections.map((section, index) => (
          <div 
            key={index} 
            className={`grid md:grid-cols-2 gap-8 items-center mt-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            {index % 2 === 0 ? (
              <>
                <img 
                  src={sectionImages[index]} 
                  alt={section.title} 
                  className="w-full rounded-lg shadow-md" 
                />
                <div>
                  <h3 className="text-xl font-semibold text-[#4222C4] mb-4">{section.title}</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-xl font-semibold text-[#4222C4] mb-4">{section.title}</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
                <img 
                  src={sectionImages[index]} 
                  alt={section.title} 
                  className="w-full rounded-lg shadow-md" 
                />
              </>
            )}
          </div>
        ))}
      </div>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}