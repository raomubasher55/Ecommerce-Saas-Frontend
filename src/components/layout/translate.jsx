import { useState, useEffect } from 'react';

const TranslationComponent = () => {
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Cache translations to reduce API calls
  const [translationCache, setTranslationCache] = useState(() => {
    const saved = localStorage.getItem('translationCache');
    return saved ? JSON.parse(saved) : {};
  });

  // Elements to exclude from translation
  const excludedTags = ['SCRIPT', 'STYLE', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];

  // Save cache to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('translationCache', JSON.stringify(translationCache));
  }, [translationCache]);

  const translateText = async (text, targetLang) => {
    // Check cache first
    const cacheKey = `${targetLang}:${text}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      const translatedText = data[0][0][0];
      
      // Update cache
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original if error
    }
  };

  const translatePage = async (targetLang) => {
    if (language === targetLang) return;
    setIsTranslating(true);
    
    // Update document language attribute
    document.documentElement.lang = targetLang;
    
    // Get all text nodes in the body
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      { 
        acceptNode(node) {
          if (node.parentNode.tagName && excludedTags.includes(node.parentNode.tagName)) {
            return NodeFilter.FILTER_SKIP;
          }
          return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      }
    );

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    // Translate each text node
    for (const node of textNodes) {
      const originalText = node.textContent.trim();
      if (!originalText || originalText.length > 500) continue;
      
      const translatedText = await translateText(originalText, targetLang);
      node.textContent = node.textContent.replace(originalText, translatedText);
    }

    setLanguage(targetLang);
    setIsTranslating(false);
  };

  // Handle dynamic content (for React state changes)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      if (language !== 'en') {
        translatePage(language);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [language]);

  return (
    <div className="language-switcher">
      <button 
        onClick={() => translatePage('en')}
        disabled={isTranslating || language === 'en'}
      >
        {isTranslating && language === 'en' ? 'Translating...' : 'English'}
      </button>
      <button 
        onClick={() => translatePage('fr')}
        disabled={isTranslating || language === 'fr'}
      >
        {isTranslating && language === 'fr' ? 'Traduction...' : 'Français'}
      </button>
      <button 
        onClick={() => translatePage('ur')}
        disabled={isTranslating || language === 'ur'}
      >
        {isTranslating && language === 'ur' ? 'ترجمہ ہو رہا ہے...' : 'اردو'}
      </button>
      
      {isTranslating && (
        <div className="translation-progress">
          <p>Translating page...</p>
        </div>
      )}
    </div>
  );
};

export default TranslationComponent;