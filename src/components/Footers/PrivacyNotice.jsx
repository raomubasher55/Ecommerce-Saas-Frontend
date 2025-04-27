import React, { useEffect, useState } from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import securityImg from "../../assets/support.jpg";
import dataUsageImg from "../../assets/success.png";
import privacyImg from "../../assets/privacy.jpeg";
import { useLanguage } from "../../context/LanguageContext";

export default function PrivacyNotice() {
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    pageTitle: "Privacy Notice",
    pageSubtitle: "Your privacy is our priority. Learn how we handle your data.",
    sections: [
      {
        title: "Information We Collect",
        content: "We collect data you provide when registering, making a purchase, or contacting customer support. This includes your name, email, phone number, and payment details.",
        listItems: [
          "Name, email, and phone number",
          "Payment details",
          "Order history",
          "Customer support interactions"
        ]
      },
      {
        title: "How We Use Your Information",
        content: "Your data helps us process transactions, enhance user experience, and provide customer support. We may also send marketing communications, which you can opt out of anytime.",
        listItems: [
          "Process transactions",
          "Improve user experience",
          "Customer support assistance",
          "Marketing communications"
        ]
      },
      {
        title: "Data Security",
        content: "We implement industry-standard security measures to protect your data from unauthorized access, misuse, or disclosure.",
        listItems: [
          "Encryption protocols",
          "Secure data storage",
          "Access control measures",
          "Regular security audits"
        ]
      }
    ],
    contactTitle: "Need Assistance?",
    contactSubtitle: "For any privacy-related inquiries, reach out to us at",
    contactEmail: "cebleu@contact.com"
  });

  useEffect(() => {
    const translateAll = async () => {
      if (selectedLanguage === "English") return;

      try {
        // Translate page headers
        const translatedTitle = await translateText("Privacy Notice");
        const translatedSubtitle = await translateText("Your privacy is our priority. Learn how we handle your data.");

        // Translate sections
        const translatedSections = await Promise.all(
          translatedContent.sections.map(async (section) => {
            const translatedTitle = await translateText(section.title);
            const translatedContent = await translateText(section.content);
            const translatedItems = await Promise.all(
              section.listItems.map(item => translateText(item))
            );
            return {
              title: translatedTitle,
              content: translatedContent,
              listItems: translatedItems
            };
          })
        );

        // Translate contact section
        const translatedContactTitle = await translateText("Need Assistance?");
        const translatedContactSubtitle = await translateText("For any privacy-related inquiries, reach out to us at");

        setTranslatedContent({
          ...translatedContent,
          pageTitle: translatedTitle,
          pageSubtitle: translatedSubtitle,
          sections: translatedSections,
          contactTitle: translatedContactTitle,
          contactSubtitle: translatedContactSubtitle
        });
      } catch (error) {
        console.error("Translation error:", error);
      }
    };

    translateAll();
  }, [selectedLanguage, translateText]);

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

  return (
    <div className="bg-gray-50">
      <HeroBanner />
      <Navbar />

      {/* Page Header */}
      <div className="text-center py-16 bg-[#4222C4] text-white">
        <h1 className="text-4xl font-bold">{translatedContent.pageTitle}</h1>
        <p className="text-lg mt-2">{translatedContent.pageSubtitle}</p>
      </div>

      {/* Privacy Content */}
      <div className="max-w-6xl bg-white shadow-lg rounded-xl p-10 mt-12 mx-auto">
        {translatedContent.sections.map((section, index) => (
          <Section 
            key={index}
            title={section.title}
            content={section.content}
            listItems={section.listItems}
            image={[privacyImg, dataUsageImg, securityImg][index]}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>

      {/* Contact Section */}
      <div className="text-center py-16 bg-[#4222C4] text-white mt-12">
        <h2 className="text-3xl font-bold">{translatedContent.contactTitle}</h2>
        <p className="text-lg mt-2">{translatedContent.contactSubtitle}</p>
        <a href="mailto:cebleu@contact.com" className="text-lg font-semibold underline">
          {translatedContent.contactEmail}
        </a>
      </div>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}