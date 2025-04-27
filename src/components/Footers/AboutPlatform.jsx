import React, { useEffect, useState } from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import girlLaptop from "../../assets/laptop girl.jpeg";
import manCash from "../../assets/cash.jpg";
import product from "../../assets/product.jpeg";
import support from "../../assets/support.jpg";
import success from "../../assets/success.png";
import { useLanguage } from "../../context/LanguageContext";

export default function AboutPlatform() {
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    stepsTitle: "Your E-Commerce Success Starts in Just 3 Simple Steps!",
    steps: [
      {
        title: "Sign Up in Just 5 Minutes!",
        text: "Fill out the form, accept the terms, and take your first step toward financial freedom."
      },
      {
        title: "Master the Art of Selling Online",
        text: "Take a short quiz, sharpen your skills, and become a confident e-commerce seller."
      },
      {
        title: "List Your Products & Start Earning!",
        text: "The more products you list, the more sales you make. Launch your store today!"
      }
    ],
    whyChooseTitle: "Why Choose Our Platform?",
    whyChooseText: "Join thousands of successful sellers and take your business to the next level.",
    benefits: [
      "Zero upfront costs – Start selling with no investment!",
      "Massive customer base – Reach thousands instantly.",
      "Secure payments – Get paid safely and on time.",
      "Marketing support – Boost your sales with expert guidance."
    ],
    successTitle: "Success Stories from Real Sellers",
    successSubtitle: "Success Stories",
    successText: "Discover how entrepreneurs like you turned their ideas into thriving businesses using our platform!",
    supportTitle: "24/7 Support & Training",
    supportText: "We're here to help! Get expert support, marketing guidance, and in-depth training.",
    ctaTitle: "Join Us & Start Selling Today!",
    ctaText: "Don't miss the opportunity to grow your business. Sign up now and start your journey!",
    ctaButton: "Get Started Now"
  });

  useEffect(() => {
    const translateAll = async () => {
      const translations = await Promise.all([
        translateText("Your E-Commerce Success Starts in Just 3 Simple Steps!"),
        translateText("Sign Up in Just 5 Minutes!"),
        translateText("Fill out the form, accept the terms, and take your first step toward financial freedom."),
        translateText("Master the Art of Selling Online"),
        translateText("Take a short quiz, sharpen your skills, and become a confident e-commerce seller."),
        translateText("List Your Products & Start Earning!"),
        translateText("The more products you list, the more sales you make. Launch your store today!"),
        translateText("Why Choose Our Platform?"),
        translateText("Join thousands of successful sellers and take your business to the next level."),
        translateText("Zero upfront costs – Start selling with no investment!"),
        translateText("Massive customer base – Reach thousands instantly."),
        translateText("Secure payments – Get paid safely and on time."),
        translateText("Marketing support – Boost your sales with expert guidance."),
        translateText("Success Stories from Real Sellers"),
        translateText("Success Stories"),
        translateText("Discover how entrepreneurs like you turned their ideas into thriving businesses using our platform!"),
        translateText("24/7 Support & Training"),
        translateText("We're here to help! Get expert support, marketing guidance, and in-depth training."),
        translateText("Join Us & Start Selling Today!"),
        translateText("Don't miss the opportunity to grow your business. Sign up now and start your journey!"),
        translateText("Get Started Now")
      ]);

      setTranslatedContent({
        stepsTitle: translations[0],
        steps: [
          {
            title: translations[1],
            text: translations[2]
          },
          {
            title: translations[3],
            text: translations[4]
          },
          {
            title: translations[5],
            text: translations[6]
          }
        ],
        whyChooseTitle: translations[7],
        whyChooseText: translations[8],
        benefits: translations.slice(9, 13),
        successTitle: translations[13],
        successSubtitle: translations[14],
        successText: translations[15],
        supportTitle: translations[16],
        supportText: translations[17],
        ctaTitle: translations[18],
        ctaText: translations[19],
        ctaButton: translations[20]
      });
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  return (
    <div className="bg-gray-100 m-auto flex flex-col items-center">
      <HeroBanner />
      <Navbar />

      {/* Steps Section */}
      <div className="max-w-6xl w-full flex flex-col items-center text-center py-12">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-8">
          {translatedContent.stepsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {translatedContent.steps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
              <img 
                src={[girlLaptop, manCash, product][index]} 
                alt={step.title} 
                className="rounded-lg w-full h-48 object-cover mb-4" 
              />
              <h3 className="text-xl font-semibold text-[#F57224] mb-2">{step.title}</h3>
              <p className="text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us? */}
      <div className="max-w-6xl text-center py-12">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-6">{translatedContent.whyChooseTitle}</h2>
        <p className="text-gray-700 text-lg">{translatedContent.whyChooseText}</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mt-6">
          {translatedContent.benefits.map((benefit, index) => (
            <li key={index} className="bg-white p-6 shadow-md rounded-xl">✔️ {benefit}</li>
          ))}
        </ul>
      </div>

      {/* Success Stories */}
      <div className="max-w-6xl text-center py-12">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-6">{translatedContent.successTitle}</h2>
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-16 flex flex-col items-center text-center relative">
          <img src={success} alt={translatedContent.successSubtitle} className="w-32 h-32 rounded-full absolute top-0 transform -translate-y-1/2" />
          <h3 className="text-xl font-semibold text-[#F57224] mt-16">{translatedContent.successSubtitle}</h3>
          <p className="text-gray-700">
            {translatedContent.successText}
          </p>
        </div>
      </div>

      {/* Support & Resources */}
      <div className="max-w-6xl text-center py-12">
        <h2 className="text-3xl font-bold text-[#4222C4] mb-6">{translatedContent.supportTitle}</h2>
        <p className="text-gray-700 text-lg">{translatedContent.supportText}</p>
        <img src={support} alt={translatedContent.supportTitle} className="rounded-lg w-full h-64 object-cover mt-6 shadow-lg" />
      </div>

      {/* Join Us Call-To-Action */}
      <div className="bg-[#F57224] text-white text-center py-12">
        <h2 className="text-3xl font-bold mb-4">{translatedContent.ctaTitle}</h2>
        <p className="text-lg mb-6">{translatedContent.ctaText}</p>
        <button className="bg-white text-[#F57224] font-bold py-3 px-6 rounded-xl text-lg hover:bg-gray-200">
          {translatedContent.ctaButton}
        </button>
      </div>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}