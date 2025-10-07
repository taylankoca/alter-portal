
import { fetchUnitsData } from '@/lib/data-service';
import translationsData from '@/locales/translations.json';
import SchemaClient from './schema-client';

export default async function SchemaPage() {
  const { units } = await fetchUnitsData();
  const t = translationsData.tr.schema_page;

  return (
    <div className="space-y-6">
      <header>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </header>
      <SchemaClient units={units} />
    </div>
  );
}
