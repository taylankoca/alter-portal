import ProjectCard from '@/components/project-card';
import { fetchData } from '@/lib/data-service';
import translationsData from '@/locales/translations.json';

export default async function ProjectsPage() {
  // We can't use the hook here anymore, so we'll just use the default 'tr' translations.
  const t = translationsData.tr.navigation;
  const projectT = translationsData.tr.projects_page;
  const { projects } = await fetchData();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.projects}</h1>
        <p className="text-muted-foreground">{projectT.description}</p>
      </header>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
