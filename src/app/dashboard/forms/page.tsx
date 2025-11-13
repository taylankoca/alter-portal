
import { fetchAvailableForms } from '@/lib/data-service';
import translationsData from '@/locales/translations.json';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default async function FormsPage() {
  const forms = await fetchAvailableForms();
  const t = translationsData.tr.forms_page;
  const navT = translationsData.tr.navigation;

  return (
    <div className="space-y-6">
       <header>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{navT.forms}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </header>

       {forms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col">
              <CardHeader className="flex-grow">
                <CardTitle>{form.title}</CardTitle>
                <CardDescription>{form.description || t.no_description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={`/dashboard/forms/${form.code}`} passHref>
                  <Button className="w-full">
                    <span>{t.fill_form}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div className="text-center">
                <h3 className="mt-4 text-lg font-semibold">{t.no_forms_title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.no_forms_description}</p>
            </div>
        </div>
      )}
    </div>
  );
}
