
import { fetchUsers } from '@/lib/data-service';
import PeopleDirectory from '@/components/people-directory';
import translationsData from '@/locales/translations.json';

// This is a Server Component
export default async function PeoplePage() {
  // Data is fetched on the server from /api/users
  let users = await fetchUsers();
  
  // Sort users alphabetically by last name on the server
  users = users.sort((a, b) => a.last_name.localeCompare(b.last_name, 'tr', { sensitivity: 'base' }));

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
      {/* Pass the server-fetched and sorted data to the client component */}
      <PeopleDirectory users={users} />
    </div>
  );
}
