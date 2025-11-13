
import { fetchFormByCode } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import FormClient from './form-client';
import translationsData from '@/locales/translations.json';

export default async function FormPage({ params }: { params: { code: string } }) {
  const form = await fetchFormByCode(params.code);

  if (!form) {
    notFound();
  }

  const t = translationsData.tr.forms_page;

  return (
    <div className="space-y-6">
       <header>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{form.title}</h1>
          {form.description && <p className="text-muted-foreground">{form.description}</p>}
        </div>
      </header>
      <FormClient form={form} />
    </div>
  );
}
