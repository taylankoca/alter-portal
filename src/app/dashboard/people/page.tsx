
import { fetchData } from '@/lib/data-service';
import PeopleListView from '@/components/people-list-view';
import translationsData from '@/locales/translations.json';

// This is a Server Component
export default async function PeoplePage() {
  // Data is fetched on the server
  const { users } = await fetchData();
  
  // We assume 'tr' as default language for server-side rendering,
  // the client-side context will handle language changes.
  const t = translationsData.tr.people_page;

  return (
    <div className="space-y-6">
      <header>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </header>
      {/* Pass the server-fetched data to the client component */}
      <PeopleListView users={users} />
    </div>
  );
}
