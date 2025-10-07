
"use client";

import { useEffect, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchData, AppProject } from '@/lib/data-service';
import translationsData from '@/locales/translations.json';
import { useLanguage } from '@/context/language-context';
import ProjectCardView from '@/components/project-card-view';
import ProjectListView from '@/components/project-list-view';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsPage() {
  const { language } = useLanguage();
  const [view, setView] = useState('grid');
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [loading, setLoading] = useState(true);

  // We can't use the hook here anymore, so we'll just use the default 'tr' translations.
  const t = (translationsData as any)[language].navigation;
  const projectT = (translationsData as any)[language].projects_page;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { projects } = await fetchData();
      setProjects(projects);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.projects}</h1>
          <p className="text-muted-foreground">{projectT.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div>
          {view === 'grid' ? (
            <ProjectCardView projects={projects} />
          ) : (
            <ProjectListView projects={projects} />
          )}
        </div>
      )}
    </div>
  );
}
