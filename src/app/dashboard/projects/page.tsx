
import { fetchData } from '@/lib/data-service';
import ProjectView from '@/components/project-view';
import translationsData from '@/locales/translations.json';

// This is now a Server Component
export default async function ProjectsPage() {
  // Data is fetched on the server
  const { projects } = await fetchData();
  
  // We assume 'tr' as default language for server-side rendering,
  // the client-side context will handle language changes.
  const t = translationsData.tr.navigation;
  const projectT = translationsData.tr.projects_page;

  return (
    <div className="space-y-6">
      <header>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.projects}</h1>
          <p className="text-muted-foreground">{projectT.description}</p>
        </div>
      </header>
      {/* Pass the server-fetched data to the client component */}
      <ProjectView projects={projects} />
    </div>
  );
}
