
"use client";

import { useLanguage } from '@/context/language-context';
import ProjectCard from '@/components/project-card';
import { projects } from '@/lib/project-data';

export default function ProjectsPage() {
  const { translations } = useLanguage();
  const t = translations.navigation;
  const projectT = translations.projects_page;

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
