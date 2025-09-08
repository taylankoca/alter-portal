import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'Alter Finans',
  description: 'Şirketinizin finansal gelir ve giderlerini yönetin.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <LanguageProvider>
          <Header />
          {children}
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
