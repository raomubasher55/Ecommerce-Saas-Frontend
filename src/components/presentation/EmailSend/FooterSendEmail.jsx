import { useEffect, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";

export const FooterSendEmail = () => {
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    title: "ABOUT CEBLEU",
    description: "Cebleu is a powerful eCommerce multistore platform that empowers businesses to create, manage, and grow their online stores with ease. Experience seamless shopping and scalable solutions tailored for modern commerce."
  });

  useEffect(() => {
    const translateContent = async () => {
      const title = await translateText("ABOUT CEBLEU");
      const description = await translateText("Cebleu is a powerful eCommerce multistore platform that empowers businesses to create, manage, and grow their online stores with ease. Experience seamless shopping and scalable solutions tailored for modern commerce.");
      
      setTranslatedContent({
        title,
        description
      });
    };

    translateContent();
  }, [selectedLanguage, translateText]);

  return (
    <div className="flex flex-col sm:flex-grow mt-4 sm:mt-0 max-w-sm">
      <h1 className="font-bold text-sm text-gray-100">
        {translatedContent.title}
      </h1>
      <p className="text-xs text-gray-300 mt-2 leading-relaxed">
        {translatedContent.description}
      </p>
    </div>
  );
};