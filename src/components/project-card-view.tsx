
import ProjectCard from '@/components/project-card';
import type { AppProject } from '@/lib/data-service';

interface ProjectCardViewProps {
  projects: AppProject[];
}

export default function ProjectCardView({ projects }: ProjectCardViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
