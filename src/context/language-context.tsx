
"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import translationsData from '@/locales/translations.json';

type Translations = typeof translationsData.tr;

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('tr');

  const translations: Translations = (translationsData as any)[language] || translationsData.tr;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
