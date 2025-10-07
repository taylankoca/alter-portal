
import { fetchData } from '@/lib/data-service';
import OrgChartView from '@/components/org-chart-view';
import translationsData from '@/locales/translations.json';
import type { ApiUser } from '@/lib/data-service';

export default async function SchemaPage() {
  const { users } = await fetchData();
  const t = translationsData.tr.schema_page;

  return (
    <div className="space-y-6">
      <header>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </header>
      <OrgChartView users={users} />
    </div>
  );
}
