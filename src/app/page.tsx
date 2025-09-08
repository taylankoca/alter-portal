
"use client";

import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '@/components/language-switcher';

export default function LoginPage() {
  const { translations } = useLanguage();
  const router = useRouter();
  const t = translations.login;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add actual authentication logic
    router.push('/dashboard');
  };

  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
       <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
            <Image src="/alter_logo_ready.png" alt="Alter Portal Logo" width={180} height={50} className="mb-4" />
            <p className="text-muted-foreground">{t.welcome_back}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t.login_title}</CardTitle>
            <CardDescription>{t.login_description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">{t.username_label}</Label>
                  <Input id="username" placeholder={t.username_placeholder} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t.password_label}</Label>
                  <Input id="password" type="password" placeholder={t.password_placeholder} required />
                </div>
                <Button type="submit" className="w-full mt-2">
                  {t.login_button}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
