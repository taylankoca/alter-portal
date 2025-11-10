
"use client";

import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '@/components/language-switcher';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function LoginPage() {
  const { translations } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const t = translations.login;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Login successful, save user data to localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      router.push('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
       <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
            <Image src="/alter_logo_ready.png" alt="Alter Portal Logo" width={180} height={50} className="mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-2">Portal</h1>
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
                 {error && (
                   <Alert variant="destructive">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Giriş Hatası</AlertTitle>
                      <AlertDescription>
                        {error}
                      </AlertDescription>
                    </Alert>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">{t.email_label}</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder={t.email_placeholder} 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t.password_label}</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder={t.password_placeholder} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                   {isLoading ? 'Giriş yapılıyor...' : t.login_button}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
