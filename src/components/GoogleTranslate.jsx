import { useState, useEffect } from "react";
import i18n from "./i18n";

const translateText = async (text, targetLang) => {
    if (!text) return "";

    try {
        const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
        );
        const data = await res.json();
        return data.responseData.translatedText || text;
    } catch (error) {
        console.error("Translation Error:", error);
        return text;
    }
};

// Custom Hook for translating fetched data
const useTranslate = (data) => {
    const [translatedData, setTranslatedData] = useState([]);
    const currentLang = i18n.language;

    useEffect(() => {
        const translateData = async () => {
            if (!data || data.length === 0) return;
            const translated = await Promise.all(
                data.map(async (item) => ({
                    ...item,
                    name: await translateText(item.name, currentLang),
                    description: await translateText(item.description, currentLang),
                }))
            );
            setTranslatedData(translated);
        };
        translateData();
    }, [data, currentLang]);

    return translatedData;
};

export default useTranslate;
