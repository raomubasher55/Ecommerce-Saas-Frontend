import { Icon } from "@iconify/react";
import logo from '../../../assets/logo 4.png';
import { useEffect, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";

export const FooterDownLoadApp = () => {
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    title: "DOWNLOAD CEBLEU FREE APP",
    subtitle: "Get access to exclusive offers!",
    appleSubtext: "Download on the",
    appleMainText: "App Store",
    googleSubtext: "Get it on",
    googleMainText: "Google Play"
  });

  useEffect(() => {
    const translateContent = async () => {
      const translations = await Promise.all([
        translateText("DOWNLOAD CEBLEU FREE APP"),
        translateText("Get access to exclusive offers!"),
        translateText("Download on the"),
        translateText("App Store"),
        translateText("Get it on"),
        translateText("Google Play")
      ]);

      setTranslatedContent({
        title: translations[0],
        subtitle: translations[1],
        appleSubtext: translations[2],
        appleMainText: translations[3],
        googleSubtext: translations[4],
        googleMainText: translations[5]
      });
    };

    translateContent();
  }, [selectedLanguage, translateText]);

  return (
    <div className="flex flex-col sm:flex-grow mt-4 sm:mt-0">
      <div className="flex items-center">
        <div className="h-[2.5rem] w-[2.5rem] bg-gray-200 flex items-center justify-center rounded-md">
          <img src={logo} alt="logo" className="w-[90%] h-[80%] m-0" />
        </div>
        <div className="ml-4">
          <h1 className="text-sm font-bold text-gray-100">
            {translatedContent.title}
          </h1>
          <p className="text-xs text-gray-300">{translatedContent.subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button className="flex items-center px-4 py-2 bg-[#313133] text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-blue-500">
          <Icon icon="ic:baseline-apple" width="25" />
          <div className="ml-2 text-left">
            <p className="text-[0.6rem] text-gray-300">{translatedContent.appleSubtext}</p>
            <h1 className="text-sm font-semibold">{translatedContent.appleMainText}</h1>
          </div>
        </button>
        <button className="flex items-center px-4 py-2 bg-[#313133] text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-blue-500">
          <Icon icon="mdi:google-play" width="25" />
          <div className="ml-2 text-left">
            <p className="text-[0.6rem] text-gray-300">{translatedContent.googleSubtext}</p>
            <h1 className="text-sm font-semibold">{translatedContent.googleMainText}</h1>
          </div>
        </button>
      </div>
    </div>
  );
};