
"use client";

import { useLanguage } from '@/context/language-context';

export default function PortalDashboard() {
  const { translations } = useLanguage();
  const t = translations.navigation;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.dashboard}</h1>
      </header>
    </div>
  );
}
