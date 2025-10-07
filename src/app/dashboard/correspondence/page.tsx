
"use client";

import { useLanguage } from '@/context/language-context';

export default function CorrespondencePage() {
  const { translations } = useLanguage();
  const t = translations.navigation;

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.correspondence}</h1>
    </div>
  );
}
