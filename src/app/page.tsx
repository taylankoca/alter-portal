"use client";

import { ApplicationForm } from '@/components/application-form';
import { useLanguage } from '@/context/language-context';

export default function Home() {
  const { translations } = useLanguage();
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <div className="space-y-8 py-12">
          <header className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
              {translations.home.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {translations.home.description}
            </p>
          </header>
          <ApplicationForm />
        </div>
      </div>
    </main>
  );
}
