import React, { useEffect, useState } from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import sellImg from "../../assets/success.png";
import reachImg from "../../assets/laptop girl.jpeg";
import paymentImg from "../../assets/refund.jpeg";
import productsImg from "../../assets/product.jpeg";
import { useLanguage } from "../../context/LanguageContext";

export default function SellonPlatform() {
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    pageTitle: "Grow Your Business with Us",
    pageSubtitle: "Join thousands of sellers and reach more customers.",
    sections: [
      {
        title: "Why Sell on Our Platform?",
        content: "",
        listItems: [
          "🌍 Expand your business and reach a global audience.",
          "💰 Increase your revenue with high conversion rates.",
          "📈 Utilize data-driven insights to optimize your sales.",
          "🚚 Benefit from fast and reliable shipping options.",
          "🤝 Get dedicated support from our expert team."
        ],
        image: sellImg
      },
      {
        title: "How to Get Started?",
        content: "",
        listItems: [
          "📝 Sign up and create your seller account.",
          "📸 Upload high-quality images of your products.",
          "💲 Set competitive prices and attractive offers.",
          "📦 Manage your orders and deliveries seamlessly.",
          "🚀 Start earning and growing your business."
        ],
        image: reachImg,
        reverse: true
      },
      {
        title: "Secure Payments & Fast Transactions",
        content: "",
        listItems: [
          "🔒 Get paid securely with multiple payment options.",
          "⏳ Fast transactions to ensure smooth cash flow.",
          "🏦 Direct bank deposits with no hidden fees.",
          "💳 Accept credit, debit, and digital payments.",
          "🛡️ Fraud protection for both buyers and sellers."
        ],
        image: paymentImg
      },
      {
        title: "What Can You Sell?",
        content: "",
        listItems: [
          "📱 Electronics & Gadgets",
          "👗 Fashion & Clothing",
          "🏠 Home & Kitchen Essentials",
          "🛍️ Beauty & Personal Care",
          "🎮 Gaming & Entertainment",
          "🔧 Automobile Accessories"
        ],
        image: productsImg,
        reverse: true
      }
    ],
    ctaTitle: "🚀 Start Selling Today & Elevate Your Business!",
    ctaContent: "Join a thriving marketplace and showcase your products to a vast audience. Whether you're a startup or an established brand, our platform provides the tools and support to maximize your sales and scale effortlessly.",
    ctaHighlight: "Enjoy secure transactions, seamless logistics, and round-the-clock seller support.",
    ctaButton: "📢 Sign Up & Start Selling Now"
  });

  useEffect(() => {
    const translateAll = async () => {
      if (selectedLanguage === "English") return;

      try {
        // Translate page headers
        const translatedTitle = await translateText("Grow Your Business with Us");
        const translatedSubtitle = await translateText("Join thousands of sellers and reach more customers.");

        // Translate sections
        const translatedSections = await Promise.all(
          translatedContent.sections.map(async (section) => {
            const translatedTitle = await translateText(section.title);
            const translatedItems = await Promise.all(
              section.listItems.map(item => translateText(item))
            );
            return {
              ...section,
              title: translatedTitle,
              listItems: translatedItems
            };
          })
        );

        // Translate CTA section
        const translatedCtaTitle = await translateText("🚀 Start Selling Today & Elevate Your Business!");
        const translatedCtaContent = await translateText("Join a thriving marketplace and showcase your products to a vast audience. Whether you're a startup or an established brand, our platform provides the tools and support to maximize your sales and scale effortlessly.");
        const translatedCtaHighlight = await translateText("Enjoy secure transactions, seamless logistics, and round-the-clock seller support.");
        const translatedCtaButton = await translateText("📢 Sign Up & Start Selling Now");

        setTranslatedContent({
          ...translatedContent,
          pageTitle: translatedTitle,
          pageSubtitle: translatedSubtitle,
          sections: translatedSections,
          ctaTitle: translatedCtaTitle,
          ctaContent: translatedCtaContent,
          ctaHighlight: translatedCtaHighlight,
          ctaButton: translatedCtaButton
        });
      } catch (error) {
        console.error("Translation error:", error);
      }
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  const Section = ({ title, content, listItems, image, reverse }) => (
    <div className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} items-center mb-10`}>
      <img src={image} alt={title} className="w-full md:w-1/2 rounded-lg shadow-md" />
      <div className={`md:w-1/2 ${reverse ? 'md:pr-6' : 'md:pl-6'} text-center md:text-left`}>
        <h2 className="text-2xl font-bold text-[#4222C4] mb-4">{title}</h2>
        <ul className="list-disc list-inside text-gray-700">
          {listItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 m-auto">
      <HeroBanner />
      <Navbar />
      
      {/* Header Section */}
      <div className="text-center py-10 bg-[#4222C4] text-white">
        <h1 className="text-4xl font-bold">{translatedContent.pageTitle}</h1>
        <p className="text-lg mt-2">{translatedContent.pageSubtitle}</p>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Sections */}
        {translatedContent.sections.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            content={section.content}
            listItems={section.listItems}
            image={section.image}
            reverse={section.reverse}
          />
        ))}

        {/* CTA Section */}
        <div className="text-center bg-[#f8f9fa] py-10 rounded-lg shadow-md">
          <h2 className="text-3xl font-extrabold text-[#4222C4] mb-4">
            {translatedContent.ctaTitle}
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-4">
            {translatedContent.ctaContent}
          </p>
          <p className="text-gray-700 font-semibold mb-6">
            {translatedContent.ctaHighlight}
          </p>
          <a 
            href="/register-store" 
            className="bg-[#4222C4] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#33199f] transition-all duration-300"
          >
            {translatedContent.ctaButton}
          </a>
        </div>
      </div>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}