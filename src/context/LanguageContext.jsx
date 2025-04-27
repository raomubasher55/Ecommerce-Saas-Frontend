// src/context/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const languageCodes = {
    English: "en",
    French: "fr",
    Arabic: "ar",
};

const getLanguageCode = (lang) => languageCodes[lang] || "en";

export const LanguageProvider = ({ children }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    // Load language from localStorage on first render
    useEffect(() => {
        const savedLang = localStorage.getItem("selectedLanguage");
        if (savedLang && languageCodes[savedLang]) {
            setSelectedLanguage(savedLang);
        }
    }, []);

    // Save language to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("selectedLanguage", selectedLanguage);
    }, [selectedLanguage]);

    const translateText = async (text) => {
        const languageCode = getLanguageCode(selectedLanguage);
        if (languageCode === "en") return text;

        try {
            const res = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${languageCode}&dt=t&q=${encodeURIComponent(text)}`
            );
            const data = await res.json();
            return data[0][0][0];
        } catch (err) {
            console.error("Translation error:", err);
            return text;
        }
    };

    return (
        <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, translateText }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
