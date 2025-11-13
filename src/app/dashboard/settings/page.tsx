
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function SettingsPage() {
  const { translations } = useLanguage();
  const { toast } = useToast();
  const t = translations.settings_page;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formSchema = z.object({
    current_password: z.string().min(1, { message: t.current_password_required }),
    new_password: z.string().min(8, { message: t.new_password_min_length }),
    new_password_confirmation: z.string(),
  }).refine((data) => data.new_password === data.new_password_confirmation, {
    message: t.passwords_do_not_match,
    path: ["new_password_confirmation"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    // Placeholder for API call
    console.log(values);

    // TODO: Implement API call to /api/user/change-password
    
    // Simulating API call for now
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Example of a successful response
    toast({
        title: t.success_title,
        description: t.success_description,
    });
    form.reset();

    // Example of a failed response
    // setError("Mevcut şifreniz hatalı.");

    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <header>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{translations.navigation.settings}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </header>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t.form_title}</CardTitle>
          <CardDescription>{t.form_description}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
               {error && (
                   <Alert variant="destructive">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>{t.error_title}</AlertTitle>
                      <AlertDescription>
                        {error}
                      </AlertDescription>
                    </Alert>
                )}
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.current_password}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.new_password}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                     <FormDescription>
                      {t.new_password_description}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.confirm_new_password}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t.saving_button : t.save_button}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
