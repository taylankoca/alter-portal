
"use client";

import { useState, useMemo } from 'react';
import { LayoutGrid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppProject } from '@/lib/data-service';
import ProjectCardView from '@/components/project-card-view';
import ProjectListView from '@/components/project-list-view';
import { Input } from './ui/input';

interface ProjectViewProps {
  projects: AppProject[];
}

export default function ProjectView({ projects }: ProjectViewProps) {
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchTerm) {
      return projects;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return projects.filter(project => 
      (project.title?.toLowerCase() || '').includes(lowercasedFilter) ||
      (project.description?.toLowerCase() || '').includes(lowercasedFilter) ||
      (project.alterProjectNo?.toLowerCase() || '').includes(lowercasedFilter) ||
      (project.employer?.toLowerCase() || '').includes(lowercasedFilter) ||
      (project.location?.toLowerCase() || '').includes(lowercasedFilter)
    );
  }, [projects, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Proje ara..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center justify-end gap-2">
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}>
            <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}>
            <List className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {view === 'grid' ? (
        <ProjectCardView projects={filteredProjects} />
      ) : (
        <ProjectListView projects={filteredProjects} />
      )}
    </div>
  );
}
