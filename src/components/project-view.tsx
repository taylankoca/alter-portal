
"use client";

import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppProject } from '@/lib/data-service';
import { useLanguage } from '@/context/language-context';
import ProjectCardView from '@/components/project-card-view';
import ProjectListView from '@/components/project-list-view';

interface ProjectViewProps {
  projects: AppProject[];
}

export default function ProjectView({ projects }: ProjectViewProps) {
  const { language } = useLanguage();
  const [view, setView] = useState('grid');

  return (
    <div>
      <div className="flex items-center justify-end gap-2 mb-4">
        <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}>
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}>
          <List className="h-4 w-4" />
        </Button>
      </div>

      {view === 'grid' ? (
        <ProjectCardView projects={projects} />
      ) : (
        <ProjectListView projects={projects} />
      )}
    </div>
  );
}
