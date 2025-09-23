
"use client";

import { useLanguage } from '@/context/language-context';
import ProjectCard from '@/components/project-card';
import { placeholderImages } from '@/lib/placeholder-images.json';

// Mock project data
const projects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of the company website.',
    owner: 'Ahmet Yılmaz',
    image: placeholderImages.project1,
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'New cross-platform mobile application.',
    owner: 'Ayşe Kaya',
    image: placeholderImages.project2,
  },
  {
    id: '3',
    title: 'Q3 Marketing Campaign',
    description: 'Digital marketing campaign for the third quarter.',
    owner: 'Fatma Demir',
    image: placeholderImages.project3,
  },
    {
    id: '4',
    title: 'Internal CRM Tool',
    description: 'Development of an in-house CRM system.',
    owner: 'Mehmet Çelik',
    image: placeholderImages.project4,
  },
    {
    id: '5',
    title: 'API Integration Project',
    description: 'Integrating third-party APIs into our system.',
    owner: 'Zeynep Arslan',
    image: placeholderImages.project5,
  },
    {
    id: '6',
    title: 'Data Center Migration',
    description: 'Migrating all servers to a new data center.',
    owner: 'Mustafa Öztürk',
    image: placeholderImages.project6,
  },
];


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
