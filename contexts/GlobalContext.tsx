
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../translations';

type Theme = 'light' | 'dark';

interface GlobalContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('vi');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const t = (key: string): string => {
    // @ts-ignore
    return TRANSLATIONS[lang][key] || key;
  };

  useEffect(() => {
    // Apply theme to body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <GlobalContext.Provider value={{ theme, toggleTheme, lang, setLang, t }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
