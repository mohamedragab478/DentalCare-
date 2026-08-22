import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, Theme } from '../i18n/translations';

type TranslationKey = keyof typeof translations.en;

interface ThemeLanguageContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize Theme from localStorage or default to light
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('dentalcare_theme') as Theme;
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    } catch {
      // ignore
    }
    return 'light';
  });

  // Initialize Language from localStorage or default to Arabic (or English)
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('dentalcare_lang') as Language;
      if (savedLang === 'ar' || savedLang === 'en') return savedLang;
    } catch {
      // ignore
    }
    return 'ar'; // Default to Arabic as requested by user
  });

  useEffect(() => {
    try {
      localStorage.setItem('dentalcare_theme', theme);
    } catch {}

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('dentalcare_lang', lang);
    } catch {}

    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLanguage = () => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: TranslationKey): string => {
    const langDict = translations[lang] || translations.en;
    return (langDict as Record<string, string>)[key] || translations.en[key] || String(key);
  };

  const isRTL = lang === 'ar';

  return (
    <ThemeLanguageContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        lang,
        setLang,
        toggleLanguage,
        t,
        isRTL
      }}
    >
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useAppThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useAppThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};
