import { fetchData } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import PersonDetail from '@/components/person-detail';
import translationsData from '@/locales/translations.json';

export default async function PersonDetailPage({ params }: { params: { id: string } }) {
  const { users } = await fetchData();
  const user = users.find(u => u.id.toString() === params.id);

  if (!user) {
    notFound();
  }
  
  // We assume 'tr' as default language for server-side rendering
  const t = translationsData.tr.people_page;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PersonDetail user={user} />
    </div>
  );
}
